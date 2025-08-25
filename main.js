// Prisoner's Dilemma Evolutionary Tournament Simulation — Dark Mode + Analytics (v2.1 UI pass)
// Upgrades included: weighted dynamics, aggregated pairs, seed + replications.
// NEW (UI/UX): High-contrast toggle, font-size (UI scale), clearer colors (Okabe–Ito),
// larger labels/controls, sharper borders, improved chart contrast.

import React, { useMemo, useState } from "react";

// Mock UI components for standalone usage
const Card = ({ children, className, ...props }) => (
  <div className={`border rounded-lg shadow-sm ${className || ''}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-6 ${className || ''}`} {...props}>
    {children}
  </div>
);

const Slider = ({ value, min, max, step, onValueChange, className, ...props }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([parseFloat(e.target.value)])}
    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className || ''}`}
    {...props}
  />
);

const Button = ({ children, variant, size, className, onClick, disabled, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-gray-300 bg-transparent hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${size === 'sm' ? 'px-3 py-1 text-sm' : ''} ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    } ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, type, placeholder, className, ...props }) => (
  <input
    type={type || 'text'}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
    {...props}
  />
);

const Textarea = ({ value, onChange, placeholder, className, ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${className || ''}`}
    {...props}
  />
);

const Checkbox = ({ id, checked, onCheckedChange, ...props }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
    {...props}
  />
);

const Label = ({ children, htmlFor, className, ...props }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium ${className || ''}`} {...props}>
    {children}
  </label>
);

const Tabs = ({ children, defaultValue, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const TabsList = ({ children, className, ...props }) => (
  <div className={`flex space-x-1 p-1 bg-gray-100 rounded-lg ${className || ''}`} {...props}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, className, ...props }) => (
  <button
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-200 ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, ...props }) => (
  <div {...props}>
    {children}
  </div>
);

const Switch = ({ checked, onCheckedChange, ...props }) => (
  <button
    type="button"
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    }`}
    {...props}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Mock chart components for standalone usage
const LineChart = ({ children, data, margin, ...props }) => (
  <div className="w-full h-full bg-gray-50 border rounded-lg p-4" {...props}>
    <div className="text-center text-gray-500 mb-4">Chart: {data?.length || 0} data points</div>
    {children}
  </div>
);

const Line = ({ dataKey, stroke, name, ...props }) => (
  <div className="text-sm text-gray-600 mb-2">
    {name}: {dataKey} (color: {stroke})
  </div>
);

const AreaChart = ({ children, data, margin, ...props }) => (
  <div className="w-full h-full bg-gray-50 border rounded-lg p-4" {...props}>
    <div className="text-center text-gray-500 mb-4">Area Chart: {data?.length || 0} data points</div>
    {children}
  </div>
);

const Area = ({ dataKey, stroke, fill, ...props }) => (
  <div className="text-sm text-gray-600 mb-2">
    Area: {dataKey} (fill: {fill})
  </div>
);

const XAxis = ({ dataKey, stroke, ...props }) => (
  <div className="text-xs text-gray-400">X-Axis: {dataKey}</div>
);

const YAxis = ({ stroke, tickFormatter, domain, ...props }) => (
  <div className="text-xs text-gray-400">Y-Axis</div>
);

const Tooltip = ({ formatter, ...props }) => <div {...props} />;
const Legend = ({ ...props }) => <div {...props} />;
const CartesianGrid = ({ strokeDasharray, stroke, ...props }) => <div {...props} />;
const ResponsiveContainer = ({ children, ...props }) => <div {...props}>{children}</div>;

// Mock icons
const Plus = ({ className, ...props }) => <span className={className} {...props}>+</span>;
const Trash = ({ size, className, ...props }) => <span className={className} {...props}>🗑</span>;
const Download = ({ className, ...props }) => <span className={className} {...props}>⬇</span>;
const RefreshCw = ({ className, ...props }) => <span className={className} {...props}>🔄</span>;

// ---------- RNG (seeded) ----------
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Colorblind‑safe palette (Okabe–Ito)
const C = {
  ORANGE: "#E69F00",
  SKY: "#56B4E9",
  GREEN: "#009E73",
  YELLOW: "#F0E442",
  BLUE: "#0072B2",
  VERMIL: "#D55E00",
  PURPLE: "#CC79A7",
};

