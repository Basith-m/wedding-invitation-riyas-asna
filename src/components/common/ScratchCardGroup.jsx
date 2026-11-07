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

    // Draw scratch coating with an elegant watermark hint
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    ctx.clip();
    
    // Base coating
    ctx.fillStyle = '#72141F';
    ctx.fillRect(0, 0, w, h);

    // ✨ Faint Gold "Scratch Me" Watermark hint
    ctx.fillStyle = 'rgba(235, 213, 183, 0.55)';
    ctx.font = '600 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ SCRATCH ✦', w / 2, h / 2);

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
        let transparent = 0;
        let total = 0;
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
            total++;
            if (data[i] === 0) transparent++;
          }
        }

        if (total > 0 && (transparent / total) * 100 >= 40) {
          isRevealedRef.current = true;
          setRevealed(true);
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
        ctx.lineWidth = 52;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      scratchesCountRef.current++;
      if (scratchesCountRef.current % 6 === 0) {
        checkClearedPercent();
      }
    };

    const handlePointerDown = (e) => {
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      isDrawingRef.current = true;
      lastPointRef.current = getCoords(e.clientX, e.clientY);
      // Immediate circle scratch on initial touch
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
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    };

    // Single Tap helper for guests who only click
    const handleClick = (e) => {
      if (isRevealedRef.current) return;
      const pt = getCoords(e.clientX, e.clientY);
      scratch(pt.x, pt.y, null);
      // Also scratch adjacent points to instantly expose number
      scratch(pt.x + 20, pt.y + 20, null);
      scratch(pt.x - 20, pt.y - 20, null);
      checkClearedPercent();
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerEnd);
    canvas.addEventListener('pointercancel', handlePointerEnd);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerEnd);
      canvas.removeEventListener('pointercancel', handlePointerEnd);
      canvas.removeEventListener('click', handleClick);
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