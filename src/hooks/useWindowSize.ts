import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    isMobile: typeof window !== "undefined" ? window.innerWidth <= 480 : false,
    isTablet: typeof window !== "undefined" ? window.innerWidth <= 768 : false,
    isDesktop:
      typeof window !== "undefined" ? window.innerWidth >= 1024 : false,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        isMobile: window.innerWidth <= 480,
        isTablet: window.innerWidth <= 768,
        isDesktop: window.innerWidth >= 1024,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
