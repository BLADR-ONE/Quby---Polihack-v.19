#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include "app_config.h"

namespace {
constexpr uint8_t SDA_PIN = 8;
constexpr uint8_t SCL_PIN = 9;
constexpr uint8_t BUTTON_PIN = 1;
constexpr uint8_t BUZZER_PIN = 0;
constexpr uint8_t RED_PIN = 10;
constexpr uint8_t GREEN_PIN = 6;
constexpr uint8_t BLUE_PIN = 3;
constexpr uint8_t MQ135_PIN = 4;
constexpr uint8_t MQ2_PIN = 5;
constexpr uint8_t DHT_PIN = 2;
constexpr uint8_t DHT_TYPE = DHT22;
constexpr uint8_t ADXL345_ADDR = 0x53;
constexpr uint8_t ADXL345_REG_POWER_CTL = 0x2D;
constexpr uint8_t ADXL345_REG_DATA_FORMAT = 0x31;
constexpr uint8_t ADXL345_REG_DATAX0 = 0x32;

constexpr uint8_t SCREEN_WIDTH = 128;
constexpr uint8_t SCREEN_HEIGHT = 64;
constexpr int8_t OLED_RESET = -1;
constexpr uint8_t OLED_ADDR = 0x3C;

constexpr unsigned long LONG_PRESS_MS = 5000;
constexpr unsigned long MODE_SPLASH_MS = 1000;
constexpr unsigned long SENSOR_READ_MS = 1000;
constexpr unsigned long DHT_READ_MS = 2000;
constexpr unsigned long WARMUP_MS = 20000;
constexpr unsigned long BLINK_INTERVAL_MS = 4500;
constexpr unsigned long BLINK_DURATION_MS = 120;
constexpr unsigned long SHORT_PRESS_MAX_MS = 800;
constexpr unsigned long MULTI_PRESS_GAP_MS = 450;
constexpr unsigned long WIFI_RECONNECT_MS = 15000;
constexpr unsigned long WIFI_SCAN_MS = 30000;
constexpr unsigned long DOCKED_UPLOAD_MS = 240000;
constexpr unsigned long UNDOCKED_UPLOAD_MS = 900000;
constexpr unsigned long DOCKED_UPLOAD_RETRY_MS = 10000;
constexpr unsigned long SHAKE_READ_MS = 120;
constexpr unsigned long SHAKE_SOUND_COOLDOWN_MS = 2500;
constexpr unsigned long DEMO_STEP_MS = 1800;

constexpr float AIR_HAPPY_MAX = 1.20f;
constexpr float AIR_NEUTRAL_MAX = 1.65f;
constexpr float SHAKE_DELTA_THRESHOLD_G = 0.55f;

constexpr int EYE_Y = 30;
constexpr int LEFT_EYE_X = 42;
constexpr int RIGHT_EYE_X = 86;
constexpr int NEUTRAL_LEFT_X = 36;
constexpr int NEUTRAL_RIGHT_X = 92;

enum Mode : uint8_t {
  MODE_DOCKED,
  MODE_UNDOCKED
};

enum Mood : uint8_t {
  MOOD_HAPPY,
  MOOD_NEUTRAL,
  MOOD_MAD
};

enum DockedScreen : uint8_t {
  SCREEN_FACE,
  SCREEN_MQ135,
  SCREEN_MQ2,
  SCREEN_DHT,
  SCREEN_WIFI,
  SCREEN_ACCEL
};

struct SensorSnapshot {
  unsigned long timestampMs;
  int mq135Raw;
  float mq135Baseline;
  float mq135Index;
  bool mq2Detected;
  float temperatureC;
  float humidityPct;
  float accelXg;
  float accelYg;
  float accelZg;
  bool shakeDetected;
  Mode mode;
  Mood mood;
};

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
DHT dht(DHT_PIN, DHT_TYPE);

Mode currentMode = MODE_DOCKED;
Mood currentMood = MOOD_NEUTRAL;
Mood sensedMood = MOOD_NEUTRAL;
DockedScreen currentDockedScreen = SCREEN_FACE;
Mood lastRenderedMood = static_cast<Mood>(255);
bool lastRenderedBlinkState = false;
Mode lastRenderedMode = static_cast<Mode>(255);
DockedScreen lastRenderedDockedScreen = static_cast<DockedScreen>(255);

bool lastButtonPressed = false;
bool longPressHandled = false;
bool blinkActive = false;
bool infoScreenDirty = true;
bool wifiConfigured = false;
bool wifiConnectAttempted = false;
bool snapshotReady = false;
bool wifiScanRequested = false;
bool hasUploadedSuccessfully = false;
bool accelerometerReady = false;
bool shakeDetected = false;
bool demoModeEnabled = false;
wl_status_t lastWifiStatus = WL_IDLE_STATUS;

unsigned long pressStartMs = 0;
unsigned long bootMs = 0;
unsigned long splashUntilMs = 0;
unsigned long lastSensorReadMs = 0;
unsigned long lastDhtReadMs = 0;
unsigned long nextBlinkMs = 0;
unsigned long blinkUntilMs = 0;
unsigned long lastWifiAttemptMs = 0;
unsigned long lastUploadMs = 0;
unsigned long lastUploadAttemptMs = 0;
unsigned long lastWifiScanMs = 0;
unsigned long lastShakeReadMs = 0;
unsigned long lastShakeSoundMs = 0;
unsigned long lastShortPressMs = 0;
unsigned long lastDemoStepMs = 0;

int mq135Raw = 0;
float mq135Baseline = 1.0f;
float mq135Index = 1.0f;
bool mq2Detected = false;
float dhtTemperatureC = NAN;
float dhtHumidity = NAN;
float accelXg = 0.0f;
float accelYg = 0.0f;
float accelZg = 1.0f;
float accelLastMagnitude = 1.0f;
float accelShakeDelta = 0.0f;
int wifiScanCount = -1;
uint8_t pendingShortPressCount = 0;
uint8_t demoMoodIndex = 1;
String wifiTopSsid1;
String wifiTopSsid2;
String wifiTopSsid3;
SensorSnapshot latestSnapshot{};

void setColor(uint8_t red, uint8_t green, uint8_t blue) {
  analogWrite(RED_PIN, red);
  analogWrite(GREEN_PIN, green);
  analogWrite(BLUE_PIN, blue);
}

void applyMoodColor(Mood mood) {
  switch (mood) {
    case MOOD_HAPPY:
      setColor(0, 255, 0);
      break;
    case MOOD_NEUTRAL:
      setColor(0, 0, 255);
      break;
    case MOOD_MAD:
      setColor(255, 0, 0);
      break;
  }
}

void playToneBlocking(unsigned int frequency, unsigned long durationMs) {
  tone(BUZZER_PIN, frequency);
  delay(durationMs);
  noTone(BUZZER_PIN);
}

void playHappySound() {
  playToneBlocking(660, 100);
  delay(40);
  playToneBlocking(880, 100);
  delay(40);
  playToneBlocking(1046, 150);
  delay(60);
  playToneBlocking(1320, 180);
}

void playNeutralSound() {
  playToneBlocking(700, 120);
  delay(80);
  playToneBlocking(700, 120);
}

void playSadSound() {
  playToneBlocking(600, 180);
  delay(70);
  playToneBlocking(440, 220);
  delay(70);
  playToneBlocking(330, 300);
}

void playMoodSound(Mood mood) {
  switch (mood) {
    case MOOD_HAPPY:
      playHappySound();
      break;
    case MOOD_NEUTRAL:
      playNeutralSound();
      break;
    case MOOD_MAD:
      playSadSound();
      break;
  }
}

Mood nextDemoMood() {
  demoMoodIndex = (demoMoodIndex + 1) % 3;
  switch (demoMoodIndex) {
    case 0:
      return MOOD_HAPPY;
    case 1:
      return MOOD_NEUTRAL;
    default:
      return MOOD_MAD;
  }
}

void setCurrentMood(Mood newMood, bool playSound) {
  if (currentMood == newMood) {
    return;
  }

  currentMood = newMood;
  infoScreenDirty = true;
  if (playSound) {
    playMoodSound(newMood);
  }
}

void drawTriangleEye(int cx, int cy, bool inverted) {
  if (inverted) {
    display.fillTriangle(cx - 15, cy - 12, cx + 15, cy - 12, cx, cy + 14, SSD1306_WHITE);
  } else {
    display.fillTriangle(cx, cy - 14, cx - 15, cy + 12, cx + 15, cy + 12, SSD1306_WHITE);
  }
}

void drawNeutralEye(int cx, int cy) {
  display.fillRoundRect(cx - 20, cy - 7, 40, 14, 4, SSD1306_WHITE);
}

void drawClosedEye(int cx, int cy) {
  display.drawLine(cx - 16, cy, cx + 16, cy, SSD1306_WHITE);
  display.drawLine(cx - 16, cy + 1, cx + 16, cy + 1, SSD1306_WHITE);
}

void drawMoodFace(Mood mood, bool closedEyes) {
  display.clearDisplay();

  if (closedEyes) {
    drawClosedEye(LEFT_EYE_X, EYE_Y);
    drawClosedEye(RIGHT_EYE_X, EYE_Y);
  } else {
    switch (mood) {
      case MOOD_HAPPY:
        drawTriangleEye(LEFT_EYE_X, EYE_Y, false);
        drawTriangleEye(RIGHT_EYE_X, EYE_Y, false);
        break;
      case MOOD_NEUTRAL:
        drawNeutralEye(NEUTRAL_LEFT_X, EYE_Y);
        drawNeutralEye(NEUTRAL_RIGHT_X, EYE_Y);
        break;
      case MOOD_MAD:
        drawTriangleEye(LEFT_EYE_X, EYE_Y, true);
        drawTriangleEye(RIGHT_EYE_X, EYE_Y, true);
        break;
    }
  }

  display.display();
}

void drawModeSplash(char letter) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(5);
  display.setCursor(48, 12);
  display.write(letter);
  display.display();
}

