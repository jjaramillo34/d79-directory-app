'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-sky-500 border-none text-white cursor-pointer flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 hover:scale-110 hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50"
          title="Scroll to top"
          aria-label="Scroll to top of page"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
