# Express TypeScript Server

A simple Express server built with TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

## Development

Run the server in development mode with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the PORT specified in your .env file).

## Production

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with nodemon (hot reload)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled production server

## API Endpoints

- `GET /health` - Health check endpoint that returns `{ ok: true }`

## Project Structure

```
server/
├── src/
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json       # TypeScript configuration
├── .env.example        # Environment variables template
└── .gitignore
```

## Environment Variables

- `PORT` - Server port (default: 5000)
