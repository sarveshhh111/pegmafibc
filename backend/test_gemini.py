import os
from dotenv import load_dotenv
load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY", "")
print("Testing Gemini Key length:", len(api_key))

from google import genai
from google.genai import types

client = genai.Client(api_key=api_key)

models_to_test = [
    "imagen-3.0-generate-002",
    "imagen-3.0-fast-generate-001",
    "gemini-2.5-flash",
    "gemini-2.0-flash"
]

for m in models_to_test:
    print(f"\n--- Testing Model: {m} ---")
    try:
        res = client.models.generate_images(
            model=m,
            prompt="A white FIBC jumbo bag",
            config=types.GenerateImagesConfig(number_of_images=1)
        )
        print("Success generate_images with model:", m)
        break
    except Exception as e:
        print(f"generate_images failed for {m}: {e}")

    try:
        res = client.models.generate_content(
            model=m,
            contents="Generate an image of a white FIBC bulk bag"
        )
        print("Success generate_content with model:", m)
        break
    except Exception as e:
        print(f"generate_content failed for {m}: {e}")