const __FlashStringHelper* moodLabel(Mood mood) {
  switch (mood) {
    case MOOD_HAPPY:
      return F("HAPPY");
    case MOOD_NEUTRAL:
      return F("NEUTRAL");
    case MOOD_MAD:
      return F("MAD");
  }
  return F("UNKNOWN");
}

const __FlashStringHelper* wifiStatusLabel() {
  if (!wifiConfigured) {
    return F("OFF");
  }
  return WiFi.status() == WL_CONNECTED ? F("OK") : F("WAIT");
}

const __FlashStringHelper* wifiStatusDetail(wl_status_t status) {
  switch (status) {
    case WL_CONNECTED:
      return F("CONNECTED");
    case WL_NO_SSID_AVAIL:
      return F("NO SSID");
    case WL_CONNECT_FAILED:
      return F("BAD PASS");
    case WL_CONNECTION_LOST:
      return F("LOST");
    case WL_DISCONNECTED:
      return F("DISCONNECTED");
    case WL_IDLE_STATUS:
      return F("IDLE");
    default:
      return F("UNKNOWN");
  }
}

void drawInfoHeader(const __FlashStringHelper* title) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println(title);
  display.drawLine(0, 10, SCREEN_WIDTH - 1, 10, SSD1306_WHITE);
}

