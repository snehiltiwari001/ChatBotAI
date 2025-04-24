# Email Spam Classifier with 3D Interface

A modern web application that classifies emails as spam or ham (not spam) using machine learning, featuring a beautiful 3D interface and an integrated chatbot.

## Features

- Email spam classification using machine learning
- Interactive 3D visualization using Three.js
- Real-time chatbot assistance
- Modern, responsive UI with Material-UI
- Beautiful dark theme
- Python Flask backend with scikit-learn

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd email-spam-classifier
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
npm install
# or
yarn install
```

## Running the Application

1. Start the Flask backend:
```bash
python app.py
```

2. In a new terminal, start the React frontend:
```bash
npm start
# or
yarn start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter the email content in the text area
2. Click "Classify Email" to analyze the content
3. View the 3D visualization that changes color based on the classification
4. Use the chatbot for assistance by clicking the chat button
5. View detailed classification results including spam probability

## API Integration

The application uses the following API endpoints:

- `/api/classify` - POST endpoint for email classification
- `/api/chatbot` - POST endpoint for chatbot interaction

## Technologies Used

- Frontend:
  - React
  - Three.js (@react-three/fiber)
  - Material-UI
  - Axios

- Backend:
  - Flask
  - scikit-learn
  - NLTK
  - NumPy
  - Pandas

## License

MIT 