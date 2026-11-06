export default function WelcomeSection({ text }) {
  const dividerIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#8a7a4e" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );

  return (
    <section className="welcome-section">
      <div className="content-container">
        <div className="welcome-divider">
          <div className="gradient-line-left" />
          {dividerIcon}
          <div className="gradient-line-right" />
        </div>

        <p className="welcome-text">{text}</p>

        <div className="welcome-divider bottom">
          <div className="gradient-line-left" />
          {dividerIcon}
          <div className="gradient-line-right" />
        </div>
      </div>
    </section>
  );
}