import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function LangmuirIsothermKgSimulator() {
  const [qm, setQm] = useState(10); // kg/kg
  const [kl, setKl] = useState(0.5); // L/mol
  const [zeoliteMass, setZeoliteMass] = useState(5); // kg

  const generateData = () => {
    const data = [];
    for (let ce = 0; ce <= 10; ce += 0.1) {
      const qe = (qm * kl * ce) / (1 + kl * ce);
      const waterMass = qe * zeoliteMass;
      data.push({
        ce: parseFloat(ce.toFixed(1)),
        qe: parseFloat(qe.toFixed(3)),
        waterMass: parseFloat(waterMass.toFixed(3))
      });
    }
    return data;
  };

  const data = generateData();
  const currentQe = (qm * kl * 5) / (1 + kl * 5);
  const currentWaterMass = currentQe * zeoliteMass;

  return (
    <div className="flex flex-col p-6 bg-gray-50 rounded-lg shadow-md max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Large-Scale Langmuir Isotherm Simulator</h1>

      <div className="mb-6">
        <div className="text-center p-4 bg-blue-100 rounded-lg mb-4">
          <div className="mb-2 text-lg font-semibold">Langmuir Equation:</div>
          <div className="text-lg">q<sub>e</sub> = (q<sub>m</sub>K<sub>L</sub>C<sub>e</sub>) / (1 + K<sub>L</sub>C<sub>e</sub>)</div>
          <div className="mt-2 text-lg font-semibold">Water Mass Calculation:</div>
          <div className="text-lg">m<sub>water</sub> = q<sub>e</sub> × m<sub>zeolite</sub></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 font-medium">
            Maximum Adsorption Capacity (q<sub>m</sub>): {qm} kg/kg
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={qm}
            onChange={(e) => setQm(Number(e.target.value))}
            className="w-full"
          />

          <div className="mt-6">
            <label className="mb-2 font-medium">
              Langmuir Constant (K<sub>L</sub>): {kl} L/mol
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={kl}
              onChange={(e) => setKl(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 font-medium">
              Zeolite Mass (m<sub>zeolite</sub>): {zeoliteMass} kg
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={zeoliteMass}
              onChange={(e) => setZeoliteMass(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2">Parameter Effects:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Higher q<sub>m</sub> increases the maximum adsorption capacity</li>
              <li>Higher K<sub>L</sub> indicates stronger binding affinity</li>
              <li>Increasing zeolite mass directly increases the total water mass adsorbed</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col h-64 md:h-auto">
          <div className="text-center mb-2 font-medium">Adsorption Isotherm Plot</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                label={{ value: 'Equilibrium Concentration (Ce) [mol/L]', position: 'insideBottom', offset: -5 }}
                dataKey="ce" 
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Adsorbed Amount (qe) [kg/kg]', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: 'Water Mass (kg)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "Adsorbed Amount") return [`${value} kg/kg`, name];
                  return [`${value} kg`, name];
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="qe" 
                name="Adsorbed Amount" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="waterMass" 
                name="Water Mass" 
                stroke="#16a34a" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium">At Ce = 5 mol/L:</p>
                <p>q<sub>e</sub> = {currentQe.toFixed(3)} kg/kg</p>
              </div>
              <div>
                <p className="font-medium">Water Mass:</p>
                <p>m<sub>water</sub> = {currentWaterMass.toFixed(3)} kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Industrial Application:</h3>
        <p>
          This simulator is designed for industrial-scale applications, showing adsorption capacity in kg of adsorbate per kg of zeolite.
          The water mass calculation (m<sub>water</sub> = q<sub>e</sub> × m<sub>zeolite</sub>) helps estimate the total mass of water that can be 
          adsorbed by a given amount of zeolite under specific conditions, which is useful for designing adsorption systems
          for water purification, dehumidification, or other industrial processes.
        </p>
      </div>
    </div>
  );
}
