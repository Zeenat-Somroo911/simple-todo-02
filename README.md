# Evolution of Todo - Frontend

Next.js 16+ frontend for the Evolution of Todo application.

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Authentication**: Better Auth client
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Backend API running on http://localhost:8000

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your configuration

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
npm start
```

### Lint

Run ESLint:

```bash
npm run lint
```

## Project Structure

```
frontend/
├── app/                  # Next.js pages (App Router)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── login/            # Login page
│   ├── register/         # Register page
│   └── dashboard/        # Dashboard page
├── components/           # React components
├── lib/                  # Utilities and clients
├── types/                # TypeScript types
└── styles/               # Global styles
```

## Development Guidelines

See [CLAUDE.md](./CLAUDE.md) for detailed implementation guidelines including:
- App Router vs Pages Router
- TypeScript strict mode
- Tailwind CSS best practices
- Environment variables
- Authentication flow

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
