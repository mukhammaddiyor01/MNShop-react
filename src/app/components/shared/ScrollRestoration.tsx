import { useLayoutEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";

const storageKey = "mnshop:scroll-positions";

type ScrollPositions = Record<string, number>;

function readPositions(): ScrollPositions {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey) || "{}") as ScrollPositions;
  } catch {
    return {};
  }
}

function writePositions(positions: ScrollPositions) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(positions));
  } catch {
    // Scroll restoration is optional when browser storage is unavailable.
  }
}

export function ScrollRestoration() {
  const history = useHistory();
  const location = useLocation();
  const positions = useRef<ScrollPositions>(readPositions());
  const routeKey = location.key || `${location.pathname}${location.search}`;

  useLayoutEffect(() => {
    const storedPositions = positions.current;
    const target =
      history.action === "POP" ? storedPositions[routeKey] || 0 : 0;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: target, left: 0, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      storedPositions[routeKey] = window.scrollY;
      writePositions(storedPositions);
    };
  }, [history.action, routeKey]);

  return null;
}
