import { useState, useEffect } from 'react';
import { invitationData } from './data/invitationData';
import AudioPlayer from './components/AudioPlayer';
import HeroSection from './components/HeroSection';
import WelcomeSection from './components/WelcomeSection';
import DateRevealSection from './components/DateRevealSection';
import CountdownSection from './components/CountdownSection';
import TimelineSection from './components/TimelineSection';
import VenueSection from './components/VenueSection';
import RsvpSection from './components/RsvpSection';
import ClosingSignoff from './components/ClosingSignoff';
import Footer from './components/Footer';

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  // Sync scroll lock with the body tag matching the original CSS rule
  useEffect(() => {
    if (isLocked) {
      document.body.classList.add('locked');
    } else {
      document.body.classList.remove('locked');
    }
  }, [isLocked]);

  const handleStartInvitation = () => {
    setIsStarted(true);
  };

  const handleUnlockScroll = () => {
    setIsLocked(false);
  };

  return (
    <>
      {/* Subtle Gold Filigree Background Overlay */}
      <div className="pattern-overlay" aria-hidden="true" />

      {/* Background Audio with Floating Controls */}
      <AudioPlayer audioSrc="/assets/audio/Slepless.mp3" isInvitationStarted={isStarted} />

      {/* Opening 3D Door & Couple Reveal Hero Section */}
      <HeroSection
        coupleData={invitationData.couple}
        onStartInvitation={handleStartInvitation}
        onUnlockScroll={handleUnlockScroll}
        isLocked={isLocked}
      />

      {/* Main Parchment Invitation Body */}
      <div className="invitation-body">
        <WelcomeSection text={invitationData.welcome.text} />
        <DateRevealSection nikahData={invitationData.nikah} />
        <CountdownSection isoTargetDate={invitationData.nikah.isoTargetDate} />
        <TimelineSection timelineData={invitationData.timeline} />
        <VenueSection venueData={invitationData.venue} />

        {/* Closing Artwork Container with RSVP, Signoff and Footer */}
        <div className="closing-container">
          <RsvpSection />
          <ClosingSignoff
            tagline={invitationData.closing.tagline}
            brideName={invitationData.couple.bride.name}
            groomName={invitationData.couple.groom.name}
          />
          <Footer
            brideName={invitationData.couple.bride.name}
            groomName={invitationData.couple.groom.name}
            credits={invitationData.closing.credits}
          />
        </div>
      </div>
    </>
  );
}