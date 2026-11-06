import WavyDivider from './common/WavyDivider';
import SectionHeartDivider from './common/SectionHeartDivider';
import ScratchCardGroup from './common/ScratchCardGroup';

export default function DateRevealSection({ nikahData }) {
  const { title, subtitle, day, month, year, calendar } = nikahData;

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    calendar.title
  )}&dates=${calendar.startUtc}/${calendar.endUtc}&details=${encodeURIComponent(
    calendar.details
  )}&location=${encodeURIComponent(calendar.location)}`;

  return (
    <section className="invitation-section text-center date-scratch-section">
      <WavyDivider />

      <div className="content-container">
        <h2 className="section-title date-heading">{title}</h2>
        <SectionHeartDivider />
        <p className="date-scratch-subtitle">{subtitle}</p>

        <ScratchCardGroup day={day} month={month} year={year} />

        <div className="mt-8 flex justify-center">
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="save-date-pill-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
              <path d="M3 10h18" />
              <path d="M16 19h6" />
              <path d="M19 16v6" />
            </svg>
            Save The Date
          </a>
        </div>
      </div>
    </section>
  );
}