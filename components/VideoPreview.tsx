'use client';

import { useCallback, useRef, useState } from 'react';
import styles from './VideoPreview.module.css';

export default function VideoPreview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const openModal = useCallback(() => {
    setModalOpen(true);
    setTimeout(() => {
      modalVideoRef.current?.play().catch(() => {});
    }, 100);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    modalVideoRef.current?.pause();
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  };

  return (
    <>
      <button
        id="video-preview-btn"
        className={styles.previewBox}
        onClick={openModal}
        onMouseEnter={() => setPreviewHover(true)}
        onMouseLeave={() => setPreviewHover(false)}
        aria-label="Watch full clip"
      >
        <div className={styles.thumbnailWrap}>
          <video
            className={styles.thumbnail}
            src="/0411.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden="true"
          />

          <div className={`${styles.thumbnailOverlay} ${previewHover ? styles.overlayActive : ''}`} />

          <div className={`${styles.playIcon} ${previewHover ? styles.playActive : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <polygon points="6,3 17,10 6,17" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className={styles.label}>
          <span className={styles.labelDot} />
          <span className={styles.labelText}>Watch full clip</span>
          <svg
            className={`${styles.labelArrow} ${previewHover ? styles.labelArrowActive : ''}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {modalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
          tabIndex={-1}
        >
          <div className={styles.modalInner}>
            <button
              id="modal-close-btn"
              className={styles.closeBtn}
              onClick={closeModal}
              aria-label="Close video"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <video
              ref={modalVideoRef}
              className={styles.modalVideo}
              controls
              playsInline
              preload="auto"
            >
              <source src="/0411.webm" type="video/webm" />
              <source src="/0411.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}
