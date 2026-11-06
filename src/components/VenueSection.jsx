import WavyDivider from './common/WavyDivider';
import SectionHeartDivider from './common/SectionHeartDivider';

export default function VenueSection({ venueData }) {
  const { title, sub, mapEmbedUrl, mapLinkUrl } = venueData;

  return (
    <section className="invitation-section text-center">
      <WavyDivider />

      <div className="content-container">
        <div className="section-icon-wrap" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        <h2 className="section-title">Venue</h2>
        <SectionHeartDivider />

        <p className="venue-title">{title}</p>
        <p className="venue-sub">{sub}</p>

        <div className="venue-map-wrap">
          <iframe
            src={mapEmbedUrl}
            title={`Venue Map - ${title}`}
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href={mapLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="save-date-pill-btn"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}