# 🏗️ Project Structure Options

## **Current Structure (CDN-based)**
```
prisoners-dilemma/
├── index.html          # Single HTML file with CDN dependencies
├── main.js            # All React code in one file
└── README.md
```

**Pros:** ✅ Portable, ✅ No build step, ✅ Quick to deploy  
**Cons:** ❌ Slow loading, ❌ No optimization, ❌ Hard to maintain, ❌ No TypeScript

---

## **Option 1: Modern React Setup (Recommended)**
```bash
npx create-react-app prisoners-dilemma --template typescript
cd prisoners-dilemma
npm install recharts lucide-react
```

**Structure:**
```
prisoners-dilemma/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Slider.tsx
│   │   ├── charts/       # Chart components
│   │   │   ├── LineChart.tsx
│   │   │   └── AreaChart.tsx
│   │   └── strategies/   # Strategy-related components
│   ├── hooks/            # Custom React hooks
│   │   ├── useSimulation.ts
│   │   └── useStrategies.ts
│   ├── utils/            # Utility functions
│   │   ├── gameLogic.ts
│   │   ├── rng.ts
│   │   └── calculations.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   └── index.tsx         # Entry point
├── public/
│   └── index.html
├── package.json
└── tsconfig.json
```

**Pros:** ✅ TypeScript, ✅ Hot reload, ✅ Optimized builds, ✅ Easy testing, ✅ Professional structure  
**Cons:** ❌ Requires Node.js, ❌ Build step needed

---

## **Option 2: Vite (Fastest)**
```bash
npm create vite@latest prisoners-dilemma -- --template react-ts
cd prisoners-dilemma
npm install
npm install recharts lucide-react
```

**Structure:** Same as Option 1, but with Vite config  
**Pros:** ✅ Extremely fast, ✅ Modern tooling, ✅ Great DX  
**Cons:** ❌ Requires Node.js, ❌ Build step needed

---

## **Option 3: Improved CDN Structure**
Keep portability but organize better:

```
prisoners-dilemma/
├── index.html              # Clean entry point
├── js/
│   ├── main.js            # Main React component
│   ├── components.js       # UI components
│   ├── gameLogic.js        # Game simulation logic
│   ├── strategies.js       # Strategy definitions
│   └── utils.js           # Utility functions
├── css/
│   └── styles.css         # Custom styles
└── README.md
```

**Pros:** ✅ Still portable, ✅ Better organized, ✅ Easier to maintain  
**Cons:** ❌ Still slow, ❌ No optimization, ❌ No TypeScript

---

## **Migration Path (Keep Your Code!)**

### **Step 1: Extract Components**
Move your mock components to separate files:

```javascript
// components.js
const Card = ({ children, className, ...props }) => (
  <div className={`border rounded-lg shadow-sm ${className || ''}`} {...props}>
    {children}
  </div>
);

// Export all components
window.UIComponents = { Card, Button, Slider, /* etc */ };
```

### **Step 2: Extract Game Logic**
```javascript
// gameLogic.js
window.GameLogic = {
  mulberry32,
  simulateMatch,
  replicateAvg,
  aggregatedTournament,
  evolvePopulationWeighted
};
```

### **Step 3: Clean Main Component**
```javascript
// main.js
const { Card, Button, Slider } = window.UIComponents;
const { mulberry32, simulateMatch } = window.GameLogic;

function PrisonersDilemmaSimulation() {
  // Your existing component code, but cleaner
}
```

---

## **Recommendation**

1. **For Quick Demo/Portfolio:** Use Option 3 (Improved CDN)
2. **For Serious Development:** Use Option 1 (Create React App)
3. **For Maximum Performance:** Use Option 2 (Vite)

**Your existing functions will work in ALL approaches!** The migration is just about organizing the code better.

---

## **Quick Start with Modern Setup**

```bash
# Create project
npx create-react-app prisoners-dilemma --template typescript

# Copy your existing functions
# - Copy game logic to src/utils/
# - Copy component logic to src/components/
# - Copy main component to src/App.tsx

# Install dependencies
npm install recharts lucide-react

# Run
npm start
```

**Result:** Same functionality, but with TypeScript, hot reload, testing, and professional structure!
