import { env } from "../config/env.js";
import { accidentRepository } from "./accidentRepository.js";

const buildGoogleMapsLink = (latitude, longitude) =>
  `https://maps.google.com/?q=${Number(latitude).toFixed(6)},${Number(longitude).toFixed(6)}`;

export const triggerEmergencyAlerts = async (accident) => {
  const latitude = Number(accident.latitude).toFixed(6);
  const longitude = Number(accident.longitude).toFixed(6);
  const mapLink = buildGoogleMapsLink(latitude, longitude);
  const message =
    `Level 3 accident detected for ${accident.device_id}.\n` +
    `Acc=${Number(accident.acceleration).toFixed(2)} m/s^2, ` +
    `Tilt=${Number(accident.tilt_angle ?? 0).toFixed(1)} deg, ` +
    `Speed=${Number(accident.speed ?? 0).toFixed(1)} km/h,\n` +
      `Lat=${latitude}, Lon=${longitude},\n` +
      `Map: ${mapLink}\n` +
      `Deploy Link: ${env.frontendUrl}`;

  const alert = await accidentRepository.createAlert({
    accident_id: accident.id,
    message,
    sent: true
  });

  return {
    alert,
    message,
    mapLink,
    triggeredAt: new Date().toISOString()
  };
};