void drawUndockedScreen() {
  drawMoodFace(currentMood, blinkActive);
}

void drawMq135Screen() {
  drawInfoHeader(F("MQ135 Air Quality"));

  display.setCursor(0, 16);
  display.print(F("Raw: "));
  display.println(mq135Raw);

  display.setCursor(0, 28);
  display.print(F("Base: "));
  display.println(mq135Baseline, 0);

  display.setCursor(0, 40);
  display.print(F("Index: "));
  display.println(mq135Index, 2);

  display.setCursor(0, 52);
  display.print(F("Mood: "));
  display.print(moodLabel(currentMood));
  display.print(F(" W:"));
  display.println(wifiStatusLabel());
  display.display();
}

void drawMq2Screen() {
  drawInfoHeader(F("MQ2 Gas Detector"));

  display.setCursor(0, 18);
  display.setTextSize(2);
  display.print(F("Gas: "));
  display.println(mq2Detected ? F("YES") : F("NO"));

  display.setTextSize(1);
  display.setCursor(0, 46);
  display.print(F("Digital: "));
  display.println(mq2Detected ? F("HIGH") : F("LOW"));

  display.setCursor(0, 56);
  display.print(F("WiFi: "));
  display.println(wifiStatusLabel());
  display.display();
}

void drawDhtScreen() {
  drawInfoHeader(F("DHT22 Climate"));

  display.setCursor(0, 18);
  if (isnan(dhtTemperatureC) || isnan(dhtHumidity)) {
    display.println(F("Reading sensor..."));
  } else {
    display.print(F("Temp: "));
    display.print(dhtTemperatureC, 1);
    display.println(F(" C"));

    display.setCursor(0, 32);
    display.print(F("Hum:  "));
    display.print(dhtHumidity, 1);
    display.println(F(" %"));

    display.setCursor(0, 48);
    display.print(F("WiFi: "));
    display.println(wifiStatusLabel());
  }
  display.display();
}

void drawWifiScreen() {
  drawInfoHeader(F("WiFi Status"));

  const wl_status_t status = WiFi.status();
  display.setCursor(0, 16);
  display.print(F("State: "));
  display.println(wifiStatusDetail(status));

  display.setCursor(0, 28);
  display.print(F("SSID: "));
  if (wifiConfigured) {
    display.println(AppConfig::WIFI_SSID);
  } else {
    display.println(F("not set"));
  }

  display.setCursor(0, 40);
  if (status == WL_CONNECTED) {
    display.print(F("IP: "));
    display.println(WiFi.localIP());
  } else if (wifiScanCount >= 0) {
    display.print(F("Seen: "));
    display.println(wifiScanCount);
  } else {
    display.println(F("Seen: scan..."));
  }

  display.setCursor(0, 52);
  if (wifiScanCount > 0 && wifiTopSsid1.length() > 0) {
    display.println(wifiTopSsid1);
  } else {
    display.print(F("API: "));
    display.println(AppConfig::API_URL[0] == '\0' ? F("not set") : F("ready"));
  }

  display.display();
}

