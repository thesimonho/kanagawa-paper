import random
from abc import ABC

class Sample(ABC):
    """A repeatable syntax sample."""
    def value(self, enabled: bool = False) -> str:
        # Ordinary comment
        missing = None
        name = type(self).__name__
        return name if enabled else str(random.random())
