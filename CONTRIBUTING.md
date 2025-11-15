# Contributing to AOZ Explorer

Thank you for your interest in contributing to AOZ Explorer! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/aoz-explorer.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes locally
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run check
```

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Add `data-testid` attributes to interactive elements
- Keep components focused and reusable
- Use Zod schemas for validation

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Ensure all TypeScript types are properly defined
- Test your changes thoroughly
- Write clear commit messages

## Commit Message Format

```
type: brief description

Detailed explanation if needed
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Questions?

Open an issue for discussion before starting major changes.
