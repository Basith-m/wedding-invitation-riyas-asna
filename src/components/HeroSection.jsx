import { useRef, useState, useCallback } from 'react';

// Timings calibrated for the envelope video
const HERO_REVEAL_DELAY_MS = 7000; // Text & background reveal at 7s as envelope opens
const SCROLL_UNLOCK_DELAY_MS = 8000; // Scroll unlocks as the scene stabilizes

export default function HeroSection({ coupleData, onStartInvitation, onUnlockScroll, isLocked }) {
  const videoRef = useRef(null);
  const heroSectionRef = useRef(null);

  const [hasRevealedHero, setHasRevealedHero] = useState(false);
  const [hasUnlockedScroll, setHasUnlockedScroll] = useState(false);
  const [hasCompletedVideo, setHasCompletedVideo] = useState(false);
  const [isVideoFaded, setIsVideoFaded] = useState(false);

  const accumulatedPlaybackMs = useRef(0);
  const playbackSegmentStartTime = useRef(null);
  const heroRevealTimerId = useRef(null);
  const scrollUnlockTimerId = useRef(null);
  const isStartingRef = useRef(false);

  // 1. Reveal hero text and fade video to show hero-scene.jpg
  const revealHeroText = useCallback(() => {
    setHasRevealedHero(true);
    setIsVideoFaded(true); // Fades out the video so hero-scene.jpg becomes visible

    if (heroRevealTimerId.current) {
      clearTimeout(heroRevealTimerId.current);
      heroRevealTimerId.current = null;
    }
  }, []);

  // 2. Unlock scroll indicator
  const triggerUnlockScroll = useCallback(() => {
    setHasUnlockedScroll(true);
    if (scrollUnlockTimerId.current) {
      clearTimeout(scrollUnlockTimerId.current);
      scrollUnlockTimerId.current = null;
    }
    onUnlockScroll();
  }, [onUnlockScroll]);

  // 3. Finalize on video end
  const onVideoComplete = useCallback(() => {
    if (hasCompletedVideo) return;
    setHasCompletedVideo(true);

    revealHeroText();
    triggerUnlockScroll();

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (_) {}
    }

    if (heroSectionRef.current) {
      heroSectionRef.current.style.backgroundImage = "url('/assets/images/hero-scene.png')";
    }
  }, [hasCompletedVideo, revealHeroText, triggerUnlockScroll]);

  const pausePlaybackTimer = useCallback(() => {
    if (playbackSegmentStartTime.current !== null) {
      accumulatedPlaybackMs.current += performance.now() - playbackSegmentStartTime.current;
      playbackSegmentStartTime.current = null;
    }
    if (heroRevealTimerId.current) {
      clearTimeout(heroRevealTimerId.current);
      heroRevealTimerId.current = null;
    }
    if (scrollUnlockTimerId.current) {
      clearTimeout(scrollUnlockTimerId.current);
      scrollUnlockTimerId.current = null;
    }
  }, []);

  const resumePlaybackTimer = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Media checks for reveal and unlock
    if (!hasRevealedHero && (video.currentTime >= 7.0 || accumulatedPlaybackMs.current >= HERO_REVEAL_DELAY_MS)) {
      revealHeroText();
    }
    if (!hasUnlockedScroll && (video.currentTime >= 8.0 || accumulatedPlaybackMs.current >= SCROLL_UNLOCK_DELAY_MS)) {
      triggerUnlockScroll();
    }

    if (playbackSegmentStartTime.current === null) {
      playbackSegmentStartTime.current = performance.now();

      if (!hasRevealedHero) {
        const remainingHero = Math.max(0, HERO_REVEAL_DELAY_MS - accumulatedPlaybackMs.current);
        heroRevealTimerId.current = setTimeout(revealHeroText, remainingHero);
      }
      if (!hasUnlockedScroll) {
        const remainingScroll = Math.max(0, SCROLL_UNLOCK_DELAY_MS - accumulatedPlaybackMs.current);
        scrollUnlockTimerId.current = setTimeout(triggerUnlockScroll, remainingScroll);
      }
    }
  }, [hasRevealedHero, hasUnlockedScroll, revealHeroText, triggerUnlockScroll]);

  const handleStart = useCallback(() => {
    if (isStartingRef.current || hasCompletedVideo) return;
    isStartingRef.current = true;

    accumulatedPlaybackMs.current = 0;
    playbackSegmentStartTime.current = null;

    // Ensure hero-scene.jpg is pre-loaded on background
    if (heroSectionRef.current) {
      heroSectionRef.current.style.backgroundImage = "url('/assets/images/hero-scene.png')";
    }

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.currentTime = 0;
      video.play().catch((err) => {
        console.warn('Playback fallback trigger:', err);
        revealHeroText();
        triggerUnlockScroll();
      });
    }

    onStartInvitation();
  }, [hasCompletedVideo, revealHeroText, triggerUnlockScroll, onStartInvitation]);

  const handleScrollClick = (e) => {
    e.stopPropagation();
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <section
      ref={heroSectionRef}
      id="heroSection"
      className="hero-section"
      tabIndex={0}
      role="button"
      aria-label="Tap or press Enter to open invitation"
      onClick={handleStart}
      onKeyDown={handleKeyDown}
    >
      {/* 
        Video fades out with smooth transition via isVideoFaded, 
        revealing hero-scene.jpg underneath 
      */}
      <video
        ref={videoRef}
        id="heroVideo"
        className={`hero-video ${isVideoFaded ? 'fade-out' : ''}`}
        src="/assets/video/envelope_opening_ra.mp4"
        poster="/assets/images/envelop_ra.png"
        playsInline
        webkit-playsinline=""
        muted
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
        onPlaying={resumePlaybackTimer}
        onPause={pausePlaybackTimer}
        onWaiting={pausePlaybackTimer}
        onStalled={pausePlaybackTimer}
        onEnded={onVideoComplete}
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (!video) return;

          if (!isVideoFaded && video.currentTime >= 5.5) {
            setIsVideoFaded(true);
          }

          // Reveal background & text at 8s
          if (!hasRevealedHero && video.currentTime >= 7.0) {
            revealHeroText();
          }

          // Unlock scroll at 9s
          if (!hasUnlockedScroll && video.currentTime >= 8.0) {
            triggerUnlockScroll();
          }

          // Complete safeguard near end
          if (!hasCompletedVideo && video.duration && video.currentTime >= video.duration - 0.15) {
            onVideoComplete();
          }
        }}
      />

      {/* Couple Identity Overlay */}
      <div className={`couple-overlay ${hasRevealedHero ? 'revealed' : ''}`}>
        <div className="hero-heart-icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>

        <p className="invitation-intro">{coupleData.intro}</p>

        <div className="ornamental-divider" aria-hidden="true">
          <div className="line" />
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <div className="line" />
        </div>

        <h1 className="couple-name">{coupleData.groom.name}</h1>
        {coupleData.groom.bio && (
          <div className="person-bio" style={{ whiteSpace: 'pre-line' }}>
            {coupleData.groom.bio}
          </div>
        )}

        <p className="couple-ampersand">&amp;</p>

        <h1 className="couple-name">{coupleData.bride.name}</h1>
        {coupleData.bride.bio && (
          <div className="person-bio" style={{ whiteSpace: 'pre-line' }}>
            {coupleData.bride.bio}
          </div>
        )}
      </div>

      {/* Scroll Down Prompt */}
      <div
        className={`scroll-indicator ${hasUnlockedScroll ? 'revealed' : ''}`}
        onClick={handleScrollClick}
        role="button"
        tabIndex={0}
      >
        <span className="scroll-text">Scroll</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}