# 🎯 Prisoner's Dilemma Evolutionary Tournament Simulation

A sophisticated web application that simulates evolutionary tournaments between different game theory strategies in the Prisoner's Dilemma game. **Perfect for GitHub Pages deployment!**

## 🚀 Live Demo

**[View Live Demo](https://yourusername.github.io/repo-name)** *(after GitHub Pages setup)*

## ✨ Features

- **Multiple Built-in Strategies**: Always Cooperate, Always Defect, Tit-for-Tat, Generous TFT, Grim Trigger, Pavlov, Random
- **Custom Strategy Creation**: Add your own strategies using JavaScript functions
- **Community Strategy Showcase**: Try strategies created by other users
- **Evolutionary Dynamics**: Strategies compete and populations evolve over generations
- **Comprehensive Analytics**: Charts showing payoff evolution, population changes, and cooperation rates
- **Head-to-Head Matrix**: See how each strategy performs against every other strategy
- **Dark Mode UI**: High contrast theme with customizable font scaling
- **Export & Share**: Download results as CSV and share tournament outcomes
- **Social Features**: Rate strategies, see download counts, and share results

## 🌐 GitHub Pages Deployment

### Quick Setup (1 minute!)

1. **Fork this repository** or create a new one
2. **Upload the files** (`main.js`, `index.html`, `README.md`)
3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
4. **Wait 2-3 minutes** for deployment
5. **Your app is live!** 🎉

### Custom Domain (Optional)
- Add a custom domain in Settings → Pages
- Update the share URL in `main.js` line 358

## 🎮 How to Use

1. **Open the live URL** in any modern web browser
2. **Configure Parameters**:
   - Payoff Matrix (T, R, P, S values)
   - Noise level (probability of moves being flipped)
   - Rounds per match, Population size, Generations
   - Evolution rate and replications
3. **Select Strategies** to include in the tournament
4. **Try Community Strategies** from the showcase
5. **Add Custom Strategies** with your own JavaScript functions
6. **Run Simulation** and watch strategies evolve!
7. **Share Results** on social media or with friends

## 🧠 Game Theory Background

The Prisoner's Dilemma is a fundamental game theory scenario where two players must choose between cooperation (C) and defection (D). The payoff structure typically follows:
- **T (Temptation)** > **R (Reward)** > **P (Punishment)** > **S (Sucker's Payoff)**
- **2R > T + S** (to make mutual cooperation the optimal collective outcome)

## 🎯 Built-in Strategies

- **Always Cooperate**: Always plays C
- **Always Defect**: Always plays D  
- **Tit-for-Tat**: Starts with C, then copies opponent's last move
- **Generous TFT**: Like TFT but 10% chance to cooperate after opponent defects
- **Grim Trigger**: Cooperates until opponent defects, then always defects
- **Pavlov**: Win-stay-lose-shift strategy
- **Random**: 50/50 chance of C or D each round

## 🏆 Community Strategies

- **Copycat**: Copies opponent's last move
- **Forgiving**: Cooperates initially, defects if opponent ever defects
- **Opportunist**: Cooperates for first 3 rounds, then always defects

## 💻 Technical Details

- **Built with React** (standalone, no build tools required)
- **GitHub Pages Ready** - works immediately after deployment
- **Uses seeded random number generation** for reproducible results
- **Implements weighted evolutionary dynamics**
- **Responsive design** with Tailwind CSS
- **Mock chart components** for standalone usage
- **No server required** - pure client-side application

## 📁 Files

- `main.js` - Main React component with simulation logic
- `index.html` - HTML file to run the application
- `README.md` - This documentation

## 🌟 Making It Interactive

### For Contributors
1. **Fork the repository**
2. **Add new strategies** to the `communityStrategies` array
3. **Improve the UI** or add new features
4. **Submit a pull request**

### For Users
1. **Rate strategies** by modifying the rating values
2. **Share results** using the built-in share button
3. **Create custom strategies** and share the code
4. **Experiment with parameters** to find interesting outcomes

## 🔧 Custom Strategies

To add a custom strategy, provide:
1. **Strategy Name**: A descriptive name
2. **Function**: JavaScript function that takes `history` parameter and returns 'C' or 'D'

Example:
```javascript
(history) => {
  if (!history || history.length === 0) return 'C';
  const lastOpponent = history[history.length - 1].opponent;
  return lastOpponent === 'C' ? 'C' : 'D';
}
```

This creates a "Copycat" strategy that copies the opponent's last move.

## 🤝 Contributing

Contributions are welcome! Here are some ideas:
- **New strategies** for the community showcase
- **UI improvements** and better visualizations
- **Additional game theory scenarios**
- **Performance optimizations**
- **Documentation improvements**

## 📊 Example Results

After running a simulation, you can:
- **View payoff evolution** over generations
- **See population changes** as strategies compete
- **Analyze cooperation rates** for each strategy
- **Compare head-to-head performance** in a matrix
- **Export data** for further analysis
- **Share results** with friends and colleagues

## 🎉 Why This is Perfect for GitHub

- **No build process** - just HTML, CSS, and JavaScript
- **Immediate deployment** with GitHub Pages
- **Educational value** for game theory and evolution
- **Interactive** - users can create and share strategies
- **Open source** - easy to contribute and improve
- **Mobile friendly** - works on all devices

## 📱 Mobile Support

The application is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔗 Links

- **Live Demo**: [Your GitHub Pages URL]
- **Repository**: [Your GitHub Repo URL]
- **Issues**: [Report bugs or request features]
- **Discussions**: [Share strategies and results]

---

**Made with ❤️ for the game theory community**

*Fork, star, and contribute to make this even better!*
