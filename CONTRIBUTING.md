# Contributing to Zynexa

We welcome contributions to the Zynexa project. This document outlines our contribution guidelines.

## Code of Conduct

- Be respectful to all community members
- Maintain privacy and security as core values
- No harassment or discrimination

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/zynexa-core.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature`

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run security audit
npm audit

# Run smoke tests
bash smoke-test.sh
```

## Submitting Changes

1. Write clear commit messages following conventional commits:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `chore:` for maintenance

2. Keep commits focused and atomic
3. Add tests for new functionality
4. Update documentation as needed
5. Submit a Pull Request with clear description

## Security Issues

**Do NOT open public issues for security vulnerabilities.** Email security@zynexa.io instead.

## Questions?

- Check README.md for overview
- Read SECURITY.md for security policies
- Check existing issues before creating new ones
