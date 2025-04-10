import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Fracdis() {
  const [xd, setXd] = useState(0.95); // Mole fraction of light component in distillate
  const [xb, setXb] = useState(0.05); // Mole fraction of light component in bottoms
  const [alpha, setAlpha] = useState(2.5); // Relative volatility
  const [n, setN] = useState(0); // Number of theoretical plates
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  // Calculate N using the Fenske equation
  const calculateN = (xd, xb, alpha) => {
    // Check if inputs are valid for calculation
    if (xd <= xb) {
      setError("Error: Xd must be greater than Xb for meaningful separation");
      return 0;
    }
    if (xd >= 1 || xb >= 1 || xd <= 0 || xb <= 0) {
      setError("Error: Mole fractions must be between 0 and 1 (exclusive)");
      return 0;
    }
    
    setError("");
    
    const numerator = Math.log((xd / (1 - xd)) * ((1 - xb) / xb));
    const denominator = Math.log(alpha);
    return numerator / denominator;
  };

  // Generate data for the chart
  const generateChartData = () => {
    const data = [];
    
    // Generate data showing how N changes with alpha for fixed xd and xb
    for (let a = 1.1; a <= 5; a += 0.1) {
      const calculatedN = calculateN(xd, xb, a);
      if (!isNaN(calculatedN) && isFinite(calculatedN) && calculatedN > 0) {
        data.push({
          alpha: parseFloat(a.toFixed(1)),
          plates: parseFloat(calculatedN.toFixed(2))
        });
      }
    }
    
    return data;
  };

  // Update N and chart data when parameters change
  useEffect(() => {
    const calculatedN = calculateN(xd, xb, alpha);
    setN(calculatedN);
    setChartData(generateChartData());
  }, [xd, xb, alpha]);

  return (
    <div className="flex flex-col p-6 bg-gray-50 rounded-lg shadow-md max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Fenske Equation Interactive Simulator</h1>
      
      <div className="mb-6">
        <div className="text-center p-4 bg-blue-100 rounded-lg mb-4">
          <div className="mb-2 text-lg font-semibold">Fenske Equation:</div>
          <div className="text-lg">N = log[(X<sub>d</sub>/(1-X<sub>d</sub>))·((1-X<sub>b</sub>)/X<sub>b</sub>)] / log α<sub>avg</sub></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 font-medium">
            Mole fraction in distillate (X<sub>d</sub>): {xd.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.01"
            max="0.99"
            step="0.01"
            value={xd}
            onChange={(e) => setXd(Number(e.target.value))}
            className="w-full"
          />
          
          <div className="mt-6">
            <label className="mb-2 font-medium">
              Mole fraction in bottoms (X<sub>b</sub>): {xb.toFixed(2)}
            </label>
            <input
              type="range" 
              min="0.01"
              max="0.99"
              step="0.01"
              value={xb}
              onChange={(e) => setXb(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="mt-6">
            <label className="mb-2 font-medium">
              Relative volatility (α<sub>avg</sub>): {alpha.toFixed(2)}
            </label>
            <input
              type="range" 
              min="1.1"
              max="5"
              step="0.1"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            {error ? (
              <div className="text-xl font-bold text-center text-red-600">
                {error}
              </div>
            ) : (
              <div className="text-xl font-bold text-center">
                Number of theoretical plates: {n.toFixed(2)}
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2">Parameter Effects:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Higher separation (larger X<sub>d</sub> or smaller X<sub>b</sub>) requires more plates</li>
              <li>Higher relative volatility (α) reduces the number of required plates</li>
              <li>The equation assumes constant relative volatility throughout the column</li>
              <li>Valid calculations require X<sub>d</sub> > X<sub>b</sub> (separation is occurring)</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col h-64 md:h-auto">
          <div className="text-center mb-2 font-medium">Number of Plates vs. Relative Volatility</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                label={{ value: 'Relative Volatility (α)', position: 'insideBottom', offset: -5 }}
                dataKey="alpha" 
              />
              <YAxis 
                label={{ value: 'Number of Theoretical Plates (N)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => [`${value}`, 'Plates']} />
              <Line 
                type="monotone" 
                dataKey="plates" 
                name="Theoretical Plates" 
                stroke="#15803d" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium">Current values:</p>
            <p>X<sub>d</sub> = {xd.toFixed(2)}, X<sub>b</sub> = {xb.toFixed(2)}, α = {alpha.toFixed(2)}</p>
            {!error && <p>N = {n.toFixed(2)} theoretical plates</p>}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Equation Interpretation:</h3>
        <p>
          The Fenske equation calculates the minimum number of theoretical plates required for 
          separating binary mixtures at total reflux (when there is no net flow of liquid or vapor). 
          It's useful for preliminary distillation column design and establishes the theoretical lower 
          limit for the number of plates needed to achieve a specific separation.
        </p>
      </div>
    </div>
  );
}