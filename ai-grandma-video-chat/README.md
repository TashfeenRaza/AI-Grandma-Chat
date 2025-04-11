# AI Grandma Video Chat

A web application that transforms your grandma's photo into an interactive AI video chat. Upload a photo, ask a question, and see your grandma respond in a video with authentic grandma speech patterns.

## Features

- Photo upload with face detection verification
- AI-generated grandma-style responses using GPT-4
- Text-to-speech conversion with ElevenLabs
- Face animation using D-ID API
- Video playback of the animated response
- Old photo album aesthetic UI

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI components
- Vite for fast development
- React Dropzone for file uploads

### Backend
- Node.js with Express
- TypeScript for type safety
- Multer for file handling
- OpenAI, ElevenLabs, and D-ID API integrations
- AWS S3 for file storage

## Getting Started

### Prerequisites

- Node.js 18 or later
- API keys for:
  - OpenAI
  - ElevenLabs
  - D-ID
  - AWS S3

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-grandma-video-chat.git
   cd ai-grandma-video-chat
   ```

2. Create a `.env` file based on `.env.example` and add your API keys.

3. Install dependencies:
   ```
   npm run install:all
   ```

4. Start the development servers:
   ```
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

## Usage

1. Upload a photo of a grandma.
2. Wait for the verification that a face was detected.
3. Type your question in the text box.
4. Click "Ask Grandma" and wait for the video response.
5. Watch the video and enjoy your AI grandma's response!

## Deployment

### Docker

Build and run the Docker container:

```
docker build -t ai-grandma-video-chat .
docker run -p 8000:8000 ai-grandma-video-chat
```

### Render.com

This project includes a `render.yaml` configuration file for easy deployment to Render.com. Simply connect your repository to Render and import the configuration.

## Rate Limiting

The free tier limits users to 5 requests per hour to prevent API abuse.

## License

MIT 