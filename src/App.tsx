import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🧠 Prisoner's Dilemma Simulation</h1>
      <p>Ultra-simple test version</p>
      <div style={{ 
        backgroundColor: '#d4edda', 
        border: '1px solid #c3e6cb', 
        padding: '10px', 
        borderRadius: '5px',
        margin: '20px 0'
      }}>
        ✅ If you see this, React is working!
      </div>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
}

export default App;
