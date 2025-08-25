# Contributing to Prisoner's Dilemma Simulation

Thank you for your interest in contributing to the Prisoner's Dilemma Simulation project! This document provides guidelines and information for contributors.

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Basic knowledge of React, TypeScript, and game theory

### **Setup Development Environment**
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Prisoners-Dilemma.git
   cd Prisoners-Dilemma
   ```
3. **Install dependencies**:
   ```bash
   npm install
   npm install @tailwindcss/forms @tailwindcss/typography
   ```
4. **Start development server**:
   ```bash
   npm start
   ```

## 🔄 **Development Workflow**

### **Branch Strategy**
- **`main`**: Production-ready code, automatically deployed
- **`develop`**: Integration branch for features
- **`feature/*`**: Individual feature development
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes

### **Creating a Feature Branch**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### **Making Changes**
1. **Write code** following the project's style guidelines
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Run tests locally**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

### **Committing Changes**
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```bash
git commit -m "feat: add new strategy validation"
git commit -m "fix: resolve simulation timing issue"
git commit -m "docs: update API documentation"
```

## 🧪 **Testing Guidelines**

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- gameLogic.test.ts
```

### **Writing Tests**
- **Test files** should be named `*.test.ts` or `*.test.tsx`
- **Place tests** in `__tests__` folders next to the source files
- **Use descriptive test names** that explain the expected behavior
- **Test both success and failure cases**
- **Mock external dependencies** appropriately

### **Test Structure Example**
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup for each test
  });

  it('should handle normal case', () => {
    // Test implementation
    expect(result).toBe(expected);
  });

  it('should handle edge case', () => {
    // Test edge case
    expect(result).toBe(expected);
  });
});
```

## 🎯 **Adding New Strategies**

### **Strategy Interface**
```typescript
interface Strategy {
  id: string;
  name: string;
  author?: string;
  color: string;
  rating?: number;
  downloads?: number;
  getMove: (rng: () => number) => (history: GameHistory[]) => 'C' | 'D';
}
```

### **Strategy Implementation Example**
```typescript
export const myStrategy: Strategy = {
  id: 'myStrategy',
  name: 'My Custom Strategy',
  author: 'Your Name',
  color: COLORS.BLUE,
  rating: 0,
  downloads: 0,
  getMove: (rng: () => number) => (history: GameHistory[]) => {
    // Your strategy logic here
    if (history.length === 0) return 'C';
    const lastMove = history[history.length - 1];
    return lastMove.opponent;
  }
};
```

### **Testing Your Strategy**
```typescript
describe('My Strategy', () => {
  it('should start with cooperation', () => {
    const strategy = myStrategy;
    const moveGetter = strategy.getMove(() => 0.5);
    expect(moveGetter([])).toBe('C');
  });

  it('should copy opponent\'s last move', () => {
    const strategy = myStrategy;
    const moveGetter = strategy.getMove(() => 0.5);
    const history = [{ self: 'C', opponent: 'D' }];
    expect(moveGetter(history)).toBe('D');
  });
});
```

## 🔧 **Code Quality Standards**

### **TypeScript**
- **Use strict typing** - avoid `any` when possible
- **Define interfaces** for complex data structures
- **Use type guards** for runtime type checking

### **React Components**
- **Use functional components** with hooks
- **Implement proper prop types** with TypeScript
- **Follow React best practices** for performance

### **Styling**
- **Use Tailwind CSS** utility classes
- **Follow the design system** defined in `tailwind.config.js`
- **Ensure responsive design** for all components

### **State Management**
- **Use Zustand stores** for global state
- **Keep components focused** on presentation
- **Implement proper error handling**

## 📝 **Documentation**

### **Code Comments**
- **Document complex algorithms** with clear explanations
- **Explain business logic** that might not be obvious
- **Use JSDoc** for public functions and interfaces

### **README Updates**
- **Update feature lists** when adding new capabilities
- **Include usage examples** for new features
- **Update screenshots** if UI changes significantly

## 🚀 **CI/CD Pipeline**

### **Automated Checks**
Our GitHub Actions workflow automatically:
1. **Runs tests** on all pull requests
2. **Checks code quality** with ESLint
3. **Validates TypeScript** types
4. **Builds the application** to catch build errors
5. **Deploys to GitHub Pages** when merging to main

### **Required Checks**
Before merging, ensure:
- ✅ **All tests pass**
- ✅ **Linting passes** with no warnings
- ✅ **TypeScript compilation** succeeds
- ✅ **Build process** completes successfully

### **Manual Deployment (if needed)**
```bash
npm run deploy
```

## 🔍 **Pull Request Process**

### **Before Submitting**
1. **Ensure tests pass** locally
2. **Update documentation** if needed
3. **Squash commits** if you have many small commits
4. **Write clear description** of your changes

### **PR Description Template**
```markdown
## Description
Brief description of what this PR accomplishes

## Changes Made
- [ ] Added new feature X
- [ ] Fixed bug Y
- [ ] Updated documentation

## Testing
- [ ] Added unit tests
- [ ] Tested locally
- [ ] All existing tests pass

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### **Review Process**
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Address feedback** and make requested changes
4. **Maintainers approve** and merge

## 🐛 **Bug Reports**

### **Bug Report Template**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
- OS: [e.g. Windows, macOS]

## Additional Context
Any other context about the problem
```

## 💡 **Feature Requests**

### **Feature Request Template**
```markdown
## Problem Statement
Clear description of the problem this feature would solve

## Proposed Solution
Description of the proposed feature

## Alternative Solutions
Any alternative solutions you've considered

## Additional Context
Any other context, screenshots, or examples
```

## 📚 **Resources**

### **Game Theory**
- [Axelrod's Tournament](https://en.wikipedia.org/wiki/Axelrod_tournament)
- [Prisoner's Dilemma](https://en.wikipedia.org/wiki/Prisoner%27s_dilemma)
- [Evolutionary Game Theory](https://en.wikipedia.org/wiki/Evolutionary_game_theory)

### **Technical Documentation**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

## 🤝 **Getting Help**

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Requests**: For code contributions

## 📄 **License**

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to the Prisoner's Dilemma Simulation project! 🎉**
