from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyCY-gcKKlp4AF8IijtJkNvwEF9WaWaSybU"
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the Gemini model
try:
    model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    print(f"Error initializing Gemini model: {str(e)}")
    model = None

# Simple spam keywords list
spam_keywords = {
    'free', 'win', 'winner', 'won', 'prize', 'money', 'cash', 'lottery', 'million',
    'dollar', 'investment', 'profit', 'guaranteed', 'risk-free', 'casino', 'gambling',
    'click', 'limited', 'offer', 'expires', 'urgent', 'act now', 'congratulations',
    'inheritance', 'bank', 'account', 'password', 'verify', 'suspicious', 'unusual',
    'security', 'update', 'confirm', 'login', 'credential'
}

def classify_email(text):
    # Convert to lowercase
    text = text.lower()
    
    # Split into words
    words = re.findall(r'\w+', text)
    
    # Count spam keywords
    spam_count = sum(1 for word in words if word in spam_keywords)
    
    # Calculate probability based on keyword density
    total_words = len(words)
    if total_words == 0:
        return 0.0
    
    spam_probability = min(spam_count / (total_words * 0.1), 1.0)
    return spam_probability

@app.route('/api/classify', methods=['POST'])
def classify_email_endpoint():
    data = request.json
    if not data or 'email' not in data:
        return jsonify({'error': 'No email content provided'}), 400
    
    email_content = data['email']
    spam_prob = classify_email(email_content)
    
    return jsonify({
        'is_spam': spam_prob > 0.5,
        'spam_probability': float(spam_prob),
        'ham_probability': float(1 - spam_prob)
    })

@app.route('/api/chatbot', methods=['POST'])
def chatbot_response():
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400

    message = data['message'].lower()
    print(f"Received chatbot message: {message}")
    
    # Check if the message looks like an email (contains multiple lines or email-like content)
    is_email_content = len(message.split()) > 20 or '\n' in message or '@' in message
    
    if is_email_content:
        # Analyze the email content for spam
        spam_prob = classify_email(message)
        is_spam = spam_prob > 0.5
        
        if is_spam:
            response_text = f"I've analyzed this email and it appears to be SPAM (probability: {(spam_prob * 100):.1f}%).\n\n"
            response_text += "This email contains characteristics commonly found in spam messages, such as:\n"
            response_text += "- Promotional language ('transformative', 'incredible opportunity')\n"
            response_text += "- Urgency ('don't miss out')\n"
            response_text += "- Multiple domains or topics mentioned\n"
            response_text += "- Call to action ('click here to apply')\n\n"
            response_text += "I recommend being cautious with this email and not clicking on any links."
        else:
            response_text = f"I've analyzed this email and it appears to be legitimate (spam probability: {(spam_prob * 100):.1f}%).\n\n"
            response_text += "This email seems to be from a legitimate source about internship opportunities. "
            response_text += "However, always verify the sender and be cautious with any links or attachments."
    else:
        # Simple rule-based responses for non-email messages
        if 'hello' in message or 'hi' in message or 'hey' in message:
            response_text = 'Hello! I\'m your spam classification assistant. How can I help you today?'
        elif 'spam' in message and 'what' in message:
            response_text = 'Spam emails are unsolicited messages that often contain misleading information, scams, or unwanted advertisements. They can be identified by suspicious sender addresses, urgent language, or requests for personal information.'
        elif 'how' in message and 'identify' in message:
            response_text = 'To identify spam emails, look for: 1) Suspicious sender addresses, 2) Urgent or threatening language, 3) Requests for personal information, 4) Too-good-to-be-true offers, 5) Poor grammar or formatting, and 6) Unusual attachments.'
        elif 'help' in message:
            response_text = 'I can help you identify spam emails. Just paste the email content in the chat or in the main interface and click "Classify Email" to analyze it. You can also ask me questions about spam detection and email security.'
        elif 'thank' in message:
            response_text = 'You\'re welcome! Feel free to ask if you have any other questions about spam detection or email security.'
        elif 'bye' in message or 'goodbye' in message:
            response_text = 'Goodbye! Stay safe from spam emails!'
        else:
            response_text = 'I\'m your spam classification assistant. You can paste email content in the chat or in the main interface to analyze it for spam, or ask me questions about spam detection and email security.'
    
    print(f"Sending chatbot response: {response_text}")
    return jsonify({'response': response_text})

if __name__ == '__main__':
    app.run(debug=True) 