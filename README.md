# DB Diagram Viewer

A database schema visualization tool that connects to PostgreSQL and renders tables as interactive diagram nodes with primary keys, foreign keys, and relationships. Built with React, TypeScript, Vite, and Express.

![DB Diagram Viewer](https://img.shields.io/badge/PostgreSQL-Schema%20Viewer-336791?style=flat&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)

## Features

- **Interactive diagram** – Tables displayed as draggable nodes using React Flow
- **Primary keys** – Highlighted with a gold accent (left border + subtle background)
- **Foreign keys** – Highlighted with a blue accent
- **Relationship edges** – Animated lines connecting foreign keys to their referenced primary keys
- **PostgreSQL support** – Reads schema from `information_schema` (tables, columns, constraints)
- **Pan & zoom** – Navigate large schemas with built-in controls and minimap

## Project Structure

```
DB-Diagram-Viewer-TS/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx         # Main app, fetches schema & renders diagram
│   │   ├── TableNode.tsx   # Custom node component for table display
│   │   └── types/
│   │       └── schema.ts   # TypeScript types for schema data
│   └── package.json
├── server/                 # Express + TypeScript backend
│   ├── src/
│   │   ├── server.ts       # API routes & schema extraction
│   │   └── pool.ts         # PostgreSQL connection pool
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** 18+ (with npm)
- **PostgreSQL** (for schema introspection)

## Quick Start

### 1. Clone and install dependencies

```bash
cd DB-Diagram-Viewer-TS

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure the database

Create `server/.env` with your PostgreSQL connection details:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=your_database
PORT=5000
```

The server will start without a database if connection fails, but the diagram will be empty until PostgreSQL is reachable.

### 3. Run the application

**Terminal 1 – start the server:**

```bash
cd server
npm run dev
```

Server runs at `http://localhost:5000`.

**Terminal 2 – start the client:**

```bash
cd client
npm run dev
```

Client runs at `http://localhost:5173` (or the next available port).

Open `http://localhost:5173` in your browser to view the diagram.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check, returns `{ ok: true }` |
| `GET /api/schema` | Full schema: tables, columns, primary/foreign keys, relationships |
| `GET /api/constraints` | Raw constraint data from `information_schema` |

## Schema Response Format

`GET /api/schema` returns:

```json
{
  "tables": [
    {
      "name": "posts",
      "columns": [
        { "name": "id", "type": "integer", "isPrimaryKey": true, "isForeignKey": false },
        { "name": "user_id", "type": "integer", "isPrimaryKey": false, "isForeignKey": true }
      ]
    }
  ],
  "relationships": [
    {
      "fromTable": "posts",
      "fromColumn": "user_id",
      "toTable": "users",
      "toColumn": "id"
    }
  ]
}
```

- `fromTable` / `fromColumn` = table and column with the foreign key
- `toTable` / `toColumn` = referenced table and primary key column

## Scripts

### Server (`server/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (nodemon) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production server |

### Client (`client/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Environment Variables

### Server

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | (empty) | Database password |
| `DB_NAME` | `postgres` | Database name |

### Client

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000` | API base URL |

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, [@xyflow/react](https://xyflow.dev/) (React Flow)
- **Backend:** Express, TypeScript, [pg](https://node-postgres.com/) (PostgreSQL client)
- **Database:** PostgreSQL (schema introspection via `information_schema`)

## License

ISC
