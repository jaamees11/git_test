"""
Two-step link enhancement for outbound links:

1. **Affiliate codes** — append a tracking param when the host matches a
   program in config/affiliates.yaml (idempotent, safe for unknown hosts).
2. **UTM tags** — append utm_source / utm_medium / utm_campaign to EVERY
   outbound http(s) link so you can track which issue drove clicks. Toggle
   via `utm.enabled` in config/affiliates.yaml.

Order matters: affiliates run first (so the affiliate host-match isn't
confused by utm_* params already present from a previous run).
"""
from datetime import datetime
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from ..models import Item
from ..utils import get_logger, load_yaml

log = get_logger(__name__)


def _load_config() -> dict:
    try:
        cfg = load_yaml("affiliates.yaml") or {}
    except FileNotFoundError:
        return {}
    return cfg


def _match(host: str, programs: list[dict]) -> dict | None:
    host = (host or "").lower().lstrip(".")
    if host.startswith("www."):
        host = host[4:]
    for p in programs:
        target = (p.get("host") or "").lower().lstrip(".")
        if not target:
            continue
        if host == target or host.endswith("." + target):
            return p
    return None


def _inject(url: str, programs: list[dict]) -> str:
    try:
        parts = urlparse(url)
    except Exception:
        return url
    if parts.scheme not in ("http", "https"):
        return url
    program = _match(parts.netloc, programs)
    if not program:
        return url
    param = program.get("param")
    code = program.get("code")
    if not param or not code:
        return url
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    if param in query:
        return url
    query[param] = code
    return urlunparse(parts._replace(query=urlencode(query)))


def _inject_utms(url: str, utms: dict) -> str:
    if not utms:
        return url
    try:
        parts = urlparse(url)
    except Exception:
        return url
    if parts.scheme not in ("http", "https"):
        return url
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    changed = False
    for key, value in utms.items():
        if not value:
            continue
        # Never overwrite an existing UTM — callers may have set them.
        if key in query and query[key]:
            continue
        query[key] = value
        changed = True
    if not changed:
        return url
    return urlunparse(parts._replace(query=urlencode(query)))


def build_utms(
    campaign: str | None = None,
    source: str = "newsletter",
    medium: str = "email",
) -> dict:
    """Default UTM set for a daily issue.

    Campaign defaults to today's date so every issue has a unique stamp in
    Beehiiv analytics and the landing target's analytics.
    """
    if not campaign:
        campaign = f"ai-pulse-{datetime.utcnow().strftime('%Y-%m-%d')}"
    return {
        "utm_source": source,
        "utm_medium": medium,
        "utm_campaign": campaign,
    }


def apply_to_items(
    items: list[Item],
    *,
    utms: dict | None = None,
) -> list[Item]:
    cfg = _load_config()
    programs = cfg.get("programs") or []
    utm_cfg = cfg.get("utm") or {}
    utm_enabled = utm_cfg.get("enabled", True)

    if utms is None:
        utms = build_utms() if utm_enabled else {}
    elif not utm_enabled:
        utms = {}

    affiliate_hits = 0
    utm_hits = 0
    for it in items:
        original = it.url
        # 1. Affiliate first (so the host-match sees the clean domain).
        if programs:
            it.url = _inject(it.url, programs)
            if it.url != original:
                affiliate_hits += 1
        # 2. UTMs on everything.
        if utms:
            before_utm = it.url
            it.url = _inject_utms(it.url, utms)
            if it.url != before_utm:
                utm_hits += 1

    if affiliate_hits:
        log.info("Affiliate links injected on %d items", affiliate_hits)
    if utm_hits:
        log.info("UTM tags injected on %d items", utm_hits)
    return items
