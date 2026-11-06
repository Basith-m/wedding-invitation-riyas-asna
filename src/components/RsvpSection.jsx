import { useState, useRef } from 'react';
import WavyDivider from './common/WavyDivider';
import SectionHeartDivider from './common/SectionHeartDivider';

export default function RsvpSection() {
  const [formData, setFormData] = useState({
    name: '',
    attendance: '',
    guestCount: '1',
    message: ''
  });

  const [submittedResponse, setSubmittedResponse] = useState(null);
  const confirmationRef = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!formData.attendance) {
      alert('Please select whether you will be attending.');
      return;
    }

    setSubmittedResponse({
      name: formData.name.trim(),
      attendance: formData.attendance,
      guests: formData.attendance === 'accept' ? formData.guestCount : '0',
      message: formData.message.trim()
    });

    setTimeout(() => {
      confirmationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  const handleEdit = () => {
    setSubmittedResponse(null);
  };

  return (
    <section className="invitation-section">
      <WavyDivider />

      <div className="content-container">
        <div className="section-icon-wrap" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        <h2 className="section-title text-center">RSVP</h2>
        <SectionHeartDivider />

        {!submittedResponse ? (
          <form onSubmit={handleSubmit} className="direct-rsvp-form">
            <div className="form-group">
              <label htmlFor="name" className="direct-form-label">
                Guest Name <span style={{ color: '#c53030' }}>*</span>
              </label>
              <input
                type="text"
                id="name"
                className="direct-form-input"
                required
                placeholder="Your full name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="attendance" className="direct-form-label flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Will you be attending? <span style={{ color: '#c53030' }}>*</span>
              </label>
              <select
                id="attendance"
                className="direct-form-select"
                required
                value={formData.attendance}
                onChange={handleChange}
              >
                <option value="" disabled>Select an option...</option>
                <option value="accept">Accepts with pleasure</option>
                <option value="decline">Declines with regret</option>
              </select>
            </div>

            {formData.attendance !== 'decline' && (
              <div className="form-group" id="guestCountGroup">
                <label htmlFor="guestCount" className="direct-form-label flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Number of Guests <span style={{ color: '#c53030' }}>*</span>
                </label>
                <select
                  id="guestCount"
                  className="direct-form-select"
                  value={formData.guestCount}
                  onChange={handleChange}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests and more</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="message" className="direct-form-label">Message</label>
              <textarea
                id="message"
                rows="3"
                className="direct-form-textarea"
                placeholder="Write your wishes or notes..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="direct-submit-btn">
              Submit RSVP
            </button>
          </form>
        ) : (
          <div
            ref={confirmationRef}
            className="rsvp-confirmation-card"
            role="status"
            aria-live="polite"
          >
            <div className="rsvp-confirm-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="rsvp-confirm-title">
              Thank you, {submittedResponse.name}!
            </h3>
            <p className="rsvp-confirm-text">
              {submittedResponse.attendance === 'accept'
                ? 'We look forward to celebrating with you.'
                : 'Thank you for letting us know. You will be missed.'}
            </p>
            {submittedResponse.attendance === 'accept' && (
              <div className="rsvp-confirm-badge">
                Seats Reserved: {submittedResponse.guests} {submittedResponse.guests === '1' ? 'Guest' : 'Guests'}
              </div>
            )}
            <div>
              <button type="button" onClick={handleEdit} className="rsvp-edit-btn">
                Edit Response
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}