// ---------- Strategies ----------
// Note: getMove accepts rng and returns (history)=> 'C' | 'D'
const defaultStrategies = [
  { id: "alwaysCooperate", name: "Always Cooperate", getMove: () => () => "C", color: C.SKY },
  { id: "alwaysDefect", name: "Always Defect", getMove: () => () => "D", color: C.VERMIL },
  { id: "titForTat", name: "Tit for Tat", getMove: () => (h) => (!h || h.length === 0 ? "C" : h[h.length - 1].opponent), color: C.BLUE },
  { id: "generousTFT", name: "Generous TFT (10% forgiveness)", getMove: (rng) => (h) => { if (!h || h.length === 0) return "C"; const o = h[h.length - 1].opponent; return o === "D" && rng() < 0.1 ? "C" : o; }, color: C.GREEN },
  { id: "grimTrigger", name: "Grim Trigger", getMove: () => (h) => { const d = h && h.some((x) => x.opponent === "D"); return d ? "D" : "C"; }, color: C.ORANGE },
  { id: "pavlov", name: "Pavlov (Win-Stay-Lose-Shift)", getMove: () => (h) => { if (!h || h.length === 0) return "C"; const last = h[h.length - 1]; const mc = last.self === "C" && last.opponent === "C"; const md = last.self === "D" && last.opponent === "D"; return mc || md ? last.self : last.self === "C" ? "D" : "C"; }, color: C.PURPLE },
  { id: "random", name: "Random", getMove: (rng) => () => (rng() < 0.5 ? "C" : "D"), color: C.YELLOW },
];

const payoffMatrixDefault = { T: 5, R: 3, P: 1, S: 0 };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ---------- Core Simulation (seeded) ----------
function simulateMatch(strategyA, strategyB, rounds, noise, payoffMatrix, rng) {
  let historyA = [], historyB = [];
  let scoreA = 0, scoreB = 0, coopA = 0, coopB = 0;
  const moveAGetter = strategyA.getMove(rng);
  const moveBGetter = strategyB.getMove(rng);
  for (let i = 0; i < rounds; i++) {
    let moveA = moveAGetter(historyA);
    let moveB = moveBGetter(historyB);
    if (rng() < noise) moveA = moveA === "C" ? "D" : "C";
    if (rng() < noise) moveB = moveB === "C" ? "D" : "C";
    if (moveA === "C") coopA++; if (moveB === "C") coopB++;
    if (moveA === "C" && moveB === "C") { scoreA += payoffMatrix.R; scoreB += payoffMatrix.R; }
    else if (moveA === "C" && moveB === "D") { scoreA += payoffMatrix.S; scoreB += payoffMatrix.T; }
    else if (moveA === "D" && moveB === "C") { scoreA += payoffMatrix.T; scoreB += payoffMatrix.S; }
    else { scoreA += payoffMatrix.P; scoreB += payoffMatrix.P; }
    historyA.push({ self: moveA, opponent: moveB });
    historyB.push({ self: moveB, opponent: moveA });
  }
  return { scoreA, scoreB, coopA, coopB, rounds };
}

function replicateAvg(strategyA, strategyB, rounds, noise, payoffMatrix, replications, rng) {
  let sumScoreA = 0, sumScoreB = 0, sumCoopA = 0, sumCoopB = 0, sumRounds = 0;
  for (let r = 0; r < replications; r++) {
    const res = simulateMatch(strategyA, strategyB, rounds, noise, payoffMatrix, rng);
    sumScoreA += res.scoreA; sumScoreB += res.scoreB; sumCoopA += res.coopA; sumCoopB += res.coopB; sumRounds += res.rounds;
  }
  return {
    payA: sumRounds ? sumScoreA / sumRounds : 0,
    payB: sumRounds ? sumScoreB / sumRounds : 0,
    coopRateA: sumRounds ? sumCoopA / sumRounds : 0,
    coopRateB: sumRounds ? sumCoopB / sumRounds : 0,
  };
}

