from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Optional


@dataclass
class Item:
    title: str
    url: str
    source: str
    category: str
    published: Optional[datetime] = None
    raw_blurb: str = ""
    rewritten_blurb: str = ""
    score: float = 0.0
    extra: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        d = asdict(self)
        if self.published:
            d["published"] = self.published.isoformat()
        return d
