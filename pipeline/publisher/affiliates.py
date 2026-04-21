"""
Auto-append affiliate tracking params to outbound links when the host matches
a program in config/affiliates.yaml.

Idempotent: if the param is already on the URL, leaves it alone.
Safe: only touches URLs whose host (or parent host) is explicitly listed.
"""
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from ..models import Item
from ..utils import get_logger, load_yaml

log = get_logger(__name__)


def _load_programs() -> list[dict]:
    try:
        cfg = load_yaml("affiliates.yaml") or {}
    except FileNotFoundError:
        return []
    return cfg.get("programs") or []


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


def apply_to_items(items: list[Item]) -> list[Item]:
    programs = _load_programs()
    if not programs:
        return items
    touched = 0
    for it in items:
        new_url = _inject(it.url, programs)
        if new_url != it.url:
            it.url = new_url
            touched += 1
    if touched:
        log.info("Affiliate links injected on %d items", touched)
    return items
