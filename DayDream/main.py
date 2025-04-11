from fastapi import FastAPI, Request
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = FastAPI()

@app.post("/query")
async def query(request: Request):
    data = await request.json()
    message = data["message"]
    language = data.get("language", "English")
    difficulty = data.get("difficulty", "beginner")

    # prompt = f"You are a employee at a bank in France. Speak in {language} and use {difficulty}-level phrasing. Respond to: {message}"

    prompt = f"What is 69 time {message}?"


    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://yourproject.com"  # required
    }

    payload = {
        "model": "meta-llama/llama-3.3-70b-instruct:free",
        "messages": [{"role": "user", "content": prompt}]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

    if response.status_code == 200:
        return {"reply": response.json()["choices"][0]["message"]["content"]}
    else:
        return {"error": response.text}