void drawAccelScreen() {
  drawInfoHeader(F("ADXL345 Motion"));

  if (!accelerometerReady) {
    display.setCursor(0, 20);
    display.println(F("Accel not found"));
    display.setCursor(0, 36);
    display.println(F("Check SDA/SCL/VCC"));
    display.display();
    return;
  }

  display.setCursor(0, 16);
  display.print(F("X: "));
  display.println(accelXg, 2);

  display.setCursor(0, 28);
  display.print(F("Y: "));
  display.println(accelYg, 2);

  display.setCursor(0, 40);
  display.print(F("Z: "));
  display.println(accelZg, 2);

  display.setCursor(0, 52);
  display.print(F("Shake: "));
  display.print(shakeDetected ? F("YES ") : F("NO  "));
  display.print(F("M:"));
  display.println(moodLabel(currentMood));
  display.display();
}

int readMqAverage() {
  uint32_t total = 0;
  for (uint8_t i = 0; i < 8; ++i) {
    total += analogRead(MQ135_PIN);
    delay(2);
  }
  return static_cast<int>(total / 8);
}

void readMQ135() {
  mq135Raw = readMqAverage();

  if ((millis() - bootMs) < WARMUP_MS) {
    mq135Baseline = (mq135Baseline * 0.9f) + (static_cast<float>(mq135Raw) * 0.1f);
  }

  if (mq135Baseline < 1.0f) {
    mq135Baseline = 1.0f;
  }

  mq135Index = static_cast<float>(mq135Raw) / mq135Baseline;
}

void readMQ2() {
  mq2Detected = digitalRead(MQ2_PIN) == HIGH;
}

void readDHT() {
  const unsigned long now = millis();
  if ((now - lastDhtReadMs) < DHT_READ_MS) {
    return;
  }

  lastDhtReadMs = now;

  const float newHumidity = dht.readHumidity();
  const float newTemperatureC = dht.readTemperature();

  if (!isnan(newHumidity)) {
    dhtHumidity = newHumidity;
  }
  if (!isnan(newTemperatureC)) {
    dhtTemperatureC = newTemperatureC;
  }
}

bool writeAccelRegister(uint8_t reg, uint8_t value) {
  Wire.beginTransmission(ADXL345_ADDR);
  Wire.write(reg);
  Wire.write(value);
  return Wire.endTransmission() == 0;
}

bool initAccelerometer() {
  if (!writeAccelRegister(ADXL345_REG_POWER_CTL, 0x00)) {
    return false;
  }
  if (!writeAccelRegister(ADXL345_REG_DATA_FORMAT, 0x08)) {
    return false;
  }
  if (!writeAccelRegister(ADXL345_REG_POWER_CTL, 0x08)) {
    return false;
  }
  return true;
}

bool readAccelerometerRaw(int16_t& x, int16_t& y, int16_t& z) {
  Wire.beginTransmission(ADXL345_ADDR);
  Wire.write(ADXL345_REG_DATAX0);
  if (Wire.endTransmission(false) != 0) {
    return false;
  }

  const uint8_t bytesRequested = 6;
  const uint8_t bytesRead = Wire.requestFrom(ADXL345_ADDR, bytesRequested);
  if (bytesRead != bytesRequested) {
    return false;
  }

  x = static_cast<int16_t>(Wire.read() | (Wire.read() << 8));
  y = static_cast<int16_t>(Wire.read() | (Wire.read() << 8));
  z = static_cast<int16_t>(Wire.read() | (Wire.read() << 8));
  return true;
}

void updateAccelerometer() {
  if (!accelerometerReady) {
    shakeDetected = false;
    return;
  }

  const unsigned long now = millis();
  if ((now - lastShakeReadMs) < SHAKE_READ_MS) {
    return;
  }
  lastShakeReadMs = now;

  int16_t rawX = 0;
  int16_t rawY = 0;
  int16_t rawZ = 0;
  if (!readAccelerometerRaw(rawX, rawY, rawZ)) {
    accelerometerReady = false;
    shakeDetected = false;
    Serial.println(F("ADXL345 read failed"));
    return;
  }

  accelXg = rawX * 0.0039f;
  accelYg = rawY * 0.0039f;
  accelZg = rawZ * 0.0039f;

  const float magnitude = sqrtf((accelXg * accelXg) + (accelYg * accelYg) + (accelZg * accelZg));
  accelShakeDelta = fabsf(magnitude - accelLastMagnitude);
  accelLastMagnitude = magnitude;

  shakeDetected = accelShakeDelta >= SHAKE_DELTA_THRESHOLD_G;
}

