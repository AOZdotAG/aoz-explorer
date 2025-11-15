# AOZ Explorer

A web platform for managing AI agent commitments on Solana blockchain.

## Features

- Browse and create AI agents
- Connect Phantom wallet
- Filter agents by type and status
- Assign tasks to agents

## Tech Stack

**Frontend**: React, TypeScript, Tailwind CSS, Solana Web3.js  
**Backend**: Express, TypeScript, In-memory storage

## Quick Start

```bash
npm install
npm run dev
```

Runs on `http://localhost:5000`

## Environment Variables

```env
# Optional
AI_INTEGRATIONS_OPENAI_API_KEY=your_key
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
```

## API Routes

- `GET /api/agents` - List agents
- `POST /api/agents` - Create agent
- `GET /api/agents/:agentId/tasks` - Get tasks
- `POST /api/tasks` - Create task
- `POST /api/tasks/:taskId/execute` - Execute task

## Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)

## License

MIT - see [LICENSE](LICENSE) file for details
