from flask import Flask, jsonify, request
import google.generativeai as genai
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables for local development
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)

# Set up CORS after initializing the app, allowing the frontend origin
CORS(app, origins=["https://alfonso-portfolio-e8ibs1mht-alfonsoc2s-projects.vercel.app"])

# Get API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY")

# Check if the API key was loaded correctly
if not api_key:
    print("API key not found! Please set the GOOGLE_API_KEY environment variable.")
else:
    print("API key successfully loaded.")

# Configure the Gemini API with the loaded API key
genai.configure(api_key=api_key)

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handles POST requests from the frontend."""
    user_message = request.json.get('message', '')
    if not user_message:
        return jsonify({"response": "Please send a valid message."}), 400

    try:
        response_text = send_to_gemini(user_message)
        return jsonify({"response": response_text})
    except Exception as e:
        print(f"Error communicating with Gemini: {e}")
        return jsonify({"response": "There was an error processing your request. Please try again later."}), 500

def send_to_gemini(message):
    """Uses Gemini Flash 1.5 to process the input and return a response."""
    try:
        model = genai.GenerativeModel("gemini-1.5-flash", 
                                      system_instruction="You are Nyra, a professional AI assistant. Maintain a polished, professional tone in all responses.")
        response = model.generate_content(contents=[message])

        if response.candidates:
            return ''.join(part.text for part in response.candidates[0].content.parts)

        return "Hmm, I didn’t quite catch that."
    except Exception as e:
        print(f"Error communicating with Gemini: {e}")
        raise

# This function is required for Vercel to treat this as a serverless function
def handler(req, res):
    return app(req, res)

# Remove app.run() for Vercel deployment