void buildSnapshot() {
  latestSnapshot.timestampMs = millis();
  latestSnapshot.mq135Raw = mq135Raw;
  latestSnapshot.mq135Baseline = mq135Baseline;
  latestSnapshot.mq135Index = mq135Index;
  latestSnapshot.mq2Detected = mq2Detected;
  latestSnapshot.temperatureC = dhtTemperatureC;
  latestSnapshot.humidityPct = dhtHumidity;
  latestSnapshot.accelXg = accelXg;
  latestSnapshot.accelYg = accelYg;
  latestSnapshot.accelZg = accelZg;
  latestSnapshot.shakeDetected = shakeDetected;
  latestSnapshot.mode = currentMode;
  latestSnapshot.mood = sensedMood;
  snapshotReady = true;
}

Mood evaluateDockedMood() {
  if ((millis() - bootMs) < WARMUP_MS) {
    return MOOD_NEUTRAL;
  }
  if (mq135Index <= AIR_HAPPY_MAX) {
    return MOOD_HAPPY;
  }
  if (mq135Index <= AIR_NEUTRAL_MAX) {
    return MOOD_NEUTRAL;
  }
  return MOOD_MAD;
}

void printMqDebug() {
  Serial.print(F("Mode: "));
  Serial.print(currentMode == MODE_DOCKED ? F("Docked") : F("Undocked"));
  Serial.print(F(" | MQ135 raw: "));
  Serial.print(mq135Raw);
  Serial.print(F(" | baseline: "));
  Serial.print(mq135Baseline, 1);
  Serial.print(F(" | index: "));
  Serial.print(mq135Index, 2);
  Serial.print(F(" | mood: "));
  Serial.print(moodLabel(currentMood));
  if (demoModeEnabled) {
    Serial.print(F(" (demo)"));
  }
  Serial.print(F(" | MQ2: "));
  Serial.print(mq2Detected ? F("HIGH") : F("LOW"));
  Serial.print(F(" | Temp: "));
  if (isnan(dhtTemperatureC)) {
    Serial.print(F("nan"));
  } else {
    Serial.print(dhtTemperatureC, 1);
  }
  Serial.print(F(" | Hum: "));
  if (isnan(dhtHumidity)) {
    Serial.print(F("nan"));
  } else {
    Serial.print(dhtHumidity, 1);
  }
  Serial.print(F(" | Accel: "));
  if (!accelerometerReady) {
    Serial.print(F("offline"));
  } else {
    Serial.print(accelXg, 2);
    Serial.print(',');
    Serial.print(accelYg, 2);
    Serial.print(',');
    Serial.print(accelZg, 2);
    Serial.print(F(" | shake: "));
    Serial.print(shakeDetected ? F("YES") : F("NO"));
  }
  Serial.println();
}

void printWifiScanResults() {
  Serial.print(F("WiFi scan found: "));
  Serial.println(wifiScanCount);

  if (wifiTopSsid1.length() > 0) {
    Serial.print(F("SSID 1: "));
    Serial.println(wifiTopSsid1);
  }
  if (wifiTopSsid2.length() > 0) {
    Serial.print(F("SSID 2: "));
    Serial.println(wifiTopSsid2);
  }
  if (wifiTopSsid3.length() > 0) {
    Serial.print(F("SSID 3: "));
    Serial.println(wifiTopSsid3);
  }
}

void updateWifiStatus() {
  const wl_status_t status = WiFi.status();
  if (status == lastWifiStatus) {
    return;
  }

  lastWifiStatus = status;
  infoScreenDirty = true;
  Serial.print(F("WiFi status: "));
  Serial.println(wifiStatusDetail(status));

  if (status == WL_CONNECTED) {
    Serial.print(F("WiFi IP: "));
    Serial.println(WiFi.localIP());
  }
}

void startWifiConnection() {
  if (!wifiConfigured) {
    return;
  }

  WiFi.disconnect();
  delay(50);
  WiFi.begin(AppConfig::WIFI_SSID, AppConfig::WIFI_PASSWORD);
  wifiConnectAttempted = true;
  lastWifiAttemptMs = millis();

  Serial.print(F("Connecting WiFi to SSID: "));
  Serial.println(AppConfig::WIFI_SSID);
}