function aggregatedTournament(strategies, population, rounds, noise, payoffMatrix, replications, rng) {
  const ids = strategies.map((s) => s.id);
  const N = Object.values(population).reduce((a, b) => a + b, 0);
  const resultPay = {}; const resultCoop = {}; ids.forEach((id) => { resultPay[id] = 0; resultCoop[id] = 0; });
  const pairPay = {}; const pairCoop = {};
  for (let i = 0; i < strategies.length; i++) {
    for (let j = 0; j < strategies.length; j++) {
      const key = `${strategies[i].id}__${strategies[j].id}`;
      const { payA, payB, coopRateA, coopRateB } = replicateAvg(strategies[i], strategies[j], rounds, noise, payoffMatrix, replications, rng);
      pairPay[key] = { a: payA, b: payB }; pairCoop[key] = { a: coopRateA, b: coopRateB };
    }
  }
  ids.forEach((i) => {
    const n_i = population[i] || 0; let expectedPay = 0; let expectedCoop = 0;
    ids.forEach((j) => {
      const n_j = population[j] || 0; if (N <= 1) return;
      const oppShare = j === i ? Math.max(0, n_i - 1) / Math.max(1, N - 1) : n_j / Math.max(1, N - 1);
      const { a } = pairPay[`${i}__${j}`]; const { a: coopA } = pairCoop[`${i}__${j}`];
      expectedPay += oppShare * a; expectedCoop += oppShare * coopA;
    });
    resultPay[i] = expectedPay; resultCoop[i] = expectedCoop;
  });
  return { avgPayoffs: resultPay, coopRates: resultCoop };
}

function evolvePopulationWeighted(population, avgPayoffs, evolutionRate) {
  const ids = Object.keys(population);
  const N = ids.reduce((acc, id) => acc + population[id], 0) || 1;
  const meanPayoff = ids.reduce((acc, id) => acc + (avgPayoffs[id] || 0) * population[id], 0) / N;
  const next = {}; let total = 0;
  ids.forEach((id) => {
    const oldCount = population[id]; const payoff = avgPayoffs[id] || 0;
    let newCount = oldCount + evolutionRate * (payoff - meanPayoff) * oldCount;
    newCount = Math.max(0, newCount); next[id] = newCount; total += newCount;
  });
  const rounded = {}; ids.forEach((id) => { rounded[id] = total > 0 ? Math.round((next[id] / total) * N) : 0; });
  const sumRounded = ids.reduce((a, id) => a + rounded[id], 0);
  if (sumRounded === 0) { const maxId = ids.reduce((best, id) => (next[id] > (next[best] || 0) ? id : best), ids[0]); rounded[maxId] = 1; }
  return rounded;
}

