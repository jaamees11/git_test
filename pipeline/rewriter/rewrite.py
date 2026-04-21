from ..models import Item
from ..utils import get_logger, load_yaml
from . import extractive
from .llm_clients import llm_rewrite

log = get_logger(__name__)


def rewrite_all(items: list[Item]) -> list[Item]:
    style = load_yaml("style.yaml").get("rewrite", {})
    template = style.get("rewrite_prompt_template", "")
    max_chars = int(style.get("max_blurb_chars", 280))

    llm_hits = 0
    extractive_hits = 0
    for it in items:
        content = it.raw_blurb or it.title
        if not content:
            it.rewritten_blurb = ""
            continue

        prompt = template.format(title=it.title, source=it.source, content=content)
        llm_out = llm_rewrite(prompt, max_chars=max_chars) if template else None

        if llm_out:
            it.rewritten_blurb = llm_out
            llm_hits += 1
        else:
            it.rewritten_blurb = extractive.rewrite(it.title, it.source, content, max_chars=max_chars)
            extractive_hits += 1

    log.info("Rewriter: %d via LLM, %d via extractive", llm_hits, extractive_hits)
    return items