void triggerWifiScan() {
  if (WiFi.scanComplete() == WIFI_SCAN_RUNNING) {
    return;
  }

  WiFi.scanDelete();
  WiFi.scanNetworks(true, true);
  wifiScanRequested = true;
  lastWifiScanMs = millis();
}

void updateWifiScanResults() {
  const int scanState = WiFi.scanComplete();
  if (scanState == WIFI_SCAN_RUNNING) {
    return;
  }

  if (scanState >= 0) {
    wifiScanCount = scanState;
    wifiTopSsid1 = wifiScanCount > 0 ? WiFi.SSID(0) : "";
    wifiTopSsid2 = wifiScanCount > 1 ? WiFi.SSID(1) : "";
    wifiTopSsid3 = wifiScanCount > 2 ? WiFi.SSID(2) : "";
    WiFi.scanDelete();
    wifiScanRequested = false;
    infoScreenDirty = true;
    printWifiScanResults();
    return;
  }

  if (!wifiScanRequested || (millis() - lastWifiScanMs) >= WIFI_SCAN_MS) {
    triggerWifiScan();
  }
}

void ensureWifiConnected() {
  if (!wifiConfigured) {
    return;
  }

  updateWifiStatus();
  updateWifiScanResults();

  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  const unsigned long now = millis();
  if (!wifiConnectAttempted || (now - lastWifiAttemptMs) >= WIFI_RECONNECT_MS) {
    startWifiConnection();
  }
}

void postDockedSnapshot() {
  if (!snapshotReady || !wifiConfigured) {
    return;
  }
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  if (AppConfig::API_URL[0] == '\0') {
    return;
  }

  const unsigned long now = millis();
  const unsigned long steadyInterval = currentMode == MODE_DOCKED ? DOCKED_UPLOAD_MS : UNDOCKED_UPLOAD_MS;
  const unsigned long uploadInterval = hasUploadedSuccessfully ? steadyInterval : DOCKED_UPLOAD_RETRY_MS;
  if (lastUploadAttemptMs != 0 && (now - lastUploadAttemptMs) < uploadInterval) {
    return;
  }
  lastUploadAttemptMs = now;

  HTTPClient http;
  http.begin(AppConfig::API_URL);
  http.setConnectTimeout(5000);
  http.setTimeout(5000);
  http.addHeader("Content-Type", "application/json");

  String payload;
  payload.reserve(256);
  payload += F("{\"device_id\":\"");
  payload += AppConfig::API_DEVICE_ID;
  payload += F("\",\"timestamp_ms\":");
  payload += latestSnapshot.timestampMs;
  payload += F(",\"mode\":\"");
  payload += (latestSnapshot.mode == MODE_DOCKED ? F("docked") : F("undocked"));
  payload += F("\",\"mood\":\"");
  payload += moodLabel(latestSnapshot.mood);
  payload += F("\",\"mq135_raw\":");
  payload += latestSnapshot.mq135Raw;
  payload += F(",\"mq135_baseline\":");
  payload += String(latestSnapshot.mq135Baseline, 2);
  payload += F(",\"mq135_index\":");
  payload += String(latestSnapshot.mq135Index, 3);
  payload += F(",\"mq2_detected\":");
  payload += (latestSnapshot.mq2Detected ? F("true") : F("false"));
  payload += F(",\"temperature_c\":");
  payload += isnan(latestSnapshot.temperatureC) ? F("null") : String(latestSnapshot.temperatureC, 1);
  payload += F(",\"humidity_pct\":");
  payload += isnan(latestSnapshot.humidityPct) ? F("null") : String(latestSnapshot.humidityPct, 1);
  payload += F(",\"accel_x_g\":");
  payload += String(latestSnapshot.accelXg, 3);
  payload += F(",\"accel_y_g\":");
  payload += String(latestSnapshot.accelYg, 3);
  payload += F(",\"accel_z_g\":");
  payload += String(latestSnapshot.accelZg, 3);
  payload += F(",\"shake_detected\":");
  payload += (latestSnapshot.shakeDetected ? F("true") : F("false"));
  payload += '}';

  Serial.print(F("Uploading to: "));
  Serial.println(AppConfig::API_URL);
  Serial.print(F("Upload payload: "));
  Serial.println(payload);

  const int httpCode = http.POST(payload);
  Serial.print(F("Upload result: "));
  Serial.println(httpCode);

  if (httpCode > 0) {
    Serial.print(F("Upload response: "));
    Serial.println(http.getString());
  } else {
    Serial.print(F("Upload error: "));
    Serial.println(http.errorToString(httpCode));
  }

  http.end();

  if (httpCode > 0) {
    hasUploadedSuccessfully = true;
    lastUploadMs = now;
  }
}

