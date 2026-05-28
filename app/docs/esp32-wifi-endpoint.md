# ESP32 Wi-Fi endpoint

The mobile app expects the ESP32 to expose this endpoint on the same Wi-Fi
network as the phone:

```text
GET http://<esp32-ip>/reading
```

Response body:

```json
{
  "temperature": 22,
  "humidity": 46,
  "co2": 720,
  "fumes": 6,
  "smoke": 10
}
```

Minimal Arduino-style handler shape:

```cpp
server.on("/reading", HTTP_GET, []() {
  String body = "{";
  body += "\"temperature\":" + String(temperature) + ",";
  body += "\"humidity\":" + String(humidity) + ",";
  body += "\"co2\":" + String(co2) + ",";
  body += "\"fumes\":" + String(fumes) + ",";
  body += "\"smoke\":" + String(smoke);
  body += "}";

  server.send(200, "application/json", body);
});
```

In the app, enter either the ESP32 IP address or the full endpoint:

```text
192.168.1.42
http://192.168.1.42/reading
```
