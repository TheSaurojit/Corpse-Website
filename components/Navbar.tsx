'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.inner} aria-label="Primary navigation">
        <ul className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/" aria-label="Arena home" className={styles.logoWrap}>
          <Image
            src="/LOGO.png"
            alt="Arena"
            width={32}
            height={32}
            priority
            className={styles.logoImg}
          />
        </Link>

        <Link href="#contact" id="cta-get-started" className={styles.ctaBtn}>
          <span>Get started</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
          {NAV_LINKS.map((link) => (
            <Link
              href={link.href}
              key={link.label}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="#contact" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
