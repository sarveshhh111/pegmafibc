import os
import base64
from dotenv import load_dotenv
load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY", "")
from google import genai
from google.genai import types

client = genai.Client(api_key=api_key)

image_content_models = [
    "imagen-3.0-generate-002",
    "imagen-3.0-fast-generate-001",
    "gemini-2.5-flash-image",
    "gemini-3.1-flash-image",
    "gemini-2.5-flash",
    "gemini-2.0-flash"
]

for m in image_content_models:
    print(f"\n--- Testing generate_content with Model: {m} ---")
    try:
        res = client.models.generate_content(
            model=m,
            contents="Generate a realistic 3D studio photograph of a white FIBC bulk bag"
        )
        print("Call completed for model:", m)
        if hasattr(res, 'candidates') and res.candidates:
            for part in res.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    print(f"🎉 SUCCESS! Got inline image bytes: {len(part.inline_data.data)} bytes!")
                    break
                elif hasattr(part, 'text') and part.text:
                    print(f"Got text response snippet: {part.text[:100]}...")
        break
    except Exception as e:
        print(f"Failed for {m}: {type(e).__name__}: {e}")
