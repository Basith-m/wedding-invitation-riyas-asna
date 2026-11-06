import { useEffect, useState } from 'react';
import WavyDivider from './common/WavyDivider';
import SectionHeartDivider from './common/SectionHeartDivider';

export default function CountdownSection({ isoTargetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const target = new Date(isoTargetDate).getTime();

    const updateTimer = () => {
      const distance = target - new Date().getTime();

      if (distance <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isoTargetDate]);

  return (
    <section className="invitation-section text-center">
      <WavyDivider />

      <div className="content-container">
        <h2 className="section-title">Counting Down to Forever</h2>
        <SectionHeartDivider />

        <div className="countdown-row">
          <div className="countdown-unit">
            <div className="countdown-digit-box">
              <span className="digit-num">{timeLeft.days}</span>
            </div>
            <p className="digit-label">Days</p>
          </div>

          <div className="countdown-unit">
            <div className="countdown-digit-box">
              <span className="digit-num">{timeLeft.hours}</span>
            </div>
            <p className="digit-label">Hours</p>
          </div>

          <div className="countdown-unit">
            <div className="countdown-digit-box">
              <span className="digit-num">{timeLeft.minutes}</span>
            </div>
            <p className="digit-label">Minutes</p>
          </div>

          <div className="countdown-unit">
            <div className="countdown-digit-box">
              <span className="digit-num">{timeLeft.seconds}</span>
            </div>
            <p className="digit-label">Seconds</p>
          </div>
        </div>
      </div>
    </section>
  );
}