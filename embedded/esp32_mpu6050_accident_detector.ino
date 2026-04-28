#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <MPU6050.h>
#include <TinyGPS++.h>

// WiFi and backend settings
// You MUST update these before flashing.
// For local testing use the laptop LAN IP, not localhost.
// For online deployment use your public backend URL, for example:
// https://your-backend-domain/api
const char* WIFI_SSID = "ad";
const char* WIFI_PASSWORD = "ad123456";
const char* BACKEND_BASE_URL = "/api";
const double DEFAULT_LATITUDE = 12.870111834380207;
const double DEFAULT_LONGITUDE = 80.21845938650789;
const char* DEVICE_ID = "vehicle_01";

// Pin connections
const int SDA_PIN = 21;
const int SCL_PIN = 22;
const int GPS_RX_PIN = 16;   // GPS TX -> ESP32 RX
const int GPS_TX_PIN = 17;   // GPS RX -> ESP32 TX
const int BUZZER_PIN = 25;
const float GRAVITY_MS2 = 9.80665f;

// Accident threshold
const float MINOR_THRESHOLD = 6.0f;
const float MEDIUM_THRESHOLD = 10.0f;
const float SEVERE_THRESHOLD = 14.0f;
const float MINOR_TILT = 8.0f;
const float MEDIUM_TILT = 16.0f;
const float SEVERE_TILT = 26.0f;
const float MEDIUM_SPEED = 18.0f;
const float SEVERE_SPEED = 32.0f;
const unsigned long SEND_DELAY_MS = 5000;
const unsigned long HEARTBEAT_DELAY_MS = 15000;
const unsigned long LOCATION_DELAY_MS = 5000;
const unsigned long GPS_STALE_MS = 15000;
const int HTTP_TIMEOUT_MS = 5000;
const int HTTP_RETRY_ATTEMPTS = 3;

MPU6050 mpu;
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

// Forward declaration helps Arduino IDE auto-generated prototypes
// recognize the custom return type before function parsing.
struct MotionReading;

unsigned long lastSentTime = 0;
unsigned long lastHeartbeatTime = 0;
unsigned long lastLocationTime = 0;
float baselineTiltAngle = 0.0f;
bool lastGpsStatus = false;

bool containsPlaceholder(const char* value) {
  if (value == nullptr || value[0] == '\0') {
    return true;
  }

  String normalized = String(value);
  normalized.toUpperCase();
  return normalized.indexOf("YOUR") >= 0 || normalized.indexOf("192.168.1.100") >= 0;
}

bool validateRequiredConfig() {
  bool valid = true;

  if (containsPlaceholder(WIFI_SSID)) {
    Serial.println("CONFIG ERROR: WIFI_SSID must be updated before flashing");
    valid = false;
  }

  if (containsPlaceholder(WIFI_PASSWORD)) {
    Serial.println("CONFIG ERROR: WIFI_PASSWORD must be updated before flashing");
    valid = false;
  }

  if (containsPlaceholder(BACKEND_BASE_URL)) {
    Serial.println("CONFIG ERROR: BACKEND_BASE_URL must be updated before flashing");
    valid = false;
  }

  if (!valid) {
    Serial.println("Fix required config values and flash again.");
  }

  return valid;
}

String buildApiUrl(const char* path) {
  String url = String(BACKEND_BASE_URL);
  if (!url.endsWith("/")) {
    url += "/";
  }
  url += path;
  return url;
}

struct MotionReading {
  float acceleration;
  float tiltAngle;
};

float normalizeTiltDelta(float currentTilt, float baselineTilt) {
  float delta = fabs(currentTilt - baselineTilt);
  if (delta > 180.0f) {
    delta = 360.0f - delta;
  }
  return delta;
}

bool hasFreshGpsFix() {
  return gps.location.isValid() &&
    gps.location.age() < GPS_STALE_MS &&
    (!gps.satellites.isValid() || gps.satellites.value() >= 3);
}

bool shouldSend(unsigned long lastTime, unsigned long intervalMs) {
  return millis() - lastTime > intervalMs;
}

void feedGpsFor(unsigned long durationMs) {
  const unsigned long start = millis();
  while (millis() - start < durationMs) {
    while (gpsSerial.available()) {
      gps.encode(gpsSerial.read());
    }
    delay(2);
  }
}

void connectWiFi() {
  Serial.println("ESP32 booted");
  Serial.println("WiFi module starting...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    attempts++;
    if (attempts >= 40) {
      Serial.println("\nWiFi connection failed");
      Serial.println("Check WiFi name, password, router band, or signal strength");
      return;
    }
  }

  Serial.println("\nWiFi connected");
  Serial.println("ESP32 + WiFi started successfully");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("Backend base URL: ");
  Serial.println(BACKEND_BASE_URL);
}