void enterMode(Mode mode) {
  currentMode = mode;
  splashUntilMs = millis() + MODE_SPLASH_MS;
  infoScreenDirty = true;
  drawModeSplash(mode == MODE_DOCKED ? 'D' : 'U');

  if (!demoModeEnabled) {
    setCurrentMood(sensedMood, false);
  }
  applyMoodColor(currentMood);

  Serial.print(F("Mode changed to: "));
  Serial.println(mode == MODE_DOCKED ? F("Docked") : F("Undocked"));
}

void updateModeButton() {
  const unsigned long now = millis();
  const bool buttonPressed = digitalRead(BUTTON_PIN) == LOW;

  if (buttonPressed && !lastButtonPressed) {
    pressStartMs = now;
    longPressHandled = false;
  } else if (!buttonPressed && lastButtonPressed) {
    const unsigned long pressDuration = now - pressStartMs;
    if (!longPressHandled && pressDuration <= SHORT_PRESS_MAX_MS) {
      ++pendingShortPressCount;
      lastShortPressMs = now;
    }
    longPressHandled = false;
  }

  if (buttonPressed && !longPressHandled && (now - pressStartMs) >= LONG_PRESS_MS) {
    enterMode(currentMode == MODE_DOCKED ? MODE_UNDOCKED : MODE_DOCKED);
    longPressHandled = true;
  }

  lastButtonPressed = buttonPressed;
}

void toggleDemoMode() {
  demoModeEnabled = !demoModeEnabled;
  infoScreenDirty = true;

  if (demoModeEnabled) {
    demoMoodIndex = 0;
    lastDemoStepMs = millis();
    setCurrentMood(MOOD_HAPPY, true);
    Serial.println(F("Demo mode: ON"));
  } else {
    setCurrentMood(sensedMood, false);
    Serial.println(F("Demo mode: OFF"));
  }
}

void processPendingShortPresses() {
  if (pendingShortPressCount == 0) {
    return;
  }

  const unsigned long now = millis();
  if ((now - lastShortPressMs) < MULTI_PRESS_GAP_MS) {
    return;
  }

  const uint8_t pressCount = pendingShortPressCount;
  pendingShortPressCount = 0;

  if (pressCount == 3) {
    toggleDemoMode();
    return;
  }

  for (uint8_t i = 0; i < pressCount; ++i) {
    currentDockedScreen = static_cast<DockedScreen>((currentDockedScreen + 1) % 6);
  }
  infoScreenDirty = true;
}

void updateBlink() {
  const unsigned long now = millis();

  if (blinkActive && now >= blinkUntilMs) {
    blinkActive = false;
  }

  if (!blinkActive && now >= nextBlinkMs) {
    blinkActive = true;
    blinkUntilMs = now + BLINK_DURATION_MS;
    nextBlinkMs = now + BLINK_INTERVAL_MS;
  }
}

void updateDockedSensors() {
  const unsigned long now = millis();
  if ((now - lastSensorReadMs) < SENSOR_READ_MS) {
    readDHT();
    return;
  }

  lastSensorReadMs = now;
  readMQ135();
  readMQ2();
  readDHT();
  updateAccelerometer();
  sensedMood = evaluateDockedMood();
  if (!demoModeEnabled) {
    setCurrentMood(sensedMood, true);
  }
  buildSnapshot();
  infoScreenDirty = true;
  printMqDebug();
}

void updateDemoMode() {
  if (!demoModeEnabled) {
    return;
  }

  const unsigned long now = millis();
  if ((now - lastDemoStepMs) < DEMO_STEP_MS) {
    return;
  }

  lastDemoStepMs = now;
  setCurrentMood(nextDemoMood(), true);
}

void handleUndockedShakeSound() {
  if (currentMode != MODE_UNDOCKED || !shakeDetected) {
    return;
  }

  const unsigned long now = millis();
  if ((now - lastShakeSoundMs) < SHAKE_SOUND_COOLDOWN_MS) {
    return;
  }

  lastShakeSoundMs = now;
  Serial.print(F("Shake detected, playing mood sound: "));
  Serial.println(moodLabel(currentMood));
  playMoodSound(currentMood);
}

