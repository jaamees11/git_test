"""
Beehiiv publisher. Creates a DRAFT post — never auto-sends.
You click 'Send' from the Beehiiv dashboard once you're happy with the draft.
(This is the safest default for a new automation.)

Docs: https://developers.beehiiv.com/api-reference/posts/create
"""
import os

import httpx

from ..utils import get_logger

log = get_logger(__name__)

BEEHIIV_BASE = "https://api.beehiiv.com/v2"


def create_draft(title: str, subtitle: str, body_html: str) -> dict | None:
    api_key = os.getenv("BEEHIIV_API_KEY", "").strip()
    pub_id = os.getenv("BEEHIIV_PUBLICATION_ID", "").strip()

    if not api_key or not pub_id:
        log.warning("BEEHIIV_API_KEY / BEEHIIV_PUBLICATION_ID missing — dry run only")
        return None

    url = f"{BEEHIIV_BASE}/publications/{pub_id}/posts"
    payload = {
        "title": title,
        "subtitle": subtitle,
        "body_content": body_html,
        "status": "draft",
        "content_tags": ["ai", "ai-pulse", "automated"],
    }

    log.info("POST %s (title=%r)", url, title)
    try:
        with httpx.Client(timeout=30.0) as client:
            r = client.post(
                url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            if r.status_code >= 400:
                log.error("Beehiiv error %s: %s", r.status_code, r.text[:500])
                return None
            data = r.json()
            log.info("Beehiiv draft created: id=%s", (data.get("data") or {}).get("id"))
            return data
    except Exception as e:
        log.error("Beehiiv POST failed: %s", e)
        return None
