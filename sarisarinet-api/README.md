# API Template (1BIS)

Lightweight backend starter built with TypeScript, Express, Prisma (MongoDB), Redis, and Swagger.

## Stack
- Node.js + TypeScript
- Express 5
- Prisma ORM (MongoDB)
- Redis (optional cache/features)
- Zod validation
- Swagger/OpenAPI docs
- Socket.IO

## Quick Start
```bash
npm install
```

Create `.env`:
```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/template
JWT_SECRET=replace_with_secure_secret
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=http://localhost:3000
CORS_CREDENTIALS=true
```

Run locally:
```bash
npm run prisma-generate
npm run dev
```

## API Basics
- Health: `GET /` and `GET /health`
- Base API path: `/api`
- Swagger UI (non-production): `/api/swagger`

## Common Scripts
- `npm run dev` - start dev server
- `npm run test` - run tests
- `npm run lint` - lint code
- `npm run build` - build for production
- `npm run prod` - run built server
- `npm run export-docs` - generate OpenAPI/Postman docs

## Docker
```bash
docker compose up -d --build
```

See `docs/DOCKER_SETUP.md` for full Docker steps.

## License
MIT
