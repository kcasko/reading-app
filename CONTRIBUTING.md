# Contributing to Reading App

Thank you for your interest in contributing to the Reading App! This project aims to help young children learn sight words through a calm, focused, and accessible experience.

## Code of Conduct

- Be respectful and constructive in all interactions
- Focus on what's best for the children who will use this app
- Keep discussions focused on the project

## Development Principles

Before contributing, please understand and respect our core design principles:

### Non-Negotiable Principles
- **Word is always larger than the image** - The word is primary, images are supportive
- **One word per screen** - No distractions or multiple elements competing for attention
- **Tap anywhere to hear** - No small buttons that young children might miss
- **No failure screens** - Exposure-based learning without pressure or negative feedback
- **Offline-first** - App must work completely without internet
- **No ads or dark patterns** - Clean, child-focused experience

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use a clear, descriptive title
3. Describe the expected vs. actual behavior
4. Include steps to reproduce
5. Specify your environment (OS, device, Expo version)
6. Add screenshots/videos if applicable

### Suggesting Features

1. Check if the feature aligns with our design principles
2. Describe the problem you're trying to solve
3. Explain how this helps children learn
4. Consider accessibility implications
5. Open an issue for discussion before implementing

### Code Contributions

#### Setting Up Development Environment

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/reading-app.git
cd reading-app

# Install dependencies
npm install

# Start development server
npm start
```

#### Code Standards

- **TypeScript**: All code must be TypeScript with proper types
- **Functional Components**: Use React hooks, no class components
- **Pure Engine Logic**: Keep engine/ directory free of React dependencies
- **ESLint**: Run `npm run lint` and fix all errors
- **Formatting**: Use consistent indentation and spacing
- **Comments**: Add comments for complex logic, not obvious code

#### File Organization

- `src/engine/` - Pure TypeScript, testable business logic
- `src/screens/` - React Native screen components
- `src/components/` - Reusable UI components
- `src/state/` - State management and persistence
- `src/theme/` - Colors, typography, spacing
- `src/utils/` - Helper functions and constants

#### Testing

Before submitting:
- Test on both iOS and Android if possible
- Test with VoiceOver/TalkBack enabled
- Test with different font sizes
- Test offline functionality
- Verify audio works correctly

#### Pull Request Process

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following code standards

3. Test thoroughly on multiple devices/simulators

4. Commit with clear, descriptive messages
   ```bash
   git commit -m "Add feature: brief description of what changed"
   ```

5. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request with:
   - Clear title describing the change
   - Description of what changed and why
   - Screenshots/videos for UI changes
   - Testing notes
   - Reference to related issues

7. Respond to code review feedback promptly

### Documentation

- Update README.md for user-facing changes
- Update API.md for code architecture changes
- Add comments for complex algorithms
- Update FEATURES.md when adding features

### Accessibility Considerations

All contributions must maintain or improve accessibility:
- Large touch targets (minimum 44x44 points)
- High contrast text (minimum 4.5:1 ratio)
- Support for screen readers
- Support for custom fonts (dyslexia-friendly)
- Audio controls and alternatives
- Clear visual feedback for all interactions

## Priority Areas for Contribution

### High Priority
- Accessibility improvements
- Performance optimizations
- Bug fixes affecting learning experience
- Unit tests for engine logic
- Documentation improvements

### Medium Priority
- Additional word categories
- Alternative theme options
- Parent dashboard enhancements
- Analytics (privacy-focused)

### Lower Priority
- Visual polish
- Additional sound effects
- Achievement systems (must be gentle, not gamified)

## Questions?

Feel free to open an issue for questions or discussion. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
