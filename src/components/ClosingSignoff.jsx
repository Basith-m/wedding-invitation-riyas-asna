import WavyDivider from './common/WavyDivider';

export default function ClosingSignoff({ tagline, brideName, groomName }) {
  return (
    <div className="closing-signoff">
      <WavyDivider style={{ marginBottom: '1.75rem' }} />

      <div className="closing-tagline">{tagline}</div>
      <div className="closing-couple-names">
        {groomName}
        <br /> &amp; <br />
        {brideName}
      </div>

      <WavyDivider
        rotated
        style={{
          marginTop: '1.75rem',
          marginBottom: '2rem',
          transform: 'rotate(180deg)'
        }}
      />
    </div>
  );
}