"""
Free-tier LLM clients. No extra SDKs — plain HTTP via httpx to keep deps lean.

Order of preference:
  1. Gemini free tier  (GEMINI_API_KEY)   -- 1500 req/day, quality > speed
  2. Groq free tier    (GROQ_API_KEY)     -- fast, good Llama 3.3 70B
  3. Extractive fallback (always available)

All clients return a plain string or None on any failure.
"""
import os

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from ..utils import get_logger, truncate

log = get_logger(__name__)

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.5-flash:generateContent"
)
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"


@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, max=5), reraise=False)
def _gemini_call(prompt: str, api_key: str) -> str | None:
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 120},
    }
    with httpx.Client(timeout=30.0) as client:
        r = client.post(
            GEMINI_URL,
            params={"key": api_key},
            json=payload,
            headers={"Content-Type": "application/json"},
        )
        if r.status_code == 429:
            log.warning("Gemini rate-limited")
            return None
        r.raise_for_status()
        data = r.json()
        candidates = data.get("candidates") or []
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts") or []
        texts = [p.get("text", "") for p in parts if p.get("text")]
        return " ".join(texts).strip() or None


@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, max=5), reraise=False)
def _groq_call(prompt: str, api_key: str) -> str | None:
    payload = {
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.4,
        "max_tokens": 120,
    }
    with httpx.Client(timeout=30.0) as client:
        r = client.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        if r.status_code == 429:
            log.warning("Groq rate-limited")
            return None
        r.raise_for_status()
        data = r.json()
        choices = data.get("choices") or []
        if not choices:
            return None
        return (choices[0].get("message", {}).get("content") or "").strip() or None


def llm_rewrite(prompt: str, max_chars: int = 280) -> str | None:
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    groq_key = os.getenv("GROQ_API_KEY", "").strip()

    if gemini_key:
        try:
            out = _gemini_call(prompt, gemini_key)
            if out:
                return truncate(out.strip('"').strip(), max_chars)
        except Exception as e:
            log.warning("Gemini failed: %s", e)

    if groq_key:
        try:
            out = _groq_call(prompt, groq_key)
            if out:
                return truncate(out.strip('"').strip(), max_chars)
        except Exception as e:
            log.warning("Groq failed: %s", e)

    return None
