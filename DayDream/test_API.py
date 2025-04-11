import requests

# Change this to match your server URL and port
API_URL = "http://127.0.0.1:8000/query"

payload = {
    "message": "69",
    "language": "French",
    "difficulty": "beginner"
}

try:
    response = requests.post(API_URL, json=payload)
    response.raise_for_status()  # Raise an error if something goes wrong
    data = response.json()
    print("AI Response:\n", data.get("reply") or data.get("error"))
except requests.exceptions.RequestException as e:
    print("Error calling the API:", e)
