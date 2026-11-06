import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer({ audioSrc, isInvitationStarted }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play audio when user opens the invitation
  useEffect(() => {
    if (isInvitationStarted && audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Audio autoplay prevented:', err);
        setIsPlaying(false);
      });
    }
  }, [isInvitationStarted]);

  // Pause on window blur / tab hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const toggleMusic = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      <button
        type="button"
        className={`floating-music-btn ${!isPlaying ? 'muted' : ''}`}
        onClick={toggleMusic}
        aria-label="Toggle background music"
        title="Toggle Music"
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
    </>
  );
}