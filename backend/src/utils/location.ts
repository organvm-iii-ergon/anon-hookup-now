/**
 * Location utilities for privacy-preserving geospatial queries
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Add random jitter to coordinates for privacy
 * Jitter is added in meters
 */
export function jitterLocation(
  latitude: number,
  longitude: number,
  jitterMeters: number = 100
): { latitude: number; longitude: number } {
  // Convert meters to degrees (approximate)
  const jitterDegrees = jitterMeters / 111320; // 1 degree latitude ≈ 111.32 km

  const randomAngle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * jitterDegrees;

  return {
    latitude: latitude + randomDistance * Math.cos(randomAngle),
    longitude: longitude + randomDistance * Math.sin(randomAngle),
  };
}

/**
 * Round distance to nearest interval for privacy
 */
export function roundDistance(distance: number): number {
  if (distance < 0.1) return 0.1; // < 100m
  if (distance < 1) return Math.round(distance * 10) / 10; // Round to 100m
  if (distance < 10) return Math.round(distance); // Round to 1km
  if (distance < 50) return Math.round(distance / 5) * 5; // Round to 5km
  return Math.round(distance / 10) * 10; // Round to 10km
}

/**
 * Get bounding box for a given point and radius
 */
export function getBoundingBox(
  latitude: number,
  longitude: number,
  radiusKm: number
): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} {
  const latDelta = radiusKm / 111.32;
  const lonDelta = radiusKm / (111.32 * Math.cos(toRadians(latitude)));

  return {
    minLat: latitude - latDelta,
    maxLat: latitude + latDelta,
    minLon: longitude - lonDelta,
    maxLon: longitude + lonDelta,
  };
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Validate coordinates
 */
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}
