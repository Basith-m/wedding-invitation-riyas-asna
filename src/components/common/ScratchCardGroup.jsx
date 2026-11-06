import { useEffect, useRef, useState } from 'react';

function ScratchCard({ value, label, isMonth = false }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const scratchesCountRef = useRef(0);
  const isRevealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Draw initial dark olive surface
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#40563A';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    const getCoords = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * (w / rect.width),
        y: (clientY - rect.top) * (h / rect.height)
      };
    };

    const checkClearedPercent = () => {
      if (isRevealedRef.current) return;
      try {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        let transparentInsideCircle = 0;
        let totalSampledInsideCircle = 0;
        const stride = 16;
        const cx = w / 2;
        const cy = h / 2;
        const rSq = (w / 2) * (w / 2);

        for (let i = 3; i < data.length; i += stride * 4) {
          const pixelIndex = (i - 3) / 4;
          const px = pixelIndex % w;
          const py = Math.floor(pixelIndex / w);
          const dx = px - cx;
          const dy = py - cy;
          if (dx * dx + dy * dy <= rSq) {
            totalSampledInsideCircle++;
            if (data[i] === 0) {
              transparentInsideCircle++;
            }
          }
        }

        if (totalSampledInsideCircle > 0) {
          const percent = (transparentInsideCircle / totalSampledInsideCircle) * 100;
          if (percent >= 50) {
            isRevealedRef.current = true;
            setRevealed(true);
          }
        }
      } catch (_) {}
    };

    const scratch = (x, y, prev) => {
      if (isRevealedRef.current) return;
      ctx.globalCompositeOperation = 'destination-out';

      if (prev) {
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(x, y);
        ctx.lineWidth = 48;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();

      scratchesCountRef.current++;
      if (scratchesCountRef.current % 10 === 0) {
        checkClearedPercent();
      }
    };

    const handlePointerDown = (e) => {
      e.preventDefault();
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
      isDrawingRef.current = true;
      lastPointRef.current = getCoords(e.clientX, e.clientY);
      scratch(lastPointRef.current.x, lastPointRef.current.y, null);
    };

    const handlePointerMove = (e) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const current = getCoords(e.clientX, e.clientY);
      scratch(current.x, current.y, lastPointRef.current);
      lastPointRef.current = current;
    };

    const handlePointerEnd = (e) => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      lastPointRef.current = null;
      checkClearedPercent();
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerEnd);
    canvas.addEventListener('pointercancel', handlePointerEnd);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerEnd);
      canvas.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, []);

  return (
    <div className="date-card-unit">
      <div className="date-card-box">
        <div className="date-card-revealed">
          <span className={`date-card-val ${isMonth ? 'date-card-month-val' : 'date-card-day-val'}`}>
            {value}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          className={`date-card-canvas ${revealed ? 'revealed' : ''}`}
          width="280"
          height="280"
          aria-label={`Scratch to reveal ${label}`}
        />
      </div>
      <span className="date-card-label">{label}</span>
    </div>
  );
}

export default function ScratchCardGroup({ day, month, year }) {
  return (
    <div className="date-cards-wrapper">
      <div className="date-cards-row">
        <ScratchCard value={day} label="DAY" />
        <ScratchCard value={month} label="MONTH" isMonth />
        <ScratchCard value={year} label="YEAR" />
      </div>
    </div>
  );
}