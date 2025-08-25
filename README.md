# 🎯 Prisoner's Dilemma Evolutionary Tournament Simulation v2.0.0

A sophisticated web application that simulates evolutionary tournaments between different game theory strategies in the Prisoner's Dilemma game. Built with modern React, TypeScript, and professional architecture.

## 🚀 Live Demo

**[View Live Demo](https://fringemonkey.github.io/Prisoners-Dilemma)** *(after GitHub Pages setup)*

## ✨ Features

- **Multiple Built-in Strategies**: Always Cooperate, Always Defect, Tit-for-Tat, Generous TFT, Grim Trigger, Pavlov, Random
- **Community Strategies**: Copycat, Forgiving, Opportunist, Adaptive, Gradual
- **Custom Strategy Creation**: Add your own strategies using JavaScript functions
- **Evolutionary Dynamics**: Strategies compete and populations evolve over generations
- **Comprehensive Analytics**: Charts showing payoff evolution, population changes, and cooperation rates
- **Permutation Runner**: Test multiple parameter combinations automatically
- **Real-time Data**: See results as they come in during simulation
- **Split View Interface**: Compare multiple runs side by side
- **Data Export/Import**: Save and load simulation configurations
- **Professional UI**: Dark/Light theme, high contrast mode, responsive design

## 🆕 What's New in v2.0.0

### **🏗️ Complete Architecture Overhaul**
- **Modern React 18** with TypeScript for type safety
- **Zustand State Management** for efficient, persistent state
- **Professional Component Structure** with proper separation of concerns
- **Tailwind CSS** with custom design system and animations

### **🎯 Enhanced User Experience**
- **Collapsible Sidebar** with intuitive navigation
- **Real-time Progress Tracking** during simulations
- **Theme System** with dark/light mode and high contrast
- **Responsive Design** that works on all devices

### **⚡ Performance Improvements**
- **Optimized Build System** with Create React App
- **Efficient State Management** with Zustand
- **Lazy Loading** ready for future implementations
- **Professional Tooling** for development and deployment

## 🏗️ Architecture

Built with modern React patterns:
- **React 18** with TypeScript
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Modular structure** for maintainability

## 🚀 Quick Start

### **1. Install Dependencies**
```bash
npm install
```

### **2. Install Additional Tailwind Plugins**
```bash
npm install @tailwindcss/forms @tailwindcss/typography
```

### **3. Start Development Server**
```bash
npm start
```

### **4. Build for Production**
```bash
npm run build
```

### **5. Deploy to GitHub Pages**
```bash
npm run deploy
```

## 🎮 How to Use

### **Running Simulations**
1. Select strategies from the built-in and community options
2. Adjust parameters (population size, generations, noise, etc.)
3. Click "Run Simulation" to start
4. Watch real-time results and final leaderboard

### **Creating Custom Strategies**
1. Go to the Strategies tab
2. Write a JavaScript function that takes game history and returns 'C' or 'D'
3. Test your strategy against others

### **Parameter Permutations**
1. Use the Permutations tab to test multiple parameter combinations
2. Set base configuration and variations
3. Run batch simulations automatically

## 🧠 Game Theory Background

The Prisoner's Dilemma is a fundamental problem in game theory that demonstrates why two rational individuals might not cooperate, even when it's in their best interests to do so.

**Payoff Matrix:**
- **T (Temptation)**: Highest payoff for defecting when opponent cooperates
- **R (Reward)**: Payoff when both cooperate
- **P (Punishment)**: Payoff when both defect
- **S (Sucker's Payoff)**: Lowest payoff for cooperating when opponent defects

**Classic Values**: T=5, R=3, P=1, S=0

## 🔧 Technical Details

- **Seeded RNG**: Reproducible results using mulberry32 algorithm
- **Evolutionary Algorithm**: Population evolves based on strategy performance
- **Noise Simulation**: Realistic strategy execution errors
- **Performance Optimized**: Efficient algorithms for large populations
- **TypeScript**: Full type safety and better development experience

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Layout/         # MainLayout, Sidebar, Header
│   ├── ui/            # Reusable UI components
│   └── ...            # Feature-specific components
├── hooks/              # Custom React hooks
├── stores/             # State management (Zustand)
├── types/              # TypeScript types
├── utils/              # Game logic and utilities
└── App.tsx            # Main application
```

## 🌟 Built-in Strategies

- **Always Cooperate**: Always plays C
- **Always Defect**: Always plays D
- **Tit for Tat**: Copies opponent's last move, starts with C
- **Generous TFT**: Like TFT but 10% forgiveness
- **Grim Trigger**: Cooperates until opponent defects, then always defects
- **Pavlov**: Win-stay, lose-shift strategy
- **Random**: Randomly chooses C or D

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Robert Axelrod for pioneering work on iterated Prisoner's Dilemma
- Game theory community for strategy insights
- React and TypeScript communities for excellent tooling

---

**Ready to explore the fascinating world of evolutionary game theory? Start simulating! 🚀**
