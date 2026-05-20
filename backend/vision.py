import os
import io
import base64
from PIL import Image
from dotenv import load_dotenv, find_dotenv
from groq import Groq

load_dotenv(find_dotenv(), override=True)


def detect_ingredients(image_data: bytes) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    print(f"GROQ KEY BEING USED: {api_key[:15] if api_key else 'NOT FOUND'}")

    if not api_key:
        raise ValueError("GROQ_API_KEY not set")

    client = Groq(api_key=api_key)

    # Convert image to base64
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    image_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_b64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": "List every food ingredient visible in this image. Return ONLY a clean comma-separated list. Example: tomatoes, eggs, spinach, bread. If nothing is visible return: No ingredients found"
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        return response.choices[0].message.content

    except Exception as e:
        print(f"GROQ ERROR: {str(e)}")
        return f"Error: {str(e)}"