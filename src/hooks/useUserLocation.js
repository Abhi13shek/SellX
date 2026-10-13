import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Location states used as a discriminated union.
 *
 *   idle        — never requested
 *   requesting  — browser geolocation call in flight
 *   success     — coordinates obtained (kept only in memory)
 *   error       — permission denied, unavailable, timeout, or unsupported
 */
export const GEO_STATUS = Object.freeze({
  IDLE: "idle",
  REQUESTING: "requesting",
  SUCCESS: "success",
  ERROR: "error",
});

/**
 * Maps GeolocationPositionError codes to human-readable messages.
 * Codes are defined by the W3C Geolocation API specification:
 *   1 — PERMISSION_DENIED
 *   2 — POSITION_UNAVAILABLE
 *   3 — TIMEOUT
 */
function geoErrorMessage(error) {
  if (!error) return "An unknown location error occurred.";
  switch (error.code) {
    case 1:
      return "Location access was denied. You can select a city manually.";
    case 2:
      return "Your location is currently unavailable.";
    case 3:
      return "Location request timed out. Please try again.";
    default:
      return "Unable to retrieve your location.";
  }
}

/**
 * useUserLocation
 *
 * Provides a stable requestLocation callback that triggers the browser
 * Geolocation API. Coordinates are kept only in component memory and
 * are never persisted, logged, or transmitted.
 *
 * @returns {{
 *   status: string,           — one of GEO_STATUS
 *   coords: {lat, lng}|null, — only set when status === "success"
 *   errorMessage: string,    — human-readable error; empty when no error
 *   requestLocation: () => void,
 * }}
 */
export function useUserLocation() {
  const [status, setStatus] = useState(GEO_STATUS.IDLE);
  const [coords, setCoords] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Tracks whether the component is still mounted so that async callbacks
  // from in-flight geolocation requests do not update unmounted state.
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const requestLocation = useCallback(() => {
    // Do nothing if a request is already in flight.
    if (status === GEO_STATUS.REQUESTING) return;

    if (!navigator.geolocation) {
      setStatus(GEO_STATUS.ERROR);
      setErrorMessage("Your browser does not support geolocation.");
      return;
    }

    setStatus(GEO_STATUS.REQUESTING);
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mountedRef.current) return;
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus(GEO_STATUS.SUCCESS);
        setErrorMessage("");
      },
      (error) => {
        if (!mountedRef.current) return;
        setStatus(GEO_STATUS.ERROR);
        setErrorMessage(geoErrorMessage(error));
        // Coordinates from any previous successful request are cleared so the
        // component does not silently display stale location information.
        setCoords(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,       // 10 seconds before TIMEOUT error
        maximumAge: 300000,   // Accept a cached fix up to 5 minutes old
      }
    );
  }, [status]);

  return { status, coords, errorMessage, requestLocation };
}
