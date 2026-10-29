"""EcoAssistant AI service - calls OpenAI API with a specialized system prompt."""
import os
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

# Initialize client (API key is read from environment variable OPENAI_API_KEY)
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# System prompt: defines the role and knowledge of the EcoAssistant
SYSTEM_PROMPT = """You are EcoAssistant, the AI guide of Atlasphere, a decentralized governance dApp on Pi Network.
Your role is to help Pi Pioneers understand and reduce their environmental impact within the Atlasphere ecosystem.

You can answer questions about:
- How to reduce their carbon footprint (advice, tips, eco-actions).
- Their ecological score (how it is calculated, how to improve it).
- Carbon credits on Atlasphere (what they are, how to earn/use them).
- Personalized recommendations based on their profile.
- IoT sensors data (if relevant to their question).

Always be kind, clear, and concise. Answer in the same language as the user's question.
If a question is outside your scope (e.g., general Pi Network questions, technical bugs), politely redirect the user to the appropriate Atlasphere page or support.
"""

async def get_eco_assistant_response(user_message: str) -> str:
    """Get a response from the EcoAssistant AI."""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",  # or "gpt-3.5-turbo" for lower cost
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=500,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"EcoAssistant API error: {e}")
        return "I'm sorry, I encountered an error while processing your request. Please try again later."
