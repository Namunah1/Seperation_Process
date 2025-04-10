import { useEffect, useState, useRef } from 'react';
import './Membrane.css';

export default function Membrane() {
  const [deltaP, setDeltaP] = useState(20);
  const [deltaPi, setDeltaPi] = useState(10);
  const [Pe, setPe] = useState(1.0);
  const [A, setA] = useState(10);

  const canvasRef = useRef(null);
  const sliderCanvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState({ J: 0, q: 0 });

  useEffect(() => {
    const J = Pe * (deltaP - deltaPi);
    const q = J * A;
    setResult({ J, q });
  }, [deltaP, deltaPi, Pe, A]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    const maxX = 50;
    const xScale = width / maxX;

    const points = [];
    const jValues = [];
    for (let x = 0; x <= maxX; x += 0.5) {
      const J = Pe * (x - deltaPi);
      points.push({ x, J });
      jValues.push(J);
    }

    const maxJ = Math.max(...jValues) * 1.1;
    const minJ = Math.min(...jValues) * 1.1;
    const jRange = Math.max(Math.abs(maxJ), Math.abs(minJ)) * 1.2;
    const jScale = height / (jRange * 2);
    const yOffset = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, yOffset);
    ctx.lineTo(width, yOffset);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= maxX; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x * xScale, 0);
      ctx.lineTo(x * xScale, height);
      ctx.stroke();
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText(x.toString(), x * xScale, yOffset + 15);
    }

    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    const jStep = jRange / 5;
    for (let i = -2; i <= 2; i++) {
      const jValue = i * jStep;
      const labelY = yOffset - jValue * jScale;
      if (labelY >= 10 && labelY <= height - 10) {
        ctx.fillText(jValue.toFixed(1), 20, labelY + 4);
      }
    }

    ctx.strokeStyle = 'rgba(100, 100, 100, 0.7)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(deltaPi * xScale, 0);
    ctx.lineTo(deltaPi * xScale, height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(100, 100, 100, 0.9)';
    ctx.textAlign = 'center';
    ctx.fillText("Equilibrium (J=0)", deltaPi * xScale, height - 10);

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((point, index) => {
      const canvasX = point.x * xScale;
      const canvasY = yOffset - point.J * jScale;
      if (index === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    });
    ctx.stroke();

    const J = Pe * (deltaP - deltaPi);
    const pointX = deltaP * xScale;
    const pointY = yOffset - J * jScale;

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Hydrostatic Pressure Gradient (ΔP) mmHg', width / 2, height - 5);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Filtration Rate (J)', 0, 0);
    ctx.restore();

    const sliderCanvas = sliderCanvasRef.current;
    if (sliderCanvas) {
      const sliderCtx = sliderCanvas.getContext('2d');
      const sliderWidth = sliderCanvas.width;
      const sliderHeight = sliderCanvas.height;

      sliderCtx.clearRect(0, 0, sliderWidth, sliderHeight);
      sliderCtx.strokeStyle = '#aaa';
      sliderCtx.lineWidth = 2;
      sliderCtx.beginPath();
      sliderCtx.moveTo(0, sliderHeight / 2);
      sliderCtx.lineTo(sliderWidth, sliderHeight / 2);
      sliderCtx.stroke();

      const thumbX = deltaP * xScale;
      sliderCtx.fillStyle = 'red';
      sliderCtx.beginPath();
      sliderCtx.arc(thumbX, sliderHeight / 2, 10, 0, Math.PI * 2);
      sliderCtx.fill();

      for (let x = 0; x <= maxX; x += 10) {
        sliderCtx.fillStyle = '#666';
        sliderCtx.textAlign = 'center';
        sliderCtx.fillText(x.toString(), x * xScale, sliderHeight - 5);
      }
    }
  }, [deltaP, deltaPi, Pe, A]);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const canvas = sliderCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const maxX = 50;
    const xScale = canvas.width / maxX;
    let newDeltaP = x / xScale;
    newDeltaP = Math.max(0, Math.min(maxX, newDeltaP));
    setDeltaP(Math.round(newDeltaP * 10) / 10);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className="fullscreen-container">

      <p className="subheading">J = Pe(ΔP−Δπ), q = J⋅A</p>

      <canvas ref={canvasRef} width={800} height={300} className="main-canvas" />

      <div className="slider-section">
        <div className="label">Hydrostatic Pressure Gradient (ΔP): {deltaP} mmHg</div>
        <canvas
          ref={sliderCanvasRef}
          width={800}
          height={40}
          className="slider-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        />
      </div>

      <div className="controls">
        <div className="control">
          <label>Oncotic Pressure Gradient (Δπ): {deltaPi} mmHg</label>
          <input type="range" min="0" max="30" step="0.1" value={deltaPi} onChange={(e) => setDeltaPi(+e.target.value)} />
        </div>
        <div className="control">
          <label>Hydraulic Permeability (Pe): {Pe}</label>
          <input type="range" min="0.1" max="5" step="0.1" value={Pe} onChange={(e) => setPe(+e.target.value)} />
        </div>
        <div className="control">
          <label>Membrane Area (A): {A} cm²</label>
          <input type="range" min="1" max="50" step="1" value={A} onChange={(e) => setA(+e.target.value)} />
        </div>
      </div>

      <div className="results">
        <h2>Results:</h2>
        <div className="result-block">
          <div>
            <p>J = Pe(ΔP−Δπ)</p>
            <p className="value">J = {result.J.toFixed(2)}</p>
            <p className="description">Filtration rate across membrane</p>
          </div>
          <div>
            <p>q = J⋅A</p>
            <p className="value">q = {result.q.toFixed(2)}</p>
            <p className="description">Total fluid flow</p>
          </div>
        </div>
      </div>
    </div>
  );
}
