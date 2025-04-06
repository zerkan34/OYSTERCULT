// ScrollReset.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollReset = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll top reset
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Hacky viewport reset
    const oldViewport = document.querySelector("meta[name=viewport]");
    if (oldViewport) {
      oldViewport.remove();
    }

    const newViewport = document.createElement("meta");
    newViewport.name = "viewport";
    newViewport.content = "width=1920, initial-scale=0.25, user-scalable=yes";
    document.head.appendChild(newViewport);

    // Trigger resize to force reflow on some mobile browsers
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  }, [pathname]);

  return null;
};

export default ScrollReset;