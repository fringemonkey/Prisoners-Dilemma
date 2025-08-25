import React, { useRef, useEffect, useState } from 'react';

interface Fish {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  strategy: string;
  cooperation: number;
}

interface FishTankProps {
  strategies: Array<{
    id: string;
    name: string;
    color: string;
    population: number;
    cooperation: number;
  }>;
  width?: number;
  height?: number;
}

export const FishTank: React.FC<FishTankProps> = ({ 
  strategies, 
  width = 800, 
  height = 600 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fish, setFish] = useState<Fish[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  // Initialize fish from strategies
  useEffect(() => {
    const newFish: Fish[] = [];
    
    strategies.forEach(strategy => {
      const fishCount = Math.max(1, Math.floor(strategy.population / 100));
      
      for (let i = 0; i < fishCount; i++) {
        newFish.push({
          id: `${strategy.id}_${i}`,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.max(3, Math.min(15, strategy.population / 100)),
          color: strategy.color,
          strategy: strategy.name,
          cooperation: strategy.cooperation
        });
      }
    });
    
    setFish(newFish);
  }, [strategies, width, height]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 100, 200, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw fish
      setFish(prevFish => 
        prevFish.map(fish => {
          // Update position
          let newX = fish.x + fish.vx;
          let newY = fish.y + fish.vy;
          let newVx = fish.vx;
          let newVy = fish.vy;

          // Bounce off walls
          if (newX <= 0 || newX >= width) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(width, newX));
          }
          if (newY <= 0 || newY >= height) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(height, newY));
          }

          // Add some randomness to movement
          if (Math.random() < 0.02) {
            newVx += (Math.random() - 0.5) * 0.5;
            newVy += (Math.random() - 0.5) * 0.5;
          }

          // Clamp velocity
          newVx = Math.max(-3, Math.min(3, newVx));
          newVy = Math.max(-3, Math.min(3, newVy));

          return {
            ...fish,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        })
      );

      // Draw fish
      fish.forEach(fish => {
        ctx.save();
        ctx.translate(fish.x, fish.y);
        
        // Draw fish body
        ctx.fillStyle = fish.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, fish.size, fish.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw fish tail
        ctx.fillStyle = fish.color;
        ctx.beginPath();
        ctx.moveTo(-fish.size, 0);
        ctx.lineTo(-fish.size - 8, -fish.size * 0.3);
        ctx.lineTo(-fish.size - 8, fish.size * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // Draw fish eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(fish.size * 0.3, -fish.size * 0.2, fish.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(fish.size * 0.3, -fish.size * 0.2, fish.size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw cooperation lines between nearby fish
      fish.forEach((fish1, i) => {
        fish.forEach((fish2, j) => {
          if (i === j) return;
          
          const distance = Math.sqrt(
            Math.pow(fish1.x - fish2.x, 2) + Math.pow(fish1.y - fish2.y, 2)
          );
          
          if (distance < 50 && fish1.strategy === fish2.strategy) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - distance / 50)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(fish1.x, fish1.y);
            ctx.lineTo(fish2.x, fish2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [fish, isRunning, width, height]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg bg-gradient-to-b from-blue-100 to-blue-300"
      />
      
      {/* Controls */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          {isRunning ? 'Pause' : 'Play'}
        </button>
      </div>
      
      {/* Stats */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
        <div>Fish Count: {fish.length}</div>
        <div>Strategies: {strategies.length}</div>
      </div>
    </div>
  );
};
