from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    if request.method == 'GET':
        return jsonify({"message": "Chat endpoint is working. Use POST to send messages."})

    # Handle POST request
    user_message = request.json.get('message', '')
    nyra_responses = {
        "hello": "Hi there! How can I assist you today?",
        "how are you": "I'm doing great! Thanks for asking.",
        "bye": "Goodbye! Talk to you soon."
    }
    nyra_response = nyra_responses.get(user_message.lower(), "I'm not sure how to respond to that.")
    return jsonify({"response": nyra_response})


if __name__ == '__main__':
    app.run(debug=True)