// ---------- Component ----------
export default function PrisonersDilemmaSimulation() {
  // UI + params
  const [payoffMatrix, setPayoffMatrix] = useState(payoffMatrixDefault);
  const [noise, setNoise] = useState(0.02);
  const [rounds, setRounds] = useState(200);
  const [populationSize, setPopulationSize] = useState(100);
  const [generations, setGenerations] = useState(50);
  const [evolutionRate, setEvolutionRate] = useState(0.5);
  const [replications, setReplications] = useState(5);
  const [seed, setSeed] = useState(123456789);

  // Display controls
  const [highContrast, setHighContrast] = useState(true);
  const [uiScale, setUiScale] = useState(105); // %

  // strategies
  const [strategies, setStrategies] = useState(defaultStrategies);
  const [selectedStrategyIds, setSelectedStrategyIds] = useState(defaultStrategies.map((s) => s.id));

  // outputs
  const [results, setResults] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [coopSummary, setCoopSummary] = useState([]);
  const [popSeries, setPopSeries] = useState([]);
  const [hhMatrix, setHhMatrix] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customFunc, setCustomFunc] = useState("");
  const [showCommunity, setShowCommunity] = useState(false);
  const [communityStrategies, setCommunityStrategies] = useState([
    { id: "copycat", name: "Copycat", author: "Community", getMove: () => (h) => (!h || h.length === 0 ? "C" : h[h.length - 1].opponent), color: "#FF6B6B", rating: 4.2, downloads: 156 },
    { id: "forgiving", name: "Forgiving", author: "Community", getMove: () => (h) => (!h || h.length === 0 ? "C" : h.some(x => x.opponent === "D") ? "D" : "C"), color: "#4ECDC4", rating: 4.2, downloads: 89 },
    { id: "opportunist", name: "Opportunist", author: "Community", getMove: () => (h) => (!h || h.length === 0 ? "C" : h.length < 3 ? "C" : "D"), color: "#45B7D1", rating: 3.5, downloads: 67 }
  ]);

  const selectedStrategies = useMemo(() => strategies.filter((s) => selectedStrategyIds.includes(s.id)), [strategies, selectedStrategyIds]);

  const handlePayoffChange = (k, v) => setPayoffMatrix((prev) => ({ ...prev, [k]: v }));
  const onSelectStrategy = (id) => setSelectedStrategyIds((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));

  const handleAddCustom = () => {
    if (!customName || !customFunc) return;
    try {
      // eslint-disable-next-line no-new-func
      const func = new Function("history", `return ((${customFunc}))(history);`);
      const newStrategy = { id: customName.replace(/\s+/g, ""), name: customName, getMove: (rng) => func, color: `#${Math.floor(Math.random() * 16777215).toString(16)}` };
      setStrategies((prev) => [...prev, newStrategy]);
      setSelectedStrategyIds((prev) => [...prev, newStrategy.id]);
      setCustomName(""); setCustomFunc("");
    } catch (e) { alert("Error in custom function. Please ensure it returns 'C' or 'D'."); }
  };

  const handleDeleteStrategy = (id) => {
    setStrategies((prev) => prev.filter((s) => s.id !== id));
    setSelectedStrategyIds((prev) => prev.filter((sid) => sid !== id));
  };

  const addCommunityStrategy = (strategy) => {
    setStrategies((prev) => [...prev, strategy]);
    setSelectedStrategyIds((prev) => [...prev, strategy.id]);
  };

  const shareResults = () => {
    if (!results.length) return;
    
    const summary = `🏆 Prisoner's Dilemma Tournament Results\n\n` +
      `🎯 Winner: ${leaderboard[0]?.name || 'N/A'}\n` +
      `📊 Generations: ${generations}\n` +
      `👥 Population: ${populationSize}\n` +
      `🎲 Seed: ${seed}\n\n` +
      `🔗 Try it yourself: [GitHub Repo Link]`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Prisoner\'s Dilemma Results',
        text: summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(summary);
      alert('Results copied to clipboard! Share them on social media.');
    }
  };

  const exportCSV = () => {
    if (!results.length) return;
    const keys = Object.keys(results[0]);
    const lines = [keys.join(",")];
    results.forEach((row) => { lines.push(keys.map((k) => row[k] ?? "").join(",")); });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pd-sim-results.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const randomizeSeed = () => setSeed(Math.floor(Math.random() * 2 ** 31));

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const rng = mulberry32(Number(seed) >>> 0 || 123456789);
      const initialCount = Math.max(1, Math.floor(populationSize / (selectedStrategies.length || 1)));
      let population = {}; 
      selectedStrategies.forEach((s) => { population[s.id] = initialCount; });
      let rem = Math.max(0, populationSize - initialCount * selectedStrategies.length); 
      let ix = 0;
      while (rem-- > 0) { 
        population[selectedStrategies[ix % selectedStrategies.length].id]++; 
        ix++; 
      }

    const generationsData = [], coopData = [], popData = [];
    for (let g = 0; g < generations; g++) {
      const { avgPayoffs, coopRates } = aggregatedTournament(selectedStrategies, population, rounds, noise, payoffMatrix, replications, rng);
      generationsData.push({ generation: g, ...avgPayoffs });
      coopData.push({ generation: g, ...Object.fromEntries(Object.entries(coopRates).map(([k, v]) => [k, Number(v.toFixed(4))])) });
      popData.push({ generation: g, ...population });
      population = evolvePopulationWeighted(population, avgPayoffs, evolutionRate);
    }

    const finalPopulation = population;
    const board = selectedStrategies.map((s) => ({ name: s.name, id: s.id, count: finalPopulation[s.id] || 0 })).sort((a, b) => b.count - a.count);
    const matrix = {};
    for (let i = 0; i < selectedStrategies.length; i++) {
      matrix[selectedStrategies[i].id] = {};
      for (let j = 0; j < selectedStrategies.length; j++) {
        const { payA } = replicateAvg(selectedStrategies[i], selectedStrategies[j], rounds, noise, payoffMatrix, replications, rng);
        matrix[selectedStrategies[i].id][selectedStrategies[j].id] = payA;
      }
    }

      setLeaderboard(board); 
      setResults(generationsData); 
      setCoopSummary(coopData); 
      setPopSeries(popData); 
      setHhMatrix(matrix); 
    } catch (error) {
      console.error('Simulation error:', error);
      alert('An error occurred during simulation. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Theme tokens
  const pageBg = highContrast ? "bg-gray-900" : "bg-gray-800";
  const pageFg = highContrast ? "text-gray-100" : "text-gray-200";
  const cardTone = highContrast ? "bg-gray-800 border border-gray-600" : "bg-gray-700 border border-gray-500";
  const subtle = highContrast ? "text-gray-300" : "text-gray-400";
  const axis = highContrast ? "#d1d5db" : "#9ca3af";
  const grid = highContrast ? "#374151" : "#4b5563";
  const primaryBtn = highContrast ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white";

  return (
    <div className={`min-h-screen ${pageBg} ${pageFg} p-6 space-y-6`} style={{ fontSize: `${uiScale}%` }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Prisoner's Dilemma — Dark Mode + Analytics (v2.1)</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`hidden md:flex items-center gap-2 ${subtle}`}>
            <span>High contrast</span>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${subtle}`}>Font size</span>
            <Slider value={[uiScale]} min={90} max={125} step={1} onValueChange={(v) => setUiScale(v[0])} className="w-32" />
          </div>
          <Button variant="outline" onClick={exportCSV} className={`border-gray-500 ${pageFg}`}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`${cardTone} p-5 rounded-lg shadow-lg`}>
          <CardContent>
            <Label className="font-semibold text-xl">Payoff Matrix</Label>
            <p className={`text-sm mt-1 ${subtle}`}>Prisoner's Dilemma requires T>R>P>S and 2R &gt; T+S.</p>
            <div className="space-y-4 mt-3">
              {["T", "R", "P", "S"].map((k) => (
                <div key={k}>
                  <div className="flex justify-between text-base mb-1">
                    <span>{k === "T" ? "Temptation (T)" : k === "R" ? "Reward (R)" : k === "P" ? "Punishment (P)" : "Sucker's Payoff (S)"}</span>
                    <span className={`${subtle} font-mono`}>{payoffMatrix[k]}</span>
                  </div>
                  <Slider value={[payoffMatrix[k]]} min={0} max={10} step={1} onValueChange={(val) => handlePayoffChange(k, val[0])} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardTone} p-5 rounded-lg shadow-lg`}>
          <CardContent>
            <Label className="font-semibold text-xl">Simulation Parameters</Label>
            <div className="space-y-4 mt-3">
              <div>
                <div className="flex justify-between text-base mb-1"><span>Noise (flip probability)</span><span className={`${subtle} font-mono`}>{noise.toFixed(2)}</span></div>
                <Slider value={[noise]} min={0} max={0.5} step={0.01} onValueChange={(val) => setNoise(clamp(val[0], 0, 0.5))} />
              </div>
              <div>
                <div className="flex justify-between text-base mb-1"><span>Rounds per match</span><span className={`${subtle} font-mono`}>{rounds}</span></div>
                <Slider value={[rounds]} min={10} max={500} step={10} onValueChange={(val) => setRounds(Math.round(val[0]))} />
              </div>
              <div>
                <div className="flex justify-between text-base mb-1"><span>Population size</span><span className={`${subtle} font-mono`}>{populationSize}</span></div>
                <Slider value={[populationSize]} min={10} max={500} step={10} onValueChange={(val) => setPopulationSize(Math.round(val[0]))} />
              </div>
              <div>
                <div className="flex justify-between text-base mb-1"><span>Generations</span><span className={`${subtle} font-mono`}>{generations}</span></div>
                <Slider value={[generations]} min={10} max={200} step={5} onValueChange={(val) => setGenerations(Math.round(val[0]))} />
              </div>
              <div>
                <div className="flex justify-between text-base mb-1"><span>Evolution rate</span><span className={`${subtle} font-mono`}>{evolutionRate.toFixed(2)}</span></div>
                <Slider value={[evolutionRate]} min={0} max={1} step={0.05} onValueChange={(val) => setEvolutionRate(clamp(val[0], 0, 1))} />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-base mb-1"><span>Replications</span><span className={`${subtle} font-mono`}>{replications}</span></div>
                  <Slider value={[replications]} min={1} max={30} step={1} onValueChange={(val) => setReplications(Math.round(val[0]))} />
                </div>
                <div>
                  <div className="flex items-center justify-between text-base mb-1">
                    <span>Seed</span>
                    <Button size="sm" variant="outline" className="ml-2 py-1 h-8" onClick={randomizeSeed}><RefreshCw className="w-4 h-4 mr-1"/>random</Button>
                  </div>
                  <Input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} className="bg-transparent border-gray-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy selection */}
      <Card className={`${cardTone} p-5 rounded-lg shadow-lg`}>
        <CardContent>
          <Label className="font-semibold text-xl">Select Strategies</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
            {strategies.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-gray-500">
                <Checkbox id={s.id} checked={selectedStrategyIds.includes(s.id)} onCheckedChange={() => onSelectStrategy(s.id)} />
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-sm" style={{ background: s.color }} />
                  <Label htmlFor={s.id} className="text-base">{s.name}</Label>
                </span>
                {defaultStrategies.find((ds) => ds.id === s.id) ? null : (
                  <button className="ml-auto text-red-400" onClick={() => handleDeleteStrategy(s.id)}><Trash size={16} /></button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Strategy name" value={customName} onChange={(e) => setCustomName(e.target.value)} className="bg-transparent border-gray-500" />
            <Textarea placeholder="(history) => { /* return 'C' or 'D' */ return 'C'; }" value={customFunc} onChange={(e) => setCustomFunc(e.target.value)} className="bg-transparent border-gray-500" />
            <Button className={`self-start ${primaryBtn}`} onClick={handleAddCustom}><Plus className="mr-2" /> Add Strategy</Button>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold text-lg">Community Strategies</Label>
              <Button variant="outline" size="sm" onClick={() => setShowCommunity(!showCommunity)} className="border-gray-500">
                {showCommunity ? "Hide" : "Show"} Community
              </Button>
            </div>
            {showCommunity && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {communityStrategies.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-500 bg-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-400">by {s.author}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>⭐ {s.rating}</span>
                          <span>⬇ {s.downloads}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => addCommunityStrategy(s)} className="bg-green-600 hover:bg-green-700">
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          💡 Tip: Try different strategies and parameters to see how they evolve!
        </div>
        <div className="flex gap-2">
          {results.length > 0 && (
            <Button variant="outline" onClick={shareResults} className="border-gray-500">
              📤 Share Results
            </Button>
          )}
          <Button className={`${primaryBtn}`} onClick={handleRunSimulation} disabled={loading || selectedStrategyIds.length === 0}>
            {loading ? "Running..." : "Run Simulation"}
          </Button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className={`mb-3 rounded-lg border ${highContrast ? "bg-gray-800 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
            {[
              { v: "overview", t: "Overview" },
              { v: "population", t: "Population" },
              { v: "cooperation", t: "Cooperation" },
              { v: "matrix", t: "Head-to-Head" },
              { v: "summary", t: "Summary" },
            ].map((tab) => (
              <TabsTrigger key={tab.v} value={tab.v} className={`rounded-lg px-3 py-1.5`}>{tab.t}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <Card className={`${cardTone} p-5 rounded-lg shadow-lg`}>
              <CardContent>
                <Label className="font-semibold text-xl">Average Payoff per Generation</Label>
                <div className="w-full" style={{ height: 340 }}>
                  <ResponsiveContainer>
                    <LineChart data={results} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                      <XAxis dataKey="generation" stroke={axis} />
                      <YAxis stroke={axis} />
                      <Tooltip />
                      <Legend />
                      {selectedStrategies.map((s) => (
                        <Line key={s.id} type="monotone" dataKey={s.id} stroke={s.color} name={s.name} dot={false} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="population">
            <Card className={`${cardTone} p-5 rounded-lg shadow-lg`}>
              <CardContent>
                <Label className="font-semibold text-xl">Population Share Over Time</Label>
                <div className="w-full" style={{ height: 340 }}>
                  <ResponsiveContainer>
                    <AreaChart data={popSeries} stackOffset="expand" margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                      <XAxis dataKey="generation" stroke={axis} />
                      <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} stroke={axis} />
                      <Tooltip formatter={(v) => `${Math.round(v * 100)}%`} />
                      {selectedStrategies.map((s) => (
                        <Area key={s.id} type="monotone" dataKey={s.id} stackId="1" stroke={s.color} fill={s.color} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cooperation">
            <Card className={`${cardTone} p-5 rounded-lg shadow-lg`}>
              <CardContent>
                <Label className="font-semibold text-xl">Cooperation Rate per Generation</Label>
                <div className="w-full" style={{ height: 340 }}>
                  <ResponsiveContainer>
                    <LineChart data={coopSummary} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                      <XAxis dataKey="generation" stroke={axis} />
                      <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} domain={[0, 1]} stroke={axis} />
                      <Tooltip formatter={(v) => `${Math.round(v * 100)}%`} />
                      <Legend />
                      {selectedStrategies.map((s) => (
                        <Line key={s.id} type="monotone" dataKey={s.id} stroke={s.color} name={`${s.name}`} dot={false} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matrix">
            <Card className={`${cardTone} p-5 rounded-lg shadow-lg`}>
              <CardContent>
                <Label className="font-semibold text-xl">Head-to-Head Average Payoff (row vs column)</Label>
                {hhMatrix && (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full text-base">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left">Strategy</th>
                          {selectedStrategies.map((col) => (
                            <th key={col.id} className="px-3 py-2 text-left"><span className="inline-flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm" style={{ background: col.color }} />{col.name}</span></th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStrategies.map((row) => (
                          <tr key={row.id} className="border-t border-gray-500">
                            <td className="px-3 py-2"><span className="inline-flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-sm" style={{ background: row.color }} />{row.name}</span></td>
                            {selectedStrategies.map((col) => (
                              <td key={col.id} className="px-3 py-2 align-middle">{hhMatrix[row.id] && hhMatrix[row.id][col.id] !== undefined ? hhMatrix[row.id][col.id].toFixed(2) : "-"}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card className={`${cardTone} p-5 rounded-lg shadow-lg`}>
              <CardContent>
                <Label className="font-semibold text-xl">Final Generation Summary</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                  <div>
                    <h3 className="font-semibold mb-2">Final Population</h3>
                    <table className="table-auto w-full text-base">
                      <thead>
                        <tr><th className="px-3 py-2 text-left">Strategy</th><th className="px-3 py-2 text-left">Count</th></tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((row) => (
                          <tr key={row.id} className="border-t border-gray-500">
                            <td className="px-3 py-2">{row.name}</td>
                            <td className="px-3 py-2">{row.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Last‑Gen Cooperation Rates</h3>
                    <table className="table-auto w-full text-base">
                      <thead>
                        <tr><th className="px-3 py-2 text-left">Strategy</th><th className="px-3 py-2 text-left">Coop %</th></tr>
                      </thead>
                      <tbody>
                        {selectedStrategies.map((s) => {
                          const last = coopSummary[coopSummary.length - 1] || {}; const v = last[s.id];
                          return (
                            <tr key={s.id} className="border-t border-gray-500">
                              <td className="px-3 py-2">{s.name}</td>
                              <td className="px-3 py-2">{v !== undefined ? `${Math.round(v * 100)}%` : "-"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
