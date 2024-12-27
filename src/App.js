import React, { useState } from 'react';
import UploadImage from './components/UploadImage';
import DisplayImages from './components/DisplayImage';
import { useLanguage } from './contexts/LanguageContext';
import { translations } from './translations';
import './components/App.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  const [showApp, setShowApp] = useState(false);
  const [images, setImages] = useState([]);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language] || {};

  const navigateToApp = () => {
    setShowApp(true);
  };

  const navigateToHome = () => {
    setShowApp(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = (event) => {
    event.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleImageUpload = (newImage) => {
    setImages((prevImages) => [...prevImages, newImage]);
  };

  return (
    <ErrorBoundary>
      <div className="main-container">
        {!showApp ? (
          <>
            <header className="navbar">
              <div className="logo">{t.appName || "Default App Name"}</div>
              <div className="nav-container">
                <nav>
                  <ul className="nav-links">
                    <li><a href="#home">{t.nav?.home || "Home"}</a></li>
                    <li><a href="#features">{t.nav?.features || "Features"}</a></li>
                    <li><a href="#about">{t.nav?.about || "About"}</a></li>
                    <li><a href="#contact" onClick={handleContactClick}>{t.nav?.contact || "Contact"}</a></li>
                  </ul>
                </nav>
                <button onClick={toggleLanguage} className="language-toggle-btn">
                  {language === 'en' ? 'हिंदी' : 'English'}
                </button>
              </div>
            </header>

            <section className="hero-section" id="home">
              <div className="hero-content">
                <h1>{t.hero?.welcome || "Welcome"}</h1>
                <p className="hero-text">{t.hero?.description || "Description"}</p>
                <button className="start-button" onClick={navigateToApp}>{t.hero?.startButton || "Start"}</button>
              </div>
            </section>

            <section className="features-section" id="features">
              <h2>{t.features?.title || "Features"}</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <h3>{t.features?.aiDetection || "AI-Powered Detection"}</h3>
                  <p>{t.features?.aiDesc || "Description"}</p>
                </div>
                <div className="feature-item">
                  <h3>{t.features?.instantResults || "Instant Results"}</h3>
                  <p>{t.features?.instantDesc || "Description"}</p>
                </div>
                <div className="feature-item">
                  <h3>{t.features?.expertAdvice || "Expert Advice"}</h3>
                  <p>{t.features?.expertDesc || "Description"}</p>
                </div>
              </div>
            </section>

            <section className="about-section" id="about">
              <h2>{t.about?.title || "About Us"}</h2>
              <div className="about-content">
                <p>{t.about?.description || "About content"}</p>
              </div>
            </section>
          </>
        ) : (
          <>
            <UploadImage onImageUpload={handleImageUpload} onBackToHome={navigateToHome} />
            <DisplayImages images={images} />
          </>
        )}

        <footer className="footer">
          <div className="footer-content">
            <p className="footer-item">Contact: (+91)8618630468</p>
            <p className="footer-item">
              Email: <a href="mailto:owner@example.com" className="footer-link">ronitpathak12345@gmail.com</a>
            </p>
            <p className="footer-item">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
