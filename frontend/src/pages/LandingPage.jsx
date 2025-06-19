import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const ANIMATION_DURATION = 1500;
  const ANIMATION_TOTAL_DURATION = ANIMATION_DURATION + 200;

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/login');
    }, ANIMATION_TOTAL_DURATION);
  };

  return (
    <div
      className={`landing-fixed ${isExiting ? 'landing-rotate-exit' : 'landing-rotate-enter'}`}
      style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
    >
      <div className="landing-circle-container">
        <div className="landing-ripple"></div>
        <div className="landing-ripple"></div>
        <div className="landing-ripple"></div>
        <button
          onClick={handleClick}
          aria-label="Enter the website"
          className={`landing-btn ${isExiting ? 'landing-btn-exit' : 'landing-btn-enter'}`}
        >
          <h1 className="landing-title">
            VEGROW LIBRARY
          </h1>
        </button>
      </div>
    </div>
  );
}