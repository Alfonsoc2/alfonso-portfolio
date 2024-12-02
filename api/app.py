from flask import Flask, jsonify, request
import google.generativeai as genai
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables for local development
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY")

# Check if the API key was loaded correctly
if not api_key:
    print("API key not found! Please set the GOOGLE_API_KEY environment variable.")
else:
    print("API key successfully loaded.")

# Configure the Gemini API with the loaded API key
genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

@app.route('/chat', methods=['POST'])
def chat():
    """Handles POST requests from the frontend."""
    # Get the user message from the frontend
    user_message = request.json.get('message', '')

    # If no message is provided, return a 400 error
    if not user_message:
        return jsonify({"response": "Please send a valid message."}), 400

    try:
        # Use Gemini Flash 1.5 to generate a response
        response_text = send_to_gemini(user_message)
        return jsonify({"response": response_text})
    except Exception as e:
        print(f"Error communicating with Gemini Flash 1.5: {e}")
        return jsonify({"response": "There was an error processing your request. Please try again later."}), 500


def send_to_gemini(message):
    """Uses Gemini Flash 1.5 to process the input and return a response."""
    try:
        # Call the appropriate method on the GenerativeModel instance
        model = genai.GenerativeModel("gemini-1.5-flash", 
                                      system_instruction="You are Nyra, a professional AI assistant. Maintain a polished, professional tone in all responses. While you are confident and capable, focus on providing clear, concise, and accurate information. You are here to assist users effectively with any queries they have.")
        
        # Generate content based on the user's message
        response = model.generate_content(contents=[message])  # Pass message as a list

        # Log minimal debug information (optional)
        if response.candidates:
            print(f"Response received: {response.candidates[0].content.parts[0].text.strip()}")

        # Extract and return the response content from the 'parts' array
        if response.candidates:
            candidate = response.candidates[0]
            if candidate.content and candidate.content.parts:
                return ''.join(part.text for part in candidate.content.parts)

        return "Hmm, I didn’t quite catch that."
    
    except Exception as e:
        print(f"Error communicating with Gemini Flash 1.5: {e}")
        raise


# This function is required for Vercel to treat this as a serverless function
def handler(req, res):
    return app(req, res)


if __name__ == '__main__':
    # Run the app in debug mode locally
    app.run(debug=True)