void renderCurrentScreen() {
  const unsigned long now = millis();
  if (now < splashUntilMs) {
    return;
  }

  if (currentMode == MODE_UNDOCKED) {
    applyMoodColor(currentMood);
    if (currentDockedScreen == SCREEN_FACE) {
      if (lastRenderedMode != MODE_UNDOCKED ||
          lastRenderedDockedScreen != SCREEN_FACE ||
          currentMood != lastRenderedMood ||
          blinkActive != lastRenderedBlinkState) {
        drawUndockedScreen();
        lastRenderedMood = currentMood;
        lastRenderedBlinkState = blinkActive;
        lastRenderedMode = MODE_UNDOCKED;
        lastRenderedDockedScreen = SCREEN_FACE;
      }
      return;
    }

    if (!infoScreenDirty &&
        lastRenderedMode == MODE_UNDOCKED &&
        lastRenderedDockedScreen == currentDockedScreen) {
      return;
    }

    switch (currentDockedScreen) {
      case SCREEN_MQ135:
        drawMq135Screen();
        break;
      case SCREEN_MQ2:
        drawMq2Screen();
        break;
      case SCREEN_DHT:
        drawDhtScreen();
        break;
      case SCREEN_WIFI:
        drawWifiScreen();
        break;
      case SCREEN_ACCEL:
        drawAccelScreen();
        break;
      case SCREEN_FACE:
        break;
    }

    lastRenderedMode = MODE_UNDOCKED;
    lastRenderedDockedScreen = currentDockedScreen;
    lastRenderedBlinkState = blinkActive;
    lastRenderedMood = currentMood;
    infoScreenDirty = false;
    return;
  }

  applyMoodColor(currentMood);
  if (currentDockedScreen == SCREEN_FACE) {
    if (lastRenderedMode != MODE_DOCKED ||
        lastRenderedDockedScreen != SCREEN_FACE ||
        currentMood != lastRenderedMood ||
        blinkActive != lastRenderedBlinkState) {
      drawMoodFace(currentMood, blinkActive);
      lastRenderedMood = currentMood;
      lastRenderedBlinkState = blinkActive;
      lastRenderedMode = MODE_DOCKED;
      lastRenderedDockedScreen = SCREEN_FACE;
    }
    return;
  }

  if (!infoScreenDirty &&
      lastRenderedMode == MODE_DOCKED &&
      lastRenderedDockedScreen == currentDockedScreen) {
    return;
  }

  switch (currentDockedScreen) {
    case SCREEN_MQ135:
      drawMq135Screen();
      break;
    case SCREEN_MQ2:
      drawMq2Screen();
      break;
    case SCREEN_DHT:
      drawDhtScreen();
      break;
    case SCREEN_WIFI:
      drawWifiScreen();
      break;
    case SCREEN_ACCEL:
      drawAccelScreen();
      break;
    case SCREEN_FACE:
      break;
  }

  lastRenderedMode = MODE_DOCKED;
  lastRenderedDockedScreen = currentDockedScreen;
  lastRenderedBlinkState = blinkActive;
  lastRenderedMood = currentMood;
  infoScreenDirty = false;
}
}  // namespace

void setup() {
  Serial.begin(115200);
  delay(300);

  bootMs = millis();
  nextBlinkMs = bootMs + BLINK_INTERVAL_MS;

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  pinMode(MQ135_PIN, INPUT);
  pinMode(MQ2_PIN, INPUT);

#if defined(ARDUINO_ARCH_ESP32)
  analogReadResolution(12);
  analogSetPinAttenuation(MQ135_PIN, ADC_11db);
#endif

  noTone(BUZZER_PIN);
  setColor(0, 0, 0);

  Wire.begin(SDA_PIN, SCL_PIN);
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println(F("SSD1306 init failed"));
    for (;;) {
      delay(1000);
    }
  }

  display.clearDisplay();
  display.display();

  dht.begin();
  accelerometerReady = initAccelerometer();
  if (accelerometerReady) {
    Serial.println(F("ADXL345 ready"));
  } else {
    Serial.println(F("ADXL345 init failed"));
  }

  WiFi.mode(WIFI_STA);
  WiFi.persistent(false);
  WiFi.setSleep(false);
  WiFi.setAutoReconnect(true);
  WiFi.disconnect();

  wifiConfigured = AppConfig::WIFI_SSID[0] != '\0';
  lastWifiStatus = WiFi.status();

  mq135Raw = readMqAverage();
  mq135Baseline = max(1.0f, static_cast<float>(mq135Raw));
  readMQ2();
  readDHT();
  updateAccelerometer();
  currentMood = evaluateDockedMood();
  buildSnapshot();

  triggerWifiScan();
  ensureWifiConnected();
  enterMode(MODE_DOCKED);
}

void loop() {
  updateModeButton();
  processPendingShortPresses();
  updateDemoMode();

  if (currentMode == MODE_DOCKED) {
    updateDockedSensors();
    updateBlink();
    ensureWifiConnected();
    postDockedSnapshot();
  } else {
    updateDockedSensors();
    updateBlink();
    ensureWifiConnected();
    handleUndockedShakeSound();
    postDockedSnapshot();
  }

  renderCurrentScreen();
  delay(10);
}
