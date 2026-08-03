import os
from dotenv import load_dotenv
load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY", "")
from google import genai
from google.genai import types

client = genai.Client(api_key=api_key)

image_models = [
    "imagen-4.0-generate-001",
    "imagen-4.0-fast-generate-001",
    "gemini-3.1-flash-image",
    "gemini-2.5-flash-image"
]

for m in image_models:
    print(f"\n--- Testing Image Model: {m} ---")
    try:
        res = client.models.generate_images(
            model=m,
            prompt="A photorealistic white FIBC bulk bag standing on a clean studio floor",
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1",
                output_mime_type="image/jpeg"
            )
        )
        if res and hasattr(res, "generated_images") and len(res.generated_images) > 0:
            print(f"SUCCESS! {m} generated image of size {len(res.generated_images[0].image.image_bytes)} bytes.")
            break
        else:
            print(f"Result returned no images: {res}")
    except Exception as e:
        print(f"Failed for {m}: {type(e).__name__}: {e}")
