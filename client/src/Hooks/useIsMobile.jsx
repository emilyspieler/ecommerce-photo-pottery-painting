import { useState, useEffect } from "react";

const breakpoints = {
  sm: 480,
  md: 768,
  lg: 992,
  xl: 1400,
};

const useIsMobile = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile: windowWidth <= breakpoints.md,
    isSmall: windowWidth <= breakpoints.sm,
    isMedium: windowWidth <= breakpoints.md,
    isLarge: windowWidth <= breakpoints.lg,
    isXL: windowWidth <= breakpoints.xl,
    windowWidth,
  };
};

export default useIsMobile;