void setupMPU6050() {
  Serial.println("MPU6050 setup starting...");
  Wire.begin(SDA_PIN, SCL_PIN);
  mpu.initialize();

  if (mpu.testConnection()) {
    Serial.println("MPU6050 connected");
    Serial.println("MPU6050 started successfully");
  } else {
    Serial.println("MPU6050 connection failed");
    Serial.println("Check MPU6050 wiring and power");
  }
}

void calibrateTiltBaseline() {
  const int sampleCount = 30;
  float totalTilt = 0.0f;

  Serial.println("Calibrating MPU6050 baseline tilt. Keep device steady...");
  for (int index = 0; index < sampleCount; index++) {
    MotionReading reading = readMotion();
    totalTilt += reading.tiltAngle;
    delay(50);
  }

  baselineTiltAngle = totalTilt / sampleCount;
  Serial.print("Baseline tilt angle: ");
  Serial.println(baselineTiltAngle, 2);
}

void setupGPS() {
  Serial.println("GPS setup starting...");
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  Serial.println("GPS started");
  Serial.println("If satellite count stays 0, check GPS wiring and move outdoors");
}

void readGPS() {
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }
}

MotionReading readMotion() {
  int16_t ax, ay, az;
  int16_t gx, gy, gz;

  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  float x = (ax / 16384.0f) * 9.80665f;
  float y = (ay / 16384.0f) * 9.80665f;
  float z = (az / 16384.0f) * 9.80665f;
  float magnitude = sqrt((x * x) + (y * y) + (z * z));
  float impact = fabs(magnitude - GRAVITY_MS2);
  float tilt = atan2(sqrt((x * x) + (y * y)), z) * 180.0f / PI;

  MotionReading reading;
  reading.acceleration = impact;
  reading.tiltAngle = tilt;
  return reading;
}

const char* classifySeverity(float acceleration, float tiltAngle, float speedKmph) {
  const float tiltDelta = normalizeTiltDelta(tiltAngle, baselineTiltAngle);
  const bool hasMinorImpact = acceleration >= 2.0f;
  const bool hasModerateImpact = acceleration >= 5.0f;

  if (acceleration >= SEVERE_THRESHOLD ||
      speedKmph >= SEVERE_SPEED ||
      (tiltDelta >= SEVERE_TILT && acceleration >= MINOR_THRESHOLD)) {
    return "SEVERE";
  }

  if (acceleration >= MEDIUM_THRESHOLD ||
      speedKmph >= MEDIUM_SPEED ||
      (tiltDelta >= MEDIUM_TILT && hasModerateImpact)) {
    return "MEDIUM";
  }

  if (acceleration >= MINOR_THRESHOLD ||
      (tiltDelta >= MINOR_TILT && hasMinorImpact)) {
    return "MINOR";
  }

  return "NONE";
}

void beepBuzzer() {
  digitalWrite(BUZZER_PIN, HIGH);
  feedGpsFor(3000);
  digitalWrite(BUZZER_PIN, LOW);
}

int postJsonWithRetry(const String& url, const String& payload) {
  int httpCode = -1;

  for (int attempt = 1; attempt <= HTTP_RETRY_ATTEMPTS; attempt++) {
    HTTPClient http;
    WiFiClientSecure secureClient;
    http.setTimeout(HTTP_TIMEOUT_MS);
    if (url.startsWith("https://")) {
      secureClient.setInsecure();
      http.begin(secureClient, url);
    } else {
      http.begin(url);
    }
    http.addHeader("Content-Type", "application/json");

    Serial.print("HTTP POST Attempt ");
    Serial.print(attempt);
    Serial.print(" -> ");
    Serial.println(url);
    Serial.println(payload);

    httpCode = http.POST(payload);
    String responseBody = http.getString();

    Serial.print("HTTP Response: ");
    Serial.println(httpCode);
    if (responseBody.length() > 0) {
      Serial.println(responseBody);
    }

    http.end();

    if (httpCode != -1) {
      return httpCode;
    }

    Serial.println("HTTP failed with -1, retrying...");
    feedGpsFor(300);
  }

  Serial.println("HTTP request failed after all retries");
  Serial.println("Check backend IP, backend server, same WiFi network, and firewall");
  return httpCode;
}

