from abc import ABC, abstractmethod


class AIProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str, mode: str = "explain", context: str = "") -> dict:
        """
        Returns:
            {
                "result": str,
                "prompt_tokens": int,
                "completion_tokens": int,
                "total_tokens": int,
            }
        """
        raise NotImplementedError
