import os
from dotenv import load_dotenv
load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY", "")
from google import genai

client = genai.Client(api_key=api_key)

print("Listing all available models for this API key:")
try:
    models = client.models.list()
    for m in models:
        print(f"- {m.name} (Supported methods: {getattr(m, 'supported_generation_methods', [])})")
except Exception as e:
    print("Error listing models:", e)
