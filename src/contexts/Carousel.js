import { useState, useEffect } from 'react';

const Carousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="carousel">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          style={{ display: index === currentIndex ? 'block' : 'none' }}
        >
          <h3>{slide.title}</h3>
          <p>{slide.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Carousel;



