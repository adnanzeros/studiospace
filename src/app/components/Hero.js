'use client';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './Hero.css';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Keyboard } from 'swiper/modules';

/* *...* এর ভেতরের লেখা gradient রঙে highlight হবে */
const slides = [
  {
    img: '/hero/slide-1-photo-studio.jpg',
    pos: '72% center',
    title: 'Find the Perfect Photo Studio for Your *Next Shoot*',
    text: 'Cyc walls, natural-light lofts and pro lighting rigs, bookable by the hour.',
    cta: {
      label: 'Explore Studios',
      href: '/studios?category=photo-studio',
    },
  },
  {
    img: '/hero/slide-2-podcast-lounge.jpg',
    pos: '70% center',
    title: 'Record Your Next *Podcast* in a Pro Sound Lounge',
    text: 'Treated rooms, broadcast mics and mixing desks, ready when you are.',
    cta: {
      label: 'Browse Podcast Rooms',
      href: '/studios?category=podcast-lounge',
    },
  },
  {
    img: '/hero/slide-3-film-stage.jpg',
    pos: '78% center',
    title: 'Shoot Your *Next Film* on a Real Stage',
    text: 'Spotlights, rigs and crew space for productions of any size.',
    cta: {
      label: 'Find Film Stages',
      href: '/studios?category=film-stage',
    },
  },
];

const renderTitle = t =>
  t.split('*').map((part, k) =>
    k % 2 ? (
      <span key={k} className="hero-hl">
        {part}
      </span>
    ) : (
      part
    ),
  );

const Arrow = ({ dir }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>
);

export default function Hero() {
  const swiperRef = useRef(null);
  const [i, setI] = useState(0);

  return (
    <section
      className="hero under-nav"
      aria-roledescription="carousel"
      aria-label="Featured studio types"
    >
      <Swiper
        className="hero-slides"
        modules={[Autoplay, EffectFade, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        rewind
        keyboard={{ enabled: true }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSwiper={s => (swiperRef.current = s)}
        onSlideChange={s => setI(s.activeIndex)}
      >
        {slides.map((s, k) => {
          const active = k === i;
          const Title = active ? 'h1' : 'h2';
          return (
            <SwiperSlide
              key={s.img}
              className={`hero-slide ${active ? 'active' : ''}`}
              aria-hidden={!active}
            >
              <img
                className="hero-img"
                src={s.img}
                alt=""
                style={{ objectPosition: s.pos }}
                loading={k === 0 ? 'eager' : 'lazy'}
                draggable="false"
              />
              <div className="hero-overlay" />

              <div className="container hero-content">
                <span className="hero-badge">
                  <i /> Peer-to-peer creative workspaces
                </span>
                <Title className="hero-title">{renderTitle(s.title)}</Title>
                <p className="hero-text">{s.text}</p>
                <div className="hero-actions">
                  <Link
                    href={s.cta.href}
                    className="btn btn-primary"
                    tabIndex={active ? 0 : -1}
                  >
                    {s.cta.label}
                    <Arrow dir="right" />
                  </Link>
                  <Link
                    href="/add-studio"
                    className="btn btn-ghost"
                    tabIndex={active ? 0 : -1}
                  >
                    Host Your Space
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="container hero-controls">
        <div className="hero-dots">
          {slides.map((_, k) => (
            <button
              key={k}
              type="button"
              className={k === i ? 'active' : ''}
              onClick={() => swiperRef.current?.slideTo(k)}
              aria-label={`Go to slide ${k + 1}`}
            />
          ))}
        </div>
        <div className="hero-arrows">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous slide"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next slide"
          >
            <Arrow dir="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