void sendAccident(float acceleration, float tiltAngle, float speedKmph, double latitude, double longitude, const char* severity) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, cannot send data");
    return;
  }

  String accidentUrl = buildApiUrl("accident-data");

  String payload = "{";
  payload += "\"device_id\":\"" + String(DEVICE_ID) + "\",";
  payload += "\"acceleration\":" + String(acceleration, 2) + ",";
  payload += "\"tilt_angle\":" + String(tiltAngle, 2) + ",";
  payload += "\"speed\":" + String(speedKmph, 2) + ",";
  if (hasFreshGpsFix()) {
    payload += "\"latitude\":" + String(latitude, 6) + ",";
    payload += "\"longitude\":" + String(longitude, 6) + ",";
  } else {
    payload += "\"latitude\":" + String(DEFAULT_LATITUDE, 6) + ",";
    payload += "\"longitude\":" + String(DEFAULT_LONGITUDE, 6) + ",";
  }
  payload += "\"severity\":\"" + String(severity) + "\"";
  payload += "}";

  Serial.print("Accident POST -> ");
  Serial.println(accidentUrl);
  postJsonWithRetry(accidentUrl, payload);
}

void sendLocation(double latitude, double longitude) {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  String locationUrl = buildApiUrl("device-location");

  String payload = "{";
  payload += "\"device_id\":\"" + String(DEVICE_ID) + "\",";
  payload += "\"latitude\":" + String(latitude, 6) + ",";
  payload += "\"longitude\":" + String(longitude, 6);
  payload += "}";

  Serial.print("Location POST -> ");
  Serial.println(locationUrl);
  postJsonWithRetry(locationUrl, payload);
}

void sendHeartbeat() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  String heartbeatUrl = buildApiUrl("device-heartbeat");

  String payload = "{";
  payload += "\"device_id\":\"" + String(DEVICE_ID) + "\"";
  payload += "}";

  Serial.print("Heartbeat POST -> ");
  Serial.println(heartbeatUrl);
  postJsonWithRetry(heartbeatUrl, payload);
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  Serial.println("Smart Accident Detection System booting...");

  if (!validateRequiredConfig()) {
    while (true) {
      delay(1000);
    }
  }

  connectWiFi();
  setupMPU6050();
  calibrateTiltBaseline();
  setupGPS();
  sendHeartbeat();
  lastHeartbeatTime = millis();
  Serial.println("All startup modules initialized");
}

void loop() {
  readGPS();

  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  MotionReading motion = readMotion();
  float acceleration = motion.acceleration;
  float tiltAngle = motion.tiltAngle;
  float tiltDelta = normalizeTiltDelta(tiltAngle, baselineTiltAngle);
  float speedKmph = gps.speed.isValid() ? gps.speed.kmph() : 0.0f;
  const char* severity = classifySeverity(acceleration, tiltAngle, speedKmph);
  const bool gpsValid = hasFreshGpsFix();

  if (gpsValid != lastGpsStatus) {
    if (gpsValid) {
      Serial.println("GPS STATUS: LOCKED");
    } else {
      Serial.println("GPS STATUS: SEARCHING");
    }
    lastGpsStatus = gpsValid;
  }

  double latitude = 0.0;
  double longitude = 0.0;
  if (gpsValid) {
    latitude = gps.location.lat();
    longitude = gps.location.lng();
  }

  Serial.print("Acceleration: ");
  Serial.print(acceleration);
  Serial.print(" m/s^2 | Tilt: ");
  Serial.print(tiltAngle);
  Serial.print(" deg | TiltDelta: ");
  Serial.print(tiltDelta);
  Serial.print(" deg | Speed: ");
  Serial.print(speedKmph);
  Serial.print(" km/h | Severity: ");
  Serial.print(severity);
  Serial.print(" | Sats: ");
  Serial.print(gps.satellites.isValid() ? gps.satellites.value() : 0);
  Serial.print(" | Lat: ");
  Serial.print(latitude, 6);
  Serial.print(" | Lon: ");
  Serial.println(longitude, 6);

  if (gpsValid && shouldSend(lastLocationTime, LOCATION_DELAY_MS)) {
    sendLocation(latitude, longitude);
    lastLocationTime = millis();
  }

  if (shouldSend(lastHeartbeatTime, HEARTBEAT_DELAY_MS)) {
    sendHeartbeat();
    lastHeartbeatTime = millis();
  }

  if (strcmp(severity, "NONE") != 0 && shouldSend(lastSentTime, SEND_DELAY_MS)) {
    Serial.print(severity);
    Serial.println(" accident detected");
    if (strcmp(severity, "SEVERE") == 0) {
      beepBuzzer();
    }
    if (!gpsValid) {
      Serial.println("GPS not locked, using default coordinates for accident reporting");
    }
    sendAccident(acceleration, tiltAngle, speedKmph, latitude, longitude, severity);
    lastSentTime = millis();
  }

  feedGpsFor(500);
}
