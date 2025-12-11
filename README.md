# Audio Transcription

This project is a web application that allows users to upload audio files and transcribe them into text using OpenAI's Whisper model running locally. It consists of a Python backend using FastAPI and a frontend built with Next.js.

## Prerequisites

Before running the project, ensure you have the following installed on your system:

- Python 3.8 or higher
- Node.js and npm
- ffmpeg (Required for audio processing by Whisper)

### Installing ffmpeg

On Ubuntu/Debian:
```bash
sudo apt update && sudo apt install ffmpeg
```

On macOS (using Homebrew):
```bash
brew install ffmpeg
```

On Windows:
Download and install from the official ffmpeg website or use a package manager like Chocolatey (`choco install ffmpeg`).

## Backend Setup

The backend handles the audio processing and transcription.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   python main.py
   ```

The backend server will start at `http://0.0.0.0:8000`.
Note: On the first run, the application will download the Whisper model. This may take some time depending on your internet connection.

## Frontend Setup

The frontend provides the user interface for uploading files and viewing transcriptions.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

## Usage

1. Ensure both the backend and frontend servers are running.
2. Open your web browser and go to `http://localhost:3000`.
3. Drag and drop an audio file into the upload area or click to select a file.
4. Click the "Start Transcription" button.
5. Wait for the process to complete. The transcribed text will appear on the screen.

## Notes

- The application uses the "large" Whisper model by default if a GPU is available, or falls back to "medium" on CPU to ensure reasonable performance.
- Supported audio formats include MP3, WAV, M4A, and OGG.
