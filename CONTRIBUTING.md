# 🤝 Contributing to Prisoner's Dilemma Simulation

Thank you for your interest in contributing! This project is designed to be educational and fun for the game theory community.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/yourusername/prisoners-dilemma.git`
3. **Create a branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes**
5. **Test locally**: Open `index.html` in your browser
6. **Commit and push**: `git commit -m "Add amazing feature" && git push`
7. **Create a Pull Request**

## 🎯 What You Can Contribute

### 🌟 New Strategies
Add interesting strategies to the `communityStrategies` array in `main.js`:

```javascript
{
  id: "yourStrategy",
  name: "Your Strategy Name",
  author: "Your Name",
  getMove: () => (h) => {
    // Your strategy logic here
    // Return 'C' for cooperate or 'D' for defect
    return 'C';
  },
  color: "#FF5733", // Choose a unique color
  rating: 4.0,      // Initial rating
  downloads: 0      // Initial download count
}
```

### 🎨 UI Improvements
- Better visualizations
- Mobile responsiveness
- Accessibility improvements
- Dark/light theme toggle
- Better color schemes

### 📊 New Features
- Additional game theory scenarios
- Strategy tournaments
- Performance optimizations
- Export formats (JSON, Excel)
- Social features

### 📚 Documentation
- Strategy explanations
- Game theory tutorials
- Code comments
- README improvements

## 🔧 Development Setup

### Prerequisites
- Modern web browser
- Text editor (VS Code, Sublime, etc.)
- Git

### Local Development
1. **No build process required!** This is a pure HTML/JS app
2. **Edit files** and refresh your browser
3. **Test changes** immediately
4. **Use browser dev tools** for debugging

### File Structure
```
├── main.js              # Main React component
├── index.html           # HTML entry point
├── README.md            # Project documentation
├── CONTRIBUTING.md      # This file
└── .github/workflows/   # GitHub Actions
```

## 🧪 Testing Your Changes

### Manual Testing
1. **Open `index.html`** in your browser
2. **Test all features**:
   - Parameter changes
   - Strategy selection
   - Simulation running
   - Results viewing
   - Export functionality
3. **Test on different devices** (mobile, tablet, desktop)
4. **Test in different browsers** (Chrome, Firefox, Safari, Edge)

### Strategy Testing
1. **Add your strategy** to the code
2. **Run simulations** with different parameters
3. **Compare performance** against existing strategies
4. **Check edge cases** (empty history, noise, etc.)

## 📝 Code Style

### JavaScript
- Use **ES6+ features** (arrow functions, destructuring, etc.)
- **Consistent indentation** (2 spaces)
- **Descriptive variable names**
- **Comment complex logic**

### React
- **Functional components** with hooks
- **Consistent prop naming**
- **Error boundaries** for robustness
- **Performance considerations** (useMemo, useCallback)

### CSS/Tailwind
- **Utility-first approach** with Tailwind
- **Responsive design** principles
- **Accessibility** considerations
- **Consistent spacing** and colors

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Browser and version**
2. **Operating system**
3. **Steps to reproduce**
4. **Expected vs actual behavior**
5. **Console errors** (if any)
6. **Screenshots** (if helpful)

## 💡 Feature Requests

For new features, please:

1. **Describe the feature** clearly
2. **Explain the use case**
3. **Consider implementation complexity**
4. **Check if it fits the project scope**
5. **Provide examples** if possible

## 🎉 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **GitHub contributors** page
- **Release notes** for significant contributions
- **Community showcase** for strategy contributions

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and strategy sharing
- **Pull Request Reviews**: For code feedback
- **Community Discord/Slack**: If we set one up

## 🏆 Contribution Levels

### 🥉 First Time Contributor
- Fix a typo
- Add a simple strategy
- Improve documentation

### 🥈 Regular Contributor
- Add complex strategies
- Improve UI components
- Fix bugs
- Add tests

### 🥇 Core Contributor
- Major feature development
- Architecture improvements
- Performance optimizations
- Community leadership

## 📋 Checklist Before Submitting

- [ ] **Code works locally**
- [ ] **No console errors**
- [ ] **Responsive design** tested
- [ ] **Cross-browser** compatibility
- [ ] **Documentation** updated
- [ ] **README** reflects changes
- [ ] **Git commit** message is clear
- [ ] **Pull request** description is detailed

## 🎯 Project Goals

This project aims to:
1. **Educate** about game theory and evolution
2. **Inspire** creative strategy development
3. **Build** a collaborative community
4. **Provide** a fun, interactive learning tool
5. **Advance** understanding of cooperation vs. defection

## 🚀 Deployment

After merging to main:
1. **GitHub Actions** automatically deploy to Pages
2. **Live demo** updates within minutes
3. **Community** can immediately try new features
4. **Contributors** see their work live

---

**Thank you for contributing!** 🎉

*Together we can make this the best game theory simulation tool on the web!*
