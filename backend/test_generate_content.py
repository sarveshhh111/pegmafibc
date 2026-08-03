import os
import base64
from dotenv import load_dotenv
load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY", "")
from google import genai
from google.genai import types

client = genai.Client(api_key=api_key)

image_content_models = [
    "gemini-2.5-flash-image",
    "gemini-3.1-flash-image",
    "gemini-3-pro-image",
    "imagen-3.0-generate-002"
]

for m in image_content_models:
    print(f"\n--- Testing generate_content with Model: {m} ---")
    try:
        res = client.models.generate_content(
            model=m,
            contents="Generate a clean industrial studio product photograph of a white FIBC bulk bag standing on a light floor",
            config=types.GenerateContentConfig(
                response_mime_type="image/jpeg"
            )
        )
        print("Success generate_content for model:", m)
        if res.candidates:
            for part in res.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    print(f"-> Got image bytes: {len(part.inline_data.data)} bytes")
                    break
        break
    except Exception as e:
        print(f"Failed for {m}: {type(e).__name__}: {e}")
