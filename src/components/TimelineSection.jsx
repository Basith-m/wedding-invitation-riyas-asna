import WavyDivider from './common/WavyDivider';
import SectionHeartDivider from './common/SectionHeartDivider';

export default function TimelineSection({ timelineData }) {
  const { dateTitle, hijriDate, events } = timelineData;

  return (
    <section className="invitation-section">
      <WavyDivider />

      <div className="content-container">
        <div className="section-icon-wrap" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <h2 className="section-title text-center">Program Timeline</h2>
        <SectionHeartDivider />

        <div className="timeline-list">
          <div className="timeline-day-block">
            <div className="timeline-date-bar">
              <div className="timeline-rule" />
              <div className="timeline-date-container">
                <p className="timeline-date-title">{dateTitle}</p>
                <p className="timeline-hijri-date">{hijriDate}</p>
              </div>
              <div className="timeline-rule" />
            </div>

            {events.map((evt, idx) => (
              <div key={idx} className="timeline-event-row">
                <span className="timeline-time">{evt.time}</span>
                <div className="timeline-event-body">
                  <p className="timeline-event-title">{evt.title}</p>
                  <p className="timeline-event-desc">{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}