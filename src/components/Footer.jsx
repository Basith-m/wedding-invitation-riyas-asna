export default function Footer({ brideName, groomName, credits }) {
  return (
    <footer className="invitation-footer">
      <div className="footer-names">
        {groomName} &amp; {brideName}
      </div>
      <div className="instagram-credit">
        <p className="credit-lead">{credits.lead}</p>
        <p className="credit-author">
          by{' '}
          <a
            href={credits.authorLink}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
          >
            {credits.authorName}
          </a>
        </p>
      </div>
    </footer>
  );
}