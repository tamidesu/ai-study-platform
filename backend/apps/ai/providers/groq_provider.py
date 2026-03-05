from django.conf import settings
from groq import Groq
from groq import APIError, APIConnectionError, RateLimitError
from rest_framework.exceptions import APIException

from .base import AIProvider

_SYSTEM_PROMPTS = {
    "explain": (
        "You are an AI Study Assistant. "
        "Explain the given topic clearly and in depth so a student can understand it completely. "
        "IMPORTANT: You MUST format your response using rich Markdown (headings ###, bold **, bullet points -, and inline code blocks). "
        "CRITICAL: DO NOT wrap your entire response in a ```markdown code block. Output raw markdown directly."
    ),
    "quiz": (
        "You are an AI Study Assistant. "
        "Generate a mini-quiz with 3-5 questions and their correct answers based on the given topic. "
        "IMPORTANT: You MUST format your response using rich Markdown (headings ###, bold **, bullet points -, and inline code blocks). "
        "CRITICAL: DO NOT wrap your entire response in a ```markdown code block. Output raw markdown directly."
    ),
    "summarize": (
        "You are an AI Study Assistant. "
        "Write a concise, well-structured study summary of the given content. "
        "IMPORTANT: You MUST format your response using rich Markdown (headings ###, bold **, bullet points -, and inline code blocks). "
        "CRITICAL: DO NOT wrap your entire response in a ```markdown code block. Output raw markdown directly."
    ),
    "examples": (
        "You are an AI Study Assistant. "
        "Provide 3-5 concrete, practical examples that clearly illustrate the given concept. "
        "IMPORTANT: You MUST format your response using rich Markdown (headings ###, bold **, bullet points -, and inline code blocks). "
        "CRITICAL: DO NOT wrap your entire response in a ```markdown code block. Output raw markdown directly."
    ),
}


class GroqProvider(AIProvider):
    _MAX_RETRIES = 2

    def __init__(self):
        self._client = Groq(api_key=settings.GROQ_API_KEY)
        self._model = settings.LLM_MODEL

    def generate(self, prompt: str, mode: str = "explain", context: str = "") -> dict:
        system_prompt = _SYSTEM_PROMPTS.get(mode, _SYSTEM_PROMPTS["explain"])
        user_content = f"Context from my notes:\n{context}\n\n{prompt}" if context else prompt

        last_error = None
        for attempt in range(self._MAX_RETRIES + 1):
            try:
                completion = self._client.chat.completions.create(
                    model=self._model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content},
                    ],
                    temperature=0.7,
                    max_tokens=1024,
                )
                usage = completion.usage
                return {
                    "result": completion.choices[0].message.content,
                    "prompt_tokens": usage.prompt_tokens if usage else 0,
                    "completion_tokens": usage.completion_tokens if usage else 0,
                    "total_tokens": usage.total_tokens if usage else 0,
                }
            except RateLimitError as exc:
                last_error = exc
            except APIConnectionError as exc:
                last_error = exc
            except APIError as exc:
                raise APIException(detail=f"AI provider error: {exc.message}") from exc

        raise APIException(detail=f"AI provider unavailable after retries: {last_error}")
