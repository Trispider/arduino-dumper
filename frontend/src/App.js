// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import LoginPage        from './LoginPage';
// import { onAuthChange, logout } from './authService';
// // ============================================================================
// // ARDUINO DATABASE - Now with ESP32 Support
// // ============================================================================
// const ARDUINO_DATABASE = {
//   // === ARDUINO UNO (8-bit AVR) ===
//   "ARD-001": {
//     id: "ARD-001", name: "Weather Station Unit", board: "arduino-uno", fqbn: "arduino:avr:uno",
//     location: "Building A - Rooftop", boardImage: "🌞", boardType: "avr",
//     connectedComponents: [
//       { id: "dht22", pin: 2, label: "Temperature & Humidity" },
//       { id: "bmp280", pin: "I2C", label: "Barometric Pressure" },
//       { id: "rain-sensor", pin: "A0", label: "Rain Detection" },
//       { id: "ldr", pin: "A1", label: "Light Sensor" },
//       { id: "lcd-i2c", pin: "I2C", label: "Display" }
//     ]
//   },
//   "ARD-002": {
//     id: "ARD-002", name: "Smart Home Controller", board: "arduino-nano", fqbn: "arduino:avr:nano",
//     location: "Building B - Server Room", boardImage: "🏠", boardType: "avr",
//     connectedComponents: [
//       { id: "relay-4ch", pin: { ch1: 4, ch2: 5, ch3: 6, ch4: 7 }, label: "4-Channel Relay" },
//       { id: "pir", pin: 2, label: "Motion Sensor - Hall" },
//       { id: "dht11", pin: 3, label: "Indoor Temperature" },
//       { id: "buzzer", pin: 8, label: "Alert Buzzer" }
//     ]
//   },
//   "ARD-003": {
//     id: "ARD-003", name: "Plant Monitor", board: "arduino-nano", fqbn: "arduino:avr:nano",
//     location: "Greenhouse", boardImage: "🌱", boardType: "avr",
//     connectedComponents: [
//       { id: "soil-moisture", pin: "A0", label: "Soil Moisture" },
//       { id: "dht11", pin: 2, label: "Air Temperature" },
//       { id: "ldr", pin: "A2", label: "Light Sensor" },
//       { id: "water-pump", pin: 3, label: "Water Pump" },
//       { id: "oled", pin: "I2C", label: "Display" }
//     ]
//   },
//   "ARD-004": {
//     id: "ARD-004", name: "Security System", board: "arduino-nano", fqbn: "arduino:avr:nano",
//     location: "Main Gate", boardImage: "🔐", boardType: "avr",
//     connectedComponents: [
//       { id: "ultrasonic", pin: { trig: 9, echo: 10 }, label: "Distance Sensor" },
//       { id: "pir", pin: 2, label: "Motion Detector" },
//       { id: "buzzer", pin: 4, label: "Alarm" },
//       { id: "led-red", pin: 5, label: "Alert LED" },
//       { id: "led-green", pin: 6, label: "Status LED" }
//     ]
//   },
//   "ARD-005": {
//     id: "ARD-005", name: "Motor Controller", board: "arduino-nano", fqbn: "arduino:avr:nano",
//     location: "Factory Floor", boardImage: "⚙️", boardType: "avr",
//     connectedComponents: [
//       { id: "dc-motor", pin: { ena: 2, in1: 3, in2: 4 }, label: "Motor 1" },
//       { id: "stepper", pin: { in1: 8, in2: 9, in3: 10, in4: 11 }, label: "Stepper" },
//       { id: "current-sensor", pin: "A0", label: "Current Monitor" },
//       { id: "lcd-i2c", pin: "I2C", label: "Display" }
//     ]
//   },
  
//   // === ESP32 (32-bit ARM) ===
//   "ESP-001": {
//     id: "ESP-001", name: "IoT Hub Pro", board: "esp32", fqbn: "esp32:esp32:esp32",
//     location: "Lab Room", boardImage: "📡", boardType: "esp32",
//     connectedComponents: [
//       { id: "dht22", pin: 4, label: "Environment Sensor" },
//       { id: "mq2", pin: { analog: 34, digital: 5 }, label: "Gas Detector" },
//       { id: "pir", pin: 13, label: "Presence Sensor" },
//       { id: "relay", pin: 12, label: "Power Control" },
//       { id: "oled", pin: "I2C", label: "Display" }
//     ]
//   },
//   "ESP-002": {
//     id: "ESP-002", name: "WiFi Weather Monitor", board: "esp32", fqbn: "esp32:esp32:esp32",
//     location: "Outdoor - Patio", boardImage: "☁️", boardType: "esp32",
//     connectedComponents: [
//       { id: "dht22", pin: 23, label: "Temperature & Humidity" },
//       { id: "bmp280", pin: "I2C", label: "Barometric Pressure" },
//       { id: "rain-sensor", pin: 35, label: "Rain Detection" },
//       { id: "ldr", pin: 36, label: "Light Intensity" }
//     ]
//   },
//   "ESP-003": {
//     id: "ESP-003", name: "Smart Device Controller", board: "esp32", fqbn: "esp32:esp32:esp32",
//     location: "Living Room", boardImage: "🎮", boardType: "esp32",
//     connectedComponents: [
//       { id: "relay-4ch", pin: { ch1: 25, ch2: 26, ch3: 27, ch4: 32 }, label: "4-Channel Relay Module" },
//       { id: "lcd-i2c", pin: "I2C", label: "Status Display" },
//       { id: "buzzer", pin: 33, label: "Notification Bell" },
//       { id: "led-red", pin: 16, label: "Status LED Red" },
//       { id: "led-green", pin: 17, label: "Status LED Green" }
//     ]
//   },
//   "ESP-004": {
//     id: "ESP-004", name: "Industrial Motor Control", board: "esp32", fqbn: "esp32:esp32:esp32",
//     location: "Factory Floor - Station 1", boardImage: "🏭", boardType: "esp32",
//     connectedComponents: [
//       { id: "dc-motor", pin: { ena: 12, in1: 13, in2: 14 }, label: "DC Motor PWM" },
//       { id: "stepper", pin: { in1: 25, in2: 26, in3: 27, in4: 32 }, label: "Stepper Motor" },
//       { id: "current-sensor", pin: 34, label: "Load Monitor" },
//       { id: "oled", pin: "I2C", label: "Data Display" }
//     ]
//   }
// };

// const COMPONENT_ICONS = {
//   "dht11": "🌡️", "dht22": "🌡️", "bmp280": "📊", "rain-sensor": "🌧️",
//   "pir": "🚨", "soil-moisture": "💧", "ldr": "💡", "water-pump": "💦",
//   "relay": "⚡", "relay-4ch": "⚡", "buzzer": "🔔", "led-red": "🔴",
//   "led-green": "🟢", "lcd-i2c": "📺", "oled": "📺", "ultrasonic": "📡",
//   "dc-motor": "⚙️", "stepper": "🔄", "current-sensor": "⚡", "mq2": "💨"
// };

// const COMPONENT_TEMPLATES = {
//   "dht11": {
//     library: "DHT sensor library",
//     includes: ['#include <DHT.h>'],
//     defines: (p, boardType) => [`#define DHT_PIN ${p}`, '#define DHT_TYPE DHT11'],
//     globals: ['DHT dht(DHT_PIN, DHT_TYPE);'],
//     setup: ['dht.begin();'],
//     loop: `\n  float humidity = dht.readHumidity();\n  float temperature = dht.readTemperature();\n  if (!isnan(humidity) && !isnan(temperature)) {\n    Serial.print("Temp: "); Serial.print(temperature); Serial.println("°C");\n    Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");\n  }`
//   },
//   "dht22": {
//     library: "DHT sensor library",
//     includes: ['#include <DHT.h>'],
//     defines: (p, boardType) => [`#define DHT_PIN ${p}`, '#define DHT_TYPE DHT22'],
//     globals: ['DHT dht(DHT_PIN, DHT_TYPE);'],
//     setup: ['dht.begin();'],
//     loop: `\n  float humidity = dht.readHumidity();\n  float temperature = dht.readTemperature();\n  if (!isnan(humidity) && !isnan(temperature)) {\n    Serial.print("Temp: "); Serial.print(temperature); Serial.println("°C");\n    Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");\n  }`
//   },
//   "bmp280": {
//     library: "Adafruit BMP280 Library",
//     includes: ['#include <Wire.h>', '#include <Adafruit_BMP280.h>'],
//     defines: () => [],
//     globals: ['Adafruit_BMP280 bmp;'],
//     setup: ['if (!bmp.begin(0x76)) { Serial.println("BMP280 not found!"); while(1); }'],
//     loop: `\n  Serial.print("Pressure: "); Serial.print(bmp.readPressure()/100.0F); Serial.println(" hPa");\n  Serial.print("Altitude: "); Serial.print(bmp.readAltitude(1013.25)); Serial.println(" m");`
//   },
//   "rain-sensor": {
//     library: null,
//     includes: [],
//     defines: (p, boardType) => boardType === 'esp32'
//       ? [`#define RAIN_PIN ${p}  // ESP32 ADC pin`]
//       : [`#define RAIN_PIN ${p}`],
//     globals: [],
//     setup: [],
//     loop: `\n  int rainValue = analogRead(RAIN_PIN);\n  Serial.print("Rain: "); Serial.println(rainValue > 2500 ? "Dry" : "Wet");`
//   },
//   "pir": {
//     library: null,
//     includes: [],
//     defines: (p, boardType) => [`#define PIR_PIN ${p}`],
//     globals: [],
//     setup: ['pinMode(PIR_PIN, INPUT);'],
//     loop: `\n  if (digitalRead(PIR_PIN) == HIGH) {\n    Serial.println("Motion detected!");\n  }`
//   },
//   "soil-moisture": {
//     library: null,
//     includes: [],
//     defines: (p, boardType) => boardType === 'esp32'
//       ? [`#define SOIL_PIN ${p}  // ESP32 ADC pin`]
//       : [`#define SOIL_PIN ${p}`],
//     globals: [],
//     setup: [],
//     loop: `\n  int soilValue = analogRead(SOIL_PIN);\n  int moisture = map(soilValue, 4095, 0, 0, 100);\n  Serial.print("Soil Moisture: "); Serial.print(moisture); Serial.println("%");`
//   },
//   "ldr": {
//     library: null,
//     includes: [],
//     defines: (p, boardType) => boardType === 'esp32'
//       ? [`#define LDR_PIN ${p}  // ESP32 ADC pin`]
//       : [`#define LDR_PIN ${p}`],
//     globals: [],
//     setup: [],
//     loop: `\n  int light = analogRead(LDR_PIN);\n  Serial.print("Light: "); Serial.println(light);`
//   },
//   "water-pump": {
//     library: null, includes: [],
//     defines: (p) => [`#define PUMP_PIN ${p}`],
//     globals: [],
//     setup: ['pinMode(PUMP_PIN, OUTPUT);', 'digitalWrite(PUMP_PIN, LOW);'],
//     loop: ``
//   },
//   "relay": {
//     library: null, includes: [],
//     defines: (p) => [`#define RELAY_PIN ${p}`],
//     globals: [],
//     setup: ['pinMode(RELAY_PIN, OUTPUT);', 'digitalWrite(RELAY_PIN, HIGH);'],
//     loop: ``
//   },
//   "relay-4ch": {
//     library: null, includes: [],
//     defines: (p) => [
//       `#define RELAY1 ${p.ch1}`, `#define RELAY2 ${p.ch2}`,
//       `#define RELAY3 ${p.ch3}`, `#define RELAY4 ${p.ch4}`
//     ],
//     globals: [],
//     setup: [
//       'pinMode(RELAY1, OUTPUT); digitalWrite(RELAY1, HIGH);',
//       'pinMode(RELAY2, OUTPUT); digitalWrite(RELAY2, HIGH);',
//       'pinMode(RELAY3, OUTPUT); digitalWrite(RELAY3, HIGH);',
//       'pinMode(RELAY4, OUTPUT); digitalWrite(RELAY4, HIGH);'
//     ],
//     loop: ``
//   },
//   "buzzer": {
//     library: null, includes: [],
//     defines: (p) => [`#define BUZZER_PIN ${p}`],
//     globals: [],
//     setup: ['pinMode(BUZZER_PIN, OUTPUT);'],
//     loop: ``
//   },
//   "led-red": {
//     library: null, includes: [],
//     defines: (p) => [`#define LED_RED ${p}`],
//     globals: [],
//     setup: ['pinMode(LED_RED, OUTPUT);'],
//     loop: ``
//   },
//   "led-green": {
//     library: null, includes: [],
//     defines: (p) => [`#define LED_GREEN ${p}`],
//     globals: [],
//     setup: ['pinMode(LED_GREEN, OUTPUT);'],
//     loop: ``
//   },
//   "lcd-i2c": {
//     library: "LiquidCrystal I2C",
//     includes: ['#include <Wire.h>', '#include <LiquidCrystal_I2C.h>'],
//     defines: () => [],
//     globals: ['LiquidCrystal_I2C lcd(0x27, 16, 2);'],
//     setup: ['lcd.init();', 'lcd.backlight();', 'lcd.setCursor(0, 0);', 'lcd.print("System Ready");'],
//     loop: `\n  lcd.setCursor(0, 1);\n  lcd.print("Uptime: ");\n  lcd.print(millis()/1000);\n  lcd.print("s   ");`
//   },
//   "oled": {
//     library: "Adafruit SSD1306",
//     includes: ['#include <Wire.h>', '#include <Adafruit_GFX.h>', '#include <Adafruit_SSD1306.h>'],
//     defines: () => ['#define SCREEN_WIDTH 128', '#define SCREEN_HEIGHT 64', '#define OLED_RESET -1'],
//     globals: ['Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);'],
//     setup: ['if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { Serial.println("OLED failed"); while(1); }', 'display.clearDisplay();', 'display.setTextSize(1);', 'display.setTextColor(SSD1306_WHITE);', 'display.setCursor(0,0);', 'display.println("System Ready");', 'display.display();'],
//     loop: `\n  display.clearDisplay();\n  display.setCursor(0,0);\n  display.print("Uptime: ");\n  display.print(millis()/1000);\n  display.println("s");\n  display.display();`
//   },
//   "ultrasonic": {
//     library: null, includes: [],
//     defines: (p) => [`#define TRIG_PIN ${p.trig}`, `#define ECHO_PIN ${p.echo}`],
//     globals: [],
//     setup: ['pinMode(TRIG_PIN, OUTPUT);', 'pinMode(ECHO_PIN, INPUT);'],
//     loop: `\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  long duration = pulseIn(ECHO_PIN, HIGH);\n  float distance = duration * 0.034 / 2;\n  Serial.print("Distance: "); Serial.print(distance); Serial.println(" cm");`
//   },
//   "dc-motor": {
//     library: null, includes: [],
//     defines: (p) => [`#define MOTOR_ENA ${p.ena}`, `#define MOTOR_IN1 ${p.in1}`, `#define MOTOR_IN2 ${p.in2}`],
//     globals: [],
//     setup: ['pinMode(MOTOR_ENA, OUTPUT);', 'pinMode(MOTOR_IN1, OUTPUT);', 'pinMode(MOTOR_IN2, OUTPUT);'],
//     loop: ``
//   },
//   "stepper": {
//     library: "Stepper",
//     includes: ['#include <Stepper.h>'],
//     defines: (p) => [
//       `#define STEPPER_IN1 ${p.in1}`, `#define STEPPER_IN2 ${p.in2}`,
//       `#define STEPPER_IN3 ${p.in3}`, `#define STEPPER_IN4 ${p.in4}`,
//       '#define STEPS_PER_REV 2048'
//     ],
//     globals: ['Stepper stepper(STEPS_PER_REV, STEPPER_IN1, STEPPER_IN3, STEPPER_IN2, STEPPER_IN4);'],
//     setup: ['stepper.setSpeed(10);'],
//     loop: ``
//   },
//   "current-sensor": {
//     library: null, includes: [],
//     defines: (p, boardType) => boardType === 'esp32'
//       ? [`#define CURRENT_PIN ${p}  // ESP32 ADC pin`]
//       : [`#define CURRENT_PIN ${p}`],
//     globals: [],
//     setup: [],
//     loop: `\n  int sensorValue = analogRead(CURRENT_PIN);\n  float voltage = sensorValue * (3.3 / 4095.0);\n  float current = (voltage - 1.65) / 0.185;\n  Serial.print("Current: "); Serial.print(current); Serial.println(" A");`
//   },
//   "mq2": {
//     library: null, includes: [],
//     defines: (p) => [
//       `#define MQ2_ANALOG ${typeof p === 'object' ? p.analog : p}`,
//       `#define MQ2_DIGITAL ${typeof p === 'object' ? p.digital : 5}`
//     ],
//     globals: [],
//     setup: ['pinMode(MQ2_DIGITAL, INPUT);'],
//     loop: `\n  int gasValue = analogRead(MQ2_ANALOG);\n  bool gasDetected = digitalRead(MQ2_DIGITAL) == LOW;\n  Serial.print("Gas Level: "); Serial.print(gasValue);\n  if(gasDetected) Serial.println(" - WARNING!");\n  else Serial.println(" - OK");`
//   }
// };

// const generateCode = (arduino, components) => {
//   if (!arduino || components.length === 0) {
//     return `// Arduino Code Dumper\n// Select components to generate code\n\nvoid setup() {\n  Serial.begin(9600);\n  Serial.println("Ready");\n}\n\nvoid loop() {\n  delay(1000);\n}`;
//   }

//   let includes = new Set(), defines = [], globals = [], setupCode = [], loopCode = [];
  
//   if (arduino.boardType === 'esp32') {
//     setupCode.push('Serial.begin(115200);');
//     setupCode.push('delay(1000);  // Give ESP32 time to initialize');
//   } else {
//     setupCode.push('Serial.begin(9600);');
//   }

//   components.forEach(comp => {
//     const t = COMPONENT_TEMPLATES[comp.id];
//     if (!t) return;
//     t.includes.forEach(i => includes.add(i));
//     defines.push(...t.defines(comp.pin, arduino.boardType));
//     globals.push(...t.globals);
//     setupCode.push(...t.setup);
//     if (t.loop) loopCode.push(t.loop);
//   });

//   let code = `/*\n * Device: ${arduino.id} - ${arduino.name}\n * Board: ${arduino.board} (${arduino.fqbn})\n * Board Type: ${arduino.boardType.toUpperCase()}\n * Location: ${arduino.location}\n * Generated: ${new Date().toISOString()}\n * Components: ${components.map(c => c.label).join(', ')}\n */\n\n`;

//   if (includes.size > 0) code += Array.from(includes).join('\n') + '\n\n';
//   if (defines.length > 0) code += defines.join('\n') + '\n\n';
//   if (globals.length > 0) code += globals.join('\n') + '\n\n';

//   code += `void setup() {\n  ${setupCode.join('\n  ')}\n  Serial.println("${arduino.name} Ready");\n}\n\n`;
//   code += `void loop() {`;
//   if (loopCode.length > 0) code += loopCode.join('\n');
//   code += `\n  delay(1000);\n}\n`;

//   return code;
// };

// const injectStyles = () => {
//   if (document.getElementById('ard-dumper-css')) return;
//   const s = document.createElement('style');
//   s.id = 'ard-dumper-css';
//   s.textContent = `
//     @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
//     @keyframes ardModalIn { from { opacity:0; transform:translateY(30px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
//     @keyframes ardFadeIn { from { opacity:0; } to { opacity:1; } }
//     @keyframes ardPopIn { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
//     @keyframes ardSlideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
//     @keyframes ardBounce { 0%{ transform:scale(0.4); opacity:0; } 60%{ transform:scale(1.06); } 100%{ transform:scale(1); opacity:1; } }
//     @keyframes ardPulse { 0%, 100% { opacity:1; } 50% { opacity:0.5; } }
//     @keyframes ardSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
//     .ard-drag-tile:hover { transform:translateY(-3px) scale(1.08) !important; box-shadow:0 8px 20px rgba(37,99,235,0.14) !important; border-color:#93c5fd !important; }
//     .ard-drag-tile:active { transform:scale(0.92) !important; }
//     .ard-chip:hover .ard-chip-x { opacity:1 !important; }
//     .ard-code-ln:hover { background:rgba(37,99,235,0.03) !important; }
//     .ard-log:hover { background:rgba(37,99,235,0.025) !important; }
//     * { box-sizing:border-box; }
//     ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:transparent; }
//     ::-webkit-scrollbar-thumb { background:#d4d8e0; border-radius:3px; } ::-webkit-scrollbar-thumb:hover { background:#a0a6b4; }
//   `;
//   document.head.appendChild(s);
// };

// // ============================================================================
// // MAIN APP
// // ============================================================================
// export default function ArduinoDumper() {
//   const [currentUser,  setCurrentUser]  = useState(null);
// const [authLoading,  setAuthLoading]  = useState(true);

//   const [showIdModal, setShowIdModal] = useState(true);
//   const [modalInput, setModalInput] = useState('');
//   const [modalError, setModalError] = useState('');

//   const [selectedArduino, setSelectedArduino] = useState(null);
//   const [selectedComponents, setSelectedComponents] = useState([]);
//   const [generatedCode, setGeneratedCode] = useState('');
//   const [editableCode, setEditableCode] = useState('');
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [activeTab, setActiveTab] = useState('visual');

//   const [agentConnected, setAgentConnected] = useState(false);
//   const [uploadPhase, setUploadPhase] = useState('idle');
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadMessage, setUploadMessage] = useState('');
//   const [availablePorts, setAvailablePorts] = useState([]);
//   const [selectedPort, setSelectedPort] = useState('');
//   const [serialLog, setSerialLog] = useState([]);

//   // Flash timing
//   const [flashStartTime, setFlashStartTime] = useState(null);
//   const [flashElapsed, setFlashElapsed] = useState(0);

//   // Setup state
//   const [showSetupModal, setShowSetupModal] = useState(false);
//   const [setupPhase, setSetupPhase] = useState('idle');
//   const [setupSteps, setSetupSteps] = useState({
//     arduino_cli: { status: 'pending', progress: 0, message: 'Waiting...' },
//     core_index: { status: 'pending', progress: 0, message: 'Waiting...' },
//     avr_core: { status: 'pending', progress: 0, message: 'Waiting...' },
//     esp32_core: { status: 'pending', progress: 0, message: 'Waiting...' }
//   });
//   const [needsSetup, setNeedsSetup] = useState(false);
//   const [isReconnecting, setIsReconnecting] = useState(false);

//   const [draggingComp, setDraggingComp] = useState(null);
//   const [dragOverDrop, setDragOverDrop] = useState(false);

//   const wsRef = useRef(null);
//   const logEndRef = useRef(null);
//   const timerRef = useRef(null);

//   useEffect(() => {
//   const unsub = onAuthChange((user) => {
//     setCurrentUser(user);
//     setAuthLoading(false);
//   });
//   return () => unsub();
// }, []);

//   useEffect(() => { injectStyles(); }, []);

//   const addLog = useCallback((msg, type = 'info') => {
//     setSerialLog(prev => [...prev.slice(-100), { timestamp: new Date().toLocaleTimeString(), message: msg, type }]);
//   }, []);

//   useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [serialLog]);

//   useEffect(() => {
//     const c = generateCode(selectedArduino, selectedComponents);
//     setGeneratedCode(c);
//     if (!isEditMode) setEditableCode(c);
//   }, [selectedArduino, selectedComponents, isEditMode]);

//   // Flash timer
//   useEffect(() => {
//     if (flashStartTime && uploadPhase !== 'idle' && uploadPhase !== 'success' && uploadPhase !== 'error') {
//       timerRef.current = setInterval(() => {
//         setFlashElapsed(((Date.now() - flashStartTime) / 1000).toFixed(1));
//       }, 100);
//     } else {
//       clearInterval(timerRef.current);
//     }
//     return () => clearInterval(timerRef.current);
//   }, [flashStartTime, uploadPhase]);

//   // ========== WEBSOCKET CONNECTION ==========
//   const connectToAgent = useCallback((skipSetupCheck = false) => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
//     if (!skipSetupCheck) {
//       setIsReconnecting(true);
//       addLog('Connecting to Flash Agent...', 'info');
//     }
    
//     const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8765';
    
//     try {
//       const ws = new WebSocket(wsUrl);
      
//       ws.onopen = () => { 
//         setAgentConnected(true); 
//         setIsReconnecting(false);
//         wsRef.current = ws; 
//         addLog('Connected to Flash Agent', 'success'); 
//       };
      
//       ws.onmessage = (e) => { 
//         try { 
//           handleAgentMessage(JSON.parse(e.data)); 
//         } catch (err) { 
//           addLog(`Parse error: ${err.message}`, 'error'); 
//         } 
//       };
      
//       ws.onerror = () => { 
//         addLog('Connection error - is Flash Agent running?', 'error'); 
//         setAgentConnected(false); 
//         setIsReconnecting(false);
//       };
      
//       ws.onclose = () => { 
//         wsRef.current = null; 
//         setAgentConnected(false); 
//         setIsReconnecting(false);
//         addLog('Disconnected from Flash Agent', 'warning'); 
//       };
//     } catch (e) { 
//       setIsReconnecting(false);
//       addLog(`Failed: ${e.message}`, 'error'); 
//     }
//   }, [addLog]);

//   const handleAgentMessage = useCallback((data) => {
//     switch (data.type) {
//       case 'connected': 
//         addLog(`Flash Agent v${data.version} ready (Fast Flash)`);
//         setNeedsSetup(data.needs_setup);
//         if (data.needs_setup) {
//           setShowSetupModal(true);
//           setSetupPhase('waiting');
//           addLog('First-time setup required', 'warning');
//         } else {
//           wsRef.current.send(JSON.stringify({ type: 'list_ports' }));
//         }
//         break;
        
//       case 'setup_start':
//         setSetupPhase('running');
//         addLog('Starting setup...', 'info');
//         break;
        
//       case 'setup_progress':
//         setSetupSteps(prev => ({
//           ...prev,
//           [data.step]: {
//             status: data.status === 'success' ? 'complete' : 
//                    data.status === 'error' ? 'error' : 'running',
//             progress: data.progress,
//             message: data.message
//           }
//         }));
//         addLog(data.message, data.status);
//         break;
        
//       case 'setup_complete':
//         setSetupPhase('complete');
//         addLog('Setup complete!', 'success');
//         setTimeout(() => {
//           setShowSetupModal(false);
//           setNeedsSetup(false);
//           wsRef.current.send(JSON.stringify({ type: 'list_ports' }));
//         }, 2000);
//         break;
        
//       case 'setup_error':
//         setSetupPhase('error');
//         addLog(data.message, 'error');
//         break;
      
//       case 'ports': 
//         setAvailablePorts(data.ports || []); 
//         if (data.ports && data.ports.length > 0 && !selectedPort) {
//           const preferredPort = data.ports.find(p => p.is_esp32 || p.is_arduino) || data.ports[0];
//           setSelectedPort(preferredPort.port);
//         }
//         addLog(`Found ${data.ports?.length || 0} port(s)`); 
//         break;
        
//       case 'compile_start': 
//         setUploadPhase('compiling'); 
//         setUploadProgress(10); 
//         setUploadMessage(data.message || 'Compiling...'); 
//         addLog(data.message || 'Compiling...'); 
//         break;
        
//       case 'compile_progress': 
//         setUploadProgress(data.progress || 30); 
//         setUploadMessage(data.message || 'Compiling...');
//         addLog(data.message); 
//         break;
        
//       case 'compile_complete': 
//         setUploadProgress(50); 
//         setUploadMessage(data.message || 'Compiled ✓'); 
//         addLog(data.message || 'Compiled', 'success'); 
//         break;
        
//       case 'compile_error': 
//         setUploadPhase('error'); 
//         setUploadMessage('Compile error'); 
//         setFlashStartTime(null);
//         addLog(`Compile error: ${data.error}`, 'error'); 
//         break;
        
//       case 'upload_start': 
//         setUploadPhase('uploading'); 
//         setUploadProgress(60); 
//         setUploadMessage(data.message || 'Uploading...'); 
//         addLog(data.message || 'Uploading...'); 
//         break;
        
//       case 'upload_progress': 
//         setUploadProgress(60 + (data.progress * 0.3)); 
//         break;
        
//       case 'upload_complete': 
//         setUploadProgress(95); 
//         addLog(data.message || 'Upload complete', 'success'); 
//         break;
        
//       case 'upload_error': 
//         setUploadPhase('error'); 
//         setUploadMessage('Upload failed'); 
//         setFlashStartTime(null);
//         addLog(`Upload error: ${data.error}`, 'error'); 
//         break;
        
//       case 'verify_complete': 
//         setUploadPhase('success'); 
//         setUploadProgress(100); 
//         setUploadMessage(data.message || 'Success!'); 
//         setFlashStartTime(null);
//         addLog(data.message || 'Flashed!', 'success'); 
//         setTimeout(() => { 
//           setUploadPhase('idle'); 
//           setUploadProgress(0); 
//           setUploadMessage(''); 
//           setFlashElapsed(0);
//         }, 3000); 
//         break;
        
//       case 'error': 
//         addLog(`Error: ${data.message}`, 'error'); 
//         setFlashStartTime(null);
//         break;
        
//       default: 
//         break;
//     }
//   }, [addLog, selectedPort]);

//   // Auto-connect on mount
//   useEffect(() => {
//     const timer = setTimeout(() => { connectToAgent(); }, 500);
//     return () => {
//       clearTimeout(timer);
//       if (wsRef.current) wsRef.current.close();
//     };
//   }, [connectToAgent]);

//   const startSetup = useCallback(() => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       setSetupPhase('running');
//       wsRef.current.send(JSON.stringify({ type: 'setup' }));
//     }
//   }, []);

//   const uploadCode = useCallback(() => {
//     if (!selectedArduino || selectedComponents.length === 0) { 
//       addLog('Select components first', 'error'); 
//       return; 
//     }
//     if (!agentConnected) { 
//       addLog('Flash Agent not connected', 'error'); 
//       connectToAgent();
//       return; 
//     }
//     if (!selectedPort) { 
//       addLog('No serial port selected', 'error'); 
//       return; 
//     }
    
//     const code = isEditMode ? editableCode : generatedCode;
//     const libs = selectedComponents.map(c => COMPONENT_TEMPLATES[c.id]?.library).filter(Boolean);
    
//     // Start timing
//     setFlashStartTime(Date.now());
//     setFlashElapsed(0);
//     setUploadPhase('compiling'); 
//     setUploadProgress(5); 
//     setUploadMessage('Starting...');
//     addLog(`⚡ Fast Flash: ${selectedArduino.name} → ${selectedPort}`);
    
//     wsRef.current.send(JSON.stringify({ 
//       type: 'compile_and_upload', 
//       code, 
//       fqbn: selectedArduino.fqbn, 
//       port: selectedPort, 
//       libraries: libs,
//       boardType: selectedArduino.boardType
//     }));
//   }, [selectedArduino, selectedComponents, agentConnected, selectedPort, isEditMode, editableCode, generatedCode, addLog, connectToAgent]);

//   // ========== MODAL ==========
//   const handleModalSubmit = () => {
//     const id = modalInput.trim().toUpperCase();
//     if (!id) { setModalError('Please enter an Arduino ID'); return; }
//     const a = ARDUINO_DATABASE[id];
//     if (a) { 
//       setSelectedArduino(a); 
//       setSelectedComponents([]); 
//       setShowIdModal(false); 
//       setModalError(''); 
//       addLog(`Loaded: ${a.name} (${a.boardType.toUpperCase()})`, 'success'); 
//     } else { 
//       setModalError(`"${id}" not found. Try ARD-001-005 or ESP-001-004`); 
//     }
//   };

//   // ========== DRAG & DROP ==========
//   const onDragStart = (e, comp) => { 
//     setDraggingComp(comp); 
//     e.dataTransfer.effectAllowed = 'copy'; 
//     e.dataTransfer.setData('text/plain', comp.id); 
//   };
//   const onDragEnd = () => { setDraggingComp(null); setDragOverDrop(false); };
//   const onDropOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setDragOverDrop(true); };
//   const onDropLeave = () => setDragOverDrop(false);
//   const onDrop = (e) => {
//     e.preventDefault(); setDragOverDrop(false);
//     if (draggingComp && !selectedComponents.find(c => c.id === draggingComp.id)) {
//       setSelectedComponents(prev => [...prev, draggingComp]); 
//       addLog(`Added: ${draggingComp.label}`, 'success');
//     }
//     setDraggingComp(null);
//   };

//   const toggleComponent = useCallback((comp) => {
//     setSelectedComponents(prev => prev.find(c => c.id === comp.id) 
//       ? prev.filter(c => c.id !== comp.id) 
//       : [...prev, comp]);
//   }, []);

//   const removeComponent = (comp) => { 
//     setSelectedComponents(prev => prev.filter(c => c.id !== comp.id)); 
//     addLog(`Removed: ${comp.label}`); 
//   };

//   const copyCode = async () => { 
//     await navigator.clipboard.writeText(isEditMode ? editableCode : generatedCode); 
//     setCopied(true); addLog('Copied', 'success'); 
//     setTimeout(() => setCopied(false), 2000); 
//   };
  

//   const handleLogout = async () => {
//   await logout();
//   setCurrentUser(null);
//   setSelectedArduino(null);
//   setSelectedComponents([]);
//   setShowIdModal(true);
// };


//   const downloadCode = () => { 
//     const b = new Blob([isEditMode ? editableCode : generatedCode], { type: 'text/plain' }); 
//     const a = document.createElement('a'); 
//     a.href = URL.createObjectURL(b); 
//     a.download = `${selectedArduino?.id || 'sketch'}.ino`; 
//     a.click(); 
//     addLog('Downloaded', 'success'); 
//   };
  
//   const refreshPorts = () => { 
//     if (wsRef.current?.readyState === WebSocket.OPEN) { 
//       wsRef.current.send(JSON.stringify({ type: 'list_ports' })); 
//       addLog('Refreshing ports...'); 
//     } 
//   };

//   const getLibraries = () => { 
//     const s = new Set(); 
//     selectedComponents.forEach(c => { 
//       const t = COMPONENT_TEMPLATES[c.id]; 
//       if (t?.library) s.add(t.library); 
//     }); 
//     return Array.from(s); 
//   };

//   const logColor = (t) => ({ error: '#dc2626', success: '#059669', warning: '#d97706' }[t] || '#6b7280');
//   const logBg = (t) => ({ error: '#fef2f2', success: '#f0fdf4', warning: '#fffbeb' }[t] || 'transparent');

//   const lineStyle = (line) => {
//     const tr = line.trim();
//     if (tr.startsWith('//') || tr.startsWith('/*') || tr.startsWith('*')) return { color: '#9ca3af' };
//     if (tr.startsWith('#')) return { color: '#7c3aed' };
//     if (line.includes('void ')) return { color: '#2563eb' };
//     if (line.includes('Serial.')) return { color: '#d97706' };
//     if (/\b(float|int|long|bool|char)\b/.test(line)) return { color: '#059669' };
//     return { color: '#334155' };
//   };

//   const uploadBtnBg = () => {
//     if (!selectedArduino || selectedComponents.length === 0) return '#e2e8f0';
//     if (uploadPhase === 'success') return '#22c55e';
//     if (uploadPhase === 'error') return '#ef4444';
//     if (uploadPhase !== 'idle') return '#f59e0b';
//     return 'linear-gradient(135deg, #2563eb, #3b82f6)';
//   };
  
//   const uploadBtnText = () => {
//     if (uploadPhase === 'compiling') return `⚙️ Compiling... ${flashElapsed}s`;
//     if (uploadPhase === 'uploading') return `📤 Uploading... ${flashElapsed}s`;
//     if (uploadPhase === 'success') return '✓ Done!';
//     if (uploadPhase === 'error') return '✗ Failed';
//     return '⚡ Flash';
//   };

//   const F = "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif";
//   const M = "'JetBrains Mono', monospace";

// // ── 5a. Loading spinner (Firebase checking session) ──
// if (authLoading) {
//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(155deg, #eef2ff 0%, #f0f4ff 40%, #f8f9ff 100%)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       fontFamily: "'DM Sans', sans-serif",
//     }}>
//       <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
//         <div style={{
//           width: 36, height: 36,
//           border: '3px solid #dbeafe',
//           borderTopColor: '#2563eb',
//           borderRadius: '50%',
//           animation: 'ardSpin 0.8s linear infinite',
//         }} />
//         <span style={{ color:'#94a3b8', fontSize:13 }}>Checking session...</span>
//       </div>
//     </div>
//   );
// }

// // ── 5b. Not logged in → show login page ──
// if (!currentUser) {
//   return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
// }

// // ── 5c. Logged in but no device selected → device ID modal ──
// if (showIdModal) {
//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(155deg, #eef2ff 0%, #f0f4ff 40%, #f8f9ff 100%)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
//       animation: 'ardFadeIn 0.3s ease',
//       padding: 20,
//     }}>
//       <div style={{
//         background: 'white', borderRadius: 24, padding: '48px 44px',
//         maxWidth: 500, width: '100%',
//         boxShadow: '0 20px 70px rgba(37,99,235,0.09), 0 6px 24px rgba(0,0,0,0.05)',
//         animation: 'ardModalIn 0.45s cubic-bezier(0.16,1,0.3,1)',
//         textAlign: 'center',
//         border: '1px solid rgba(37,99,235,0.06)',
//       }}>

//         {/* Logo */}
//         <img src="/Lab.png" alt="Logo" style={{ width:'70%', height:'auto', objectFit:'contain', marginBottom:4 }} />

//         {/* Student greeting */}
//         <div style={{
//           display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
//           margin: '12px 0 4px',
//           padding: '8px 16px',
//           background: '#f0fdf4',
//           border: '1px solid #bbf7d0',
//           borderRadius: 10,
//         }}>
//           <span style={{ fontSize: 16 }}>👋</span>
//           <span style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>
//             Welcome, {currentUser.email?.split('@')[0]?.toUpperCase()}
//           </span>
//         </div>

//         <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 28px', lineHeight: 1.5 }}>
//           Arduino & ESP32 · ⚡ Flash Edition
//         </p>

//         {/* ID input */}
//         <input
//           value={modalInput}
//           onChange={e => { setModalInput(e.target.value.toUpperCase()); setModalError(''); }}
//           onKeyDown={e => e.key === 'Enter' && handleModalSubmit()}
//           placeholder="Enter Device ID  e.g. ARD-001"
//           autoFocus
//           style={{
//             width: '100%', padding: '16px 18px',
//             fontSize: 17,
//             fontFamily: "'JetBrains Mono', monospace",
//             fontWeight: 500,
//             textAlign: 'center',
//             letterSpacing: 2,
//             border: `2px solid ${modalError ? '#fca5a5' : modalInput ? '#93c5fd' : '#e2e8f0'}`,
//             borderRadius: 14, outline: 'none',
//             background: modalError ? '#fff5f5' : '#f8fafc',
//             color: '#0f172a',
//             transition: 'all 0.2s',
//           }}
//         />

//         {modalError && (
//           <p style={{ fontSize: 12, color: '#dc2626', margin: '10px 0 0', lineHeight: 1.4, animation: 'ardSlideUp .25s ease' }}>
//             {modalError}
//           </p>
//         )}

//         {/* Load button */}
//         <button
//           onClick={handleModalSubmit}
//           style={{
//             width: '100%', padding: 15, marginTop: 14,
//             background: modalInput ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : '#e2e8f0',
//             color: modalInput ? 'white' : '#94a3b8',
//             border: 'none', borderRadius: 12,
//             fontSize: 15, fontWeight: 600,
//             cursor: modalInput ? 'pointer' : 'not-allowed',
//             boxShadow: modalInput ? '0 6px 20px rgba(37,99,235,0.22)' : 'none',
//             transition: 'all 0.2s',
//             fontFamily: "'DM Sans', sans-serif",
//           }}
//         >
//           Load Device →
//         </button>

//         {/* Available IDs */}
//         <div style={{ marginTop: 22, padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
//           <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
//             Available Device IDs
//           </p>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
//             {Object.keys(ARDUINO_DATABASE).map(id => (
//               <button
//                 key={id}
//                 onClick={() => { setModalInput(id); setModalError(''); }}
//                 style={{
//                   padding: '5px 11px', borderRadius: 7,
//                   border: `1px solid ${modalInput === id ? '#bfdbfe' : '#e2e8f0'}`,
//                   background: modalInput === id ? '#eff6ff' : 'white',
//                   color: modalInput === id ? '#2563eb' : '#64748b',
//                   fontSize: 11,
//                   fontFamily: "'JetBrains Mono', monospace",
//                   cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s',
//                 }}
//               >
//                 {id}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Sign out link at bottom of modal */}
//         <button
//           onClick={handleLogout}
//           style={{
//             marginTop: 18, background: 'none', border: 'none',
//             fontSize: 12, color: '#94a3b8', cursor: 'pointer',
//             textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif",
//           }}
//         >
//           Sign out
//         </button>

//       </div>
//     </div>
//   );
// }

//   // =====================================================================
//   // RENDER: MAIN DASHBOARD
//   // =====================================================================
//   return (
//     <div style={{ minHeight: '100vh', background: '#f5f7fb', fontFamily: F, color: '#1e293b', animation: 'ardFadeIn 0.3s ease' }}>


// <header style={{
//   background: 'white',
//   borderBottom: '1px solid #e8ecf4',
//   padding: '12px 24px',
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   position: 'sticky',
//   top: 0, zIndex: 50,
//   boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
// }}>

//   {/* ── LEFT: Logo + tagline ── */}
//   <div style={{ display:'flex', alignItems:'center', gap:12 }}>
//     <img src="/Lab.png" alt="Logo" style={{ height:32, width:'auto', objectFit:'contain' }} />
//     <div>
//       <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>Select → Configure → ⚡ Flash</p>
//     </div>
//   </div>

//   {/* ── RIGHT: all controls ── */}
//   <div style={{ display:'flex', alignItems:'center', gap:10 }}>

//     {/* Active device chip */}
//     <div style={{
//       display:'flex', alignItems:'center', gap:8,
//       padding:'7px 14px',
//       background:'#f0f4ff', borderRadius:10, border:'1px solid #dbeafe',
//     }}>
//       <span style={{ fontSize:18 }}>{selectedArduino.boardImage}</span>
//       <div>
//         <div style={{ fontSize:12, fontWeight:600, color:'#1e40af', lineHeight:1.2 }}>
//           {selectedArduino.name}
//         </div>
//         <div style={{ fontSize:10, color:'#64748b', fontFamily:"'JetBrains Mono',monospace" }}>
//           {selectedArduino.id} · {selectedArduino.boardType === 'esp32' ? '🌐 ESP32' : '🔧 Arduino'}
//         </div>
//       </div>
//       <button
//         onClick={() => { setShowIdModal(true); setModalInput(''); setModalError(''); setSelectedComponents([]); }}
//         style={{
//           padding:'3px 8px', background:'white',
//           border:'1px solid #dbeafe', borderRadius:5,
//           fontSize:10, color:'#3b82f6', cursor:'pointer', fontWeight:500,
//           fontFamily:"'DM Sans',sans-serif",
//         }}
//       >
//         Change
//       </button>
//     </div>

//     {/* Agent status */}
//     <div style={{
//       display:'flex', alignItems:'center', gap:6, padding:'7px 12px',
//       background: agentConnected ? '#f0fdf4' : isReconnecting ? '#fffbeb' : '#fef2f2',
//       borderRadius:8,
//       border:`1px solid ${agentConnected ? '#bbf7d0' : isReconnecting ? '#fde68a' : '#fecaca'}`,
//     }}>
//       <div style={{
//         width:6, height:6, borderRadius:'50%',
//         background: agentConnected ? '#22c55e' : isReconnecting ? '#f59e0b' : '#ef4444',
//         animation: isReconnecting ? 'ardPulse 1s infinite' : 'none',
//       }} />
//       <span style={{
//         fontSize:11, fontWeight:500,
//         color: agentConnected ? '#15803d' : isReconnecting ? '#92400e' : '#dc2626',
//       }}>
//         {agentConnected ? 'Agent' : isReconnecting ? 'Connecting...' : 'Offline'}
//       </span>
//       {!agentConnected && !isReconnecting && (
//         <button onClick={connectToAgent} style={{
//           padding:'2px 7px', background:'white', border:'1px solid #fecaca',
//           borderRadius:4, fontSize:9, color:'#dc2626', cursor:'pointer',
//           fontFamily:"'DM Sans',sans-serif",
//         }}>
//           Connect
//         </button>
//       )}
//     </div>

//     {/* Flash button */}
//     <button
//       onClick={uploadCode}
//       disabled={selectedComponents.length === 0 || uploadPhase !== 'idle'}
//       style={{
//         padding:'10px 22px', borderRadius:10, border:'none',
//         fontWeight:600, fontSize:12, cursor: selectedComponents.length === 0 ? 'not-allowed' : 'pointer',
//         display:'flex', alignItems:'center', gap:7,
//         background: uploadBtnBg(),
//         color: selectedComponents.length === 0 ? '#94a3b8' : 'white',
//         boxShadow: selectedComponents.length > 0 && uploadPhase === 'idle' ? '0 4px 14px rgba(37,99,235,0.22)' : 'none',
//         transition:'all 0.2s',
//         fontFamily:"'DM Sans',sans-serif",
//         minWidth:160,
//       }}
//     >
//       {uploadBtnText()}
//     </button>

//     {/* ── DIVIDER ── */}
//     <div style={{ width:1, height:28, background:'#e8ecf4', flexShrink:0 }} />

//     {/* Student greeting + logout */}
//     <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//       <div style={{
//         display:'flex', alignItems:'center', gap:7,
//         padding:'6px 12px',
//         background:'#f8fafc', borderRadius:8, border:'1px solid #e8ecf4',
//       }}>
//         <span style={{ fontSize:14 }}>🎓</span>
//         <div>
//           <div style={{ fontSize:11, fontWeight:600, color:'#1e293b', lineHeight:1.2 }}>
//             {currentUser.email?.split('@')[0]?.toUpperCase()}
//           </div>
//           <div style={{ fontSize:9, color:'#94a3b8' }}>Student</div>
//         </div>
//       </div>

//       <button
//         onClick={handleLogout}
//         title="Sign out"
//         style={{
//           display:'flex', alignItems:'center', gap:5,
//           padding:'8px 12px',
//           background:'#fff5f5', border:'1px solid #fecaca',
//           borderRadius:8, fontSize:11, fontWeight:600,
//           color:'#dc2626', cursor:'pointer',
//           fontFamily:"'DM Sans',sans-serif",
//           transition:'all .15s',
//           whiteSpace:'nowrap',
//         }}
//         onMouseEnter={e => e.currentTarget.style.background='#fee2e2'}
//         onMouseLeave={e => e.currentTarget.style.background='#fff5f5'}
//       >
//         🚪 Sign Out
//       </button>
//     </div>

//   </div>
// </header>

//       {/* PROGRESS BAR with timing */}
//       {uploadPhase !== 'idle' && (
//         <div style={{ padding: '8px 24px 10px', background: 'white', borderBottom: '1px solid #e8ecf4' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11, color: '#64748b' }}>
//             <span>{uploadMessage}</span>
//             <span style={{ fontFamily: M }}>{Math.round(uploadProgress)}% • {flashElapsed}s</span>
//           </div>
//           <div style={{ width: '100%', height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
//             <div style={{ height: '100%', width: `${uploadProgress}%`, background: uploadPhase === 'error' ? '#ef4444' : uploadPhase === 'success' ? '#22c55e' : '#3b82f6', borderRadius: 2, transition: 'width 0.3s' }} />
//           </div>
//         </div>
//       )}

//       <div style={{ display: 'flex', height: uploadPhase !== 'idle' ? 'calc(100vh - 110px)' : 'calc(100vh - 66px)' }}>

//         {/* SIDEBAR */}
//         <aside style={{ width: 200, borderRight: '1px solid #e8ecf4', background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
//           <div style={{ padding: '14px 12px 8px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
//               <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.7 }}>Components</span>
//               <span style={{ fontSize: 8, color: '#bcc3d0', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>Drag →</span>
//             </div>
//           </div>

//           <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
//               {selectedArduino.connectedComponents.map((comp, i) => {
//                 const isSelected = !!selectedComponents.find(c => c.id === comp.id);
//                 return (
//                   <div key={comp.id + i}
//                     className={isSelected ? '' : 'ard-drag-tile'}
//                     draggable={!isSelected}
//                     onDragStart={e => !isSelected && onDragStart(e, comp)}
//                     onDragEnd={onDragEnd}
//                     onClick={() => toggleComponent(comp)}
//                     title={comp.label}
//                     style={{
//                       width: '100%', aspectRatio: '1', borderRadius: 12,
//                       background: isSelected ? '#eff6ff' : '#f8fafc',
//                       border: `2px solid ${isSelected ? '#93c5fd' : '#edf0f7'}`,
//                       display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
//                       cursor: isSelected ? 'pointer' : 'grab',
//                       transition: 'all 0.2s ease', userSelect: 'none',
//                       opacity: isSelected ? 0.5 : 1,
//                       animation: `ardBounce 0.35s ease ${i * 0.04}s both`,
//                     }}>
//                     <span style={{ fontSize: 22, lineHeight: 1 }}>{COMPONENT_ICONS[comp.id] || '⚙️'}</span>
//                     <span style={{ fontSize: 7.5, fontWeight: 600, color: isSelected ? '#3b82f6' : '#64748b', textAlign: 'center', lineHeight: 1.2, maxWidth: 66, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                       {comp.label.length > 12 ? comp.label.split(' ')[0] : comp.label}
//                     </span>
//                     {isSelected && <span style={{ fontSize: 7, color: '#3b82f6', fontWeight: 700 }}>✓ added</span>}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {getLibraries().length > 0 && (
//             <div style={{ padding: '8px 12px', borderTop: '1px solid #e8ecf4', background: '#fffbeb' }}>
//               <p style={{ fontSize: 8, fontWeight: 600, color: '#92400e', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Libraries</p>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//                 {getLibraries().map(l => <span key={l} style={{ fontSize: 9, color: '#92400e', background: 'white', padding: '3px 6px', borderRadius: 4, border: '1px solid #fde68a' }}>📦 {l}</span>)}
//               </div>
//             </div>
//           )}

//           {agentConnected && (
//             <div style={{ padding: '8px 12px', borderTop: '1px solid #e8ecf4', background: '#f0fdf4' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
//                 <span style={{ fontSize: 8, fontWeight: 600, color: '#15803d', textTransform: 'uppercase', letterSpacing: 0.5 }}>Port</span>
//                 <button onClick={refreshPorts} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, padding: 0 }}>🔄</button>
//               </div>
//               <select value={selectedPort} onChange={e => setSelectedPort(e.target.value)} style={{ width: '100%', padding: '5px 6px', background: 'white', border: '1px solid #bbf7d0', borderRadius: 5, fontSize: 9, fontFamily: M, color: '#1e293b', outline: 'none', cursor: 'pointer' }}>
//                 {availablePorts.length === 0 ? <option value="">No ports</option> : availablePorts.map(p => <option key={p.port} value={p.port}>{p.port} {p.is_arduino ? '★ AVR' : p.is_esp32 ? '📡 ESP32' : ''}</option>)}
//               </select>
//             </div>
//           )}
//         </aside>

//         {/* CENTER */}
//         <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fafbfe', overflow: 'hidden' }}>
//           <div style={{ display: 'flex', borderBottom: '1px solid #e8ecf4', background: 'white', padding: '0 20px' }}>
//             <button onClick={() => setActiveTab('visual')} style={{ padding: '13px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: activeTab === 'visual' ? '#2563eb' : '#94a3b8', border: 'none', background: 'transparent', borderBottom: `2px solid ${activeTab === 'visual' ? '#2563eb' : 'transparent'}`, transition: 'all 0.2s', fontFamily: F }}>🎨 Visual</button>
//             <button onClick={() => setActiveTab('code')} style={{ padding: '13px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: activeTab === 'code' ? '#2563eb' : '#94a3b8', border: 'none', background: 'transparent', borderBottom: `2px solid ${activeTab === 'code' ? '#2563eb' : 'transparent'}`, transition: 'all 0.2s', fontFamily: F }}>💻 Code</button>
//           </div>

//           {activeTab === 'visual' && (
//             <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
//                 <div style={{ fontSize: 72, marginBottom: 12 }}>{selectedArduino.boardImage}</div>
//                 <div style={{ textAlign: 'center' }}>
//                   <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{selectedArduino.name}</div>
//                   <div style={{ fontSize: 12, color: '#64748b', fontFamily: M, marginBottom: 4 }}>{selectedArduino.id}</div>
//                   <div style={{ fontSize: 11, color: '#94a3b8' }}>📍 {selectedArduino.location}</div>
//                   <div style={{ fontSize: 10, color: '#2563eb', fontWeight: 600, marginTop: 8, padding: '4px 8px', background: '#eff6ff', borderRadius: 5 }}>
//                     {selectedArduino.boardType === 'esp32' ? '🌐 ESP32 32-bit' : '🔧 Arduino 8-bit'}
//                   </div>
//                 </div>
//               </div>

//               <div
//                 onDragOver={onDropOver} onDragLeave={onDropLeave} onDrop={onDrop}
//                 style={{
//                   width: '100%', maxWidth: 700, minHeight: 130, borderRadius: 18,
//                   border: `2px dashed ${dragOverDrop ? '#3b82f6' : selectedComponents.length > 0 ? '#c7d2fe' : '#d1d5db'}`,
//                   background: dragOverDrop ? '#eff6ff' : selectedComponents.length > 0 ? 'white' : '#f8fafc',
//                   padding: selectedComponents.length > 0 ? 18 : 28,
//                   transition: 'all 0.25s ease',
//                   display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
//                   gap: 0, boxShadow: selectedComponents.length > 0 ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
//                 }}>
//                 {selectedComponents.length === 0 ? (
//                   <div style={{ textAlign: 'center' }}>
//                     <p style={{ fontSize: 34, margin: '0 0 8px', opacity: 0.4 }}>📥</p>
//                     <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, fontWeight: 500 }}>
//                       {dragOverDrop ? 'Drop to add!' : 'Drag components here from sidebar'}
//                     </p>
//                     <p style={{ fontSize: 11, color: '#c4c9d4', margin: '6px 0 0' }}>or click components in sidebar to toggle</p>
//                   </div>
//                 ) : (
//                   selectedComponents.map((comp, i) => (
//                     <React.Fragment key={comp.id}>
//                       {i > 0 && (
//                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, flexShrink: 0, animation: `ardPopIn 0.25s ease ${i * 0.04}s both` }}>
//                           <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                             <circle cx="10" cy="10" r="9" stroke="#c7d2fe" strokeWidth="1.5" fill="#eef2ff"/>
//                             <path d="M10 6V14M6 10H14" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round"/>
//                           </svg>
//                         </div>
//                       )}
//                       <div className="ard-chip" style={{
//                         display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
//                         padding: '14px 16px', borderRadius: 14, background: '#f0f4ff',
//                         border: '2px solid #c7d2fe', position: 'relative',
//                         animation: `ardPopIn 0.3s ease ${i * 0.05}s both`,
//                         boxShadow: '0 2px 8px rgba(37,99,235,0.06)', minWidth: 80,
//                       }}>
//                         <button className="ard-chip-x" onClick={() => removeComponent(comp)} style={{
//                           position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%',
//                           background: '#ef4444', border: '2px solid white', color: 'white', fontSize: 10,
//                           cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           opacity: 0, transition: 'opacity 0.15s', boxShadow: '0 2px 6px rgba(239,68,68,0.25)',
//                           padding: 0, lineHeight: 1, fontFamily: F,
//                         }}>✕</button>
//                         <span style={{ fontSize: 28, lineHeight: 1 }}>{COMPONENT_ICONS[comp.id] || '⚙️'}</span>
//                         <span style={{ fontSize: 10, fontWeight: 600, color: '#1e40af', textAlign: 'center', maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                           {comp.label.length > 14 ? comp.label.split(' ')[0] : comp.label}
//                         </span>
//                       </div>
//                     </React.Fragment>
//                   ))
//                 )}
//               </div>

//               {selectedComponents.length > 0 && (
//                 <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, animation: 'ardSlideUp 0.3s ease' }}>
//                   <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>
//                     {selectedComponents.length} component{selectedComponents.length > 1 ? 's' : ''} selected for {selectedArduino.id}
//                   </span>
//                   <button onClick={() => { setSelectedComponents([]); addLog('Cleared all'); }} style={{ padding: '4px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11, color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontFamily: F }}>Clear all</button>
//                 </div>
//               )}

//               {selectedComponents.length > 0 && (
//                 <div style={{ marginTop: 20, textAlign: 'center', padding: 18, borderRadius: 14, background: 'white', border: '2px solid #dbeafe', boxShadow: '0 2px 8px rgba(37,99,235,0.04)', maxWidth: 360, width: '100%', animation: 'ardSlideUp 0.35s ease' }}>
//                   <p style={{ color: '#2563eb', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>✓ Ready to Generate Code</p>
//                   <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>Switch to Code tab to view code</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'code' && (
//             <>
//               <div style={{ padding: '11px 20px', borderBottom: '1px solid #e8ecf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <span style={{ fontSize: 15 }}>📝</span>
//                   <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>Generated Code</span>
//                   <span style={{ padding: '3px 9px', background: '#f1f5f9', borderRadius: 4, fontSize: 10, color: '#64748b', fontFamily: M }}>{selectedArduino.id}.ino</span>
//                 </div>
//                 <div style={{ display: 'flex', gap: 6 }}>
//                   <button onClick={() => setIsEditMode(!isEditMode)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: isEditMode ? '#eff6ff' : 'white', color: isEditMode ? '#2563eb' : '#64748b', fontSize: 11, cursor: 'pointer', fontWeight: 500, fontFamily: F }}>✏️ {isEditMode ? 'Preview' : 'Edit'}</button>
//                   <button onClick={copyCode} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: copied ? '#f0fdf4' : 'white', color: copied ? '#059669' : '#64748b', fontSize: 11, cursor: 'pointer', fontWeight: 500, fontFamily: F }}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
//                   <button onClick={downloadCode} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #dbeafe', background: '#eff6ff', color: '#2563eb', fontSize: 11, cursor: 'pointer', fontWeight: 500, fontFamily: F }}>📥 Download</button>
//                 </div>
//               </div>
//               {isEditMode ? (
//                 <textarea value={editableCode} onChange={e => setEditableCode(e.target.value)} spellCheck="false"
//                   style={{ flex: 1, padding: 20, margin: 0, border: 'none', outline: 'none', resize: 'none', fontFamily: M, fontSize: 12, lineHeight: 1.8, background: '#fafbfe', color: '#1e293b' }} />
//               ) : (
//                 <pre style={{ flex: 1, overflow: 'auto', padding: '14px 0', margin: 0, fontFamily: M, fontSize: 12, lineHeight: 1.8, background: '#fafbfe' }}>
//                   {generatedCode.split('\n').map((line, i) => (
//                     <div key={i} className="ard-code-ln" style={{ display: 'flex', padding: '0 20px' }}>
//                       <span style={{ width: 34, textAlign: 'right', paddingRight: 12, color: '#c4c9d4', userSelect: 'none', fontSize: 10, borderRight: '1px solid #e8ecf4', marginRight: 12, flexShrink: 0 }}>{i + 1}</span>
//                       <span style={lineStyle(line)}>{line || ' '}</span>
//                     </div>
//                   ))}
//                 </pre>
//               )}
//             </>
//           )}
//         </main>

//         {/* RIGHT PANEL */}
//         <aside style={{ width: 260, borderLeft: '1px solid #e8ecf4', background: 'white', display: 'flex', flexDirection: 'column' }}>
//           <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8ecf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafbfe' }}>
//             <span style={{ fontWeight: 600, color: '#475569', fontSize: 12 }}>📟 Activity Log</span>
//             <button onClick={() => setSerialLog([])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#94a3b8' }}>Clear</button>
//           </div>
//           <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
//             {serialLog.length === 0 ? (
//               <p style={{ color: '#cbd5e1', fontSize: 12, textAlign: 'center', marginTop: 40 }}>No activity yet...</p>
//             ) : serialLog.map((log, i) => (
//               <div key={i} className="ard-log" style={{ display: 'flex', gap: 6, padding: '4px 6px', borderRadius: 4, background: logBg(log.type), marginBottom: 2 }}>
//                 <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: M, flexShrink: 0, paddingTop: 1 }}>{log.timestamp}</span>
//                 <span style={{ fontSize: 10, color: logColor(log.type), fontFamily: M, wordBreak: 'break-word' }}>{log.message}</span>
//               </div>
//             ))}
//             <div ref={logEndRef} />
//           </div>
//         </aside>
//       </div>

//       {/* SETUP PROGRESS MODAL */}
//       {showSetupModal && (
//         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, animation: 'ardFadeIn 0.2s ease' }}>
//           <div style={{ position: 'relative', background: 'white', borderRadius: 24, padding: 40, maxWidth: 560, width: '90%', boxShadow: '0 25px 80px rgba(0,0,0,0.15)', animation: 'ardModalIn 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            
//             {setupPhase === 'waiting' && (
//               <>
//                 <div style={{ textAlign: 'center', marginBottom: 32 }}>
//                   <div style={{ fontSize: 56, marginBottom: 16 }}>🔧</div>
//                   <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>First-Time Setup Required</h2>
//                   <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
//                     This will download and install the Arduino CLI and required cores.<br/>
//                     <strong style={{ color: '#2563eb' }}>ESP32 core may take 10-30 minutes on first install.</strong>
//                   </p>
//                 </div>
//                 <div style={{ marginBottom: 24 }}>
//                   <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12 }}>Setup will install:</div>
//                   {['Arduino CLI', 'Package Index', 'Arduino AVR Core (~5 min)', 'ESP32 Core (~10-30 min)'].map((item, i) => (
//                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, marginBottom: 6 }}>
//                       <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1' }} />
//                       <span style={{ fontSize: 13, color: '#475569' }}>{item}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <button onClick={startSetup} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #2563eb, #3b82f6)', border: 'none', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 20px rgba(37,99,235,0.25)', fontFamily: F }}>
//                   🚀 Start Setup
//                 </button>
//               </>
//             )}

//             {setupPhase === 'running' && (
//               <>
//                 <div style={{ textAlign: 'center', marginBottom: 28 }}>
//                   <div style={{ fontSize: 48, marginBottom: 12, animation: 'ardSpin 2s linear infinite' }}>⚙️</div>
//                   <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Installing Components...</h2>
//                   <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Please wait, this may take several minutes</p>
//                 </div>
                
//                 {Object.entries(setupSteps).map(([key, step]) => (
//                   <div key={key} style={{ marginBottom: 16 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                         <div style={{ 
//                           width: 20, height: 20, borderRadius: '50%', 
//                           background: step.status === 'complete' ? '#22c55e' : step.status === 'running' ? '#3b82f6' : step.status === 'error' ? '#ef4444' : '#e2e8f0',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           fontSize: 11, color: 'white', fontWeight: 600
//                         }}>
//                           {step.status === 'complete' ? '✓' : step.status === 'error' ? '✗' : step.status === 'running' ? '...' : ''}
//                         </div>
//                         <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
//                           {key === 'arduino_cli' ? 'Arduino CLI' : 
//                            key === 'core_index' ? 'Package Index' :
//                            key === 'avr_core' ? 'Arduino AVR Core' :
//                            'ESP32 Core'}
//                         </span>
//                       </div>
//                       <span style={{ fontSize: 11, color: '#64748b', fontFamily: M }}>{step.progress}%</span>
//                     </div>
//                     <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
//                       <div style={{ 
//                         height: '100%', width: `${step.progress}%`, 
//                         background: step.status === 'complete' ? '#22c55e' : step.status === 'error' ? '#ef4444' : '#3b82f6',
//                         borderRadius: 3, transition: 'width 0.3s'
//                       }} />
//                     </div>
//                     <p style={{ fontSize: 10, color: step.status === 'error' ? '#dc2626' : '#64748b', margin: '4px 0 0', fontFamily: M }}>{step.message}</p>
//                   </div>
//                 ))}
//               </>
//             )}

//             {setupPhase === 'complete' && (
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: 64, marginBottom: 16, animation: 'ardBounce 0.5s ease' }}>✅</div>
//                 <h2 style={{ fontSize: 22, fontWeight: 700, color: '#059669', margin: '0 0 8px' }}>Setup Complete!</h2>
//                 <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Flash Agent is ready to use</p>
//               </div>
//             )}

//             {setupPhase === 'error' && (
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
//                 <h2 style={{ fontSize: 22, fontWeight: 700, color: '#dc2626', margin: '0 0 8px' }}>Setup Incomplete</h2>
//                 <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>Some features may not work. Check the activity log.</p>
//                 <button onClick={() => setShowSetupModal(false)} style={{ padding: '10px 24px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: F }}>
//                   Close
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// ARDUINO DATABASE - Now with ESP32 Support
// ============================================================================
// const ARDUINO_DATABASE = {
//   // === ARDUINO UNO (8-bit AVR) ===
//   "ARD-001": {
//     id: "ARD-001", name: "Weather Station Unit", board: "arduino-uno", fqbn: "arduino:avr:uno",
//     location: "Building A - Rooftop", boardImage: "🌞", boardType: "avr",
//     connectedComponents: [
//       { id: "dht22", pin: 2, label: "Temperature & Humidity" },
//       { id: "bmp280", pin: "I2C", label: "Barometric Pressure" },
//       { id: "rain-sensor", pin: "A0", label: "Rain Detection" },
//       { id: "ldr", pin: "A1", label: "Light Sensor" },
//       { id: "lcd-i2c", pin: "I2C", label: "Display" }
//     ]
//   },
//   "ARD-002": {
//     id: "ARD-002", name: "Smart Home Controller", board: "arduino-nano", fqbn: "arduino:avr:nano",
//     location: "Building B - Server Room", boardImage: "🏠", boardType: "avr",
//     connectedComponents: [
//       { id: "relay-4ch", pin: { ch1: 4, ch2: 5, ch3: 6, ch4: 7 }, label: "4-Channel Relay" },
//       { id: "pir", pin: 2, label: "Motion Sensor - Hall" },
//       { id: "dht11", pin: 3, label: "Indoor Temperature" },
//       { id: "buzzer", pin: 8, label: "Alert Buzzer" }
//     ]
//   },
//   "ARD-003": {
//     id: "ARD-003", name: "Plant Monitor", board: "arduino-nano", fqbn: "arduino:avr:nano",
//     location: "Greenhouse", boardImage: "🌱", boardType: "avr",
//     connectedComponents: [
//       { id: "soil-moisture", pin: "A0", label: "Soil Moisture" },
//       { id: "dht11", pin: 2, label: "Air Temperature" },
//       { id: "ldr", pin: "A2", label: "Light Sensor" },
//       { id: "water-pump", pin: 3, label: "Water Pump" },
//       { id: "oled", pin: "I2C", label: "Display" }
//     ]
//   },
//   "ARD-004": {
//     id: "ARD-004", name: "Security System", board: "arduino-nano", fqbn: "arduino:avr:nano",
//     location: "Main Gate", boardImage: "🔐", boardType: "avr",
//     connectedComponents: [
//       { id: "ultrasonic", pin: { trig: 9, echo: 10 }, label: "Distance Sensor" },
//       { id: "pir", pin: 2, label: "Motion Detector" },
//       { id: "buzzer", pin: 4, label: "Alarm" },
//       { id: "led-red", pin: 5, label: "Alert LED" },
//       { id: "led-green", pin: 6, label: "Status LED" }
//     ]
//   },
//   "ARD-005": {
//     id: "ARD-005", name: "Motor Controller", board: "arduino-nano", fqbn: "arduino:avr:nano",
//     location: "Factory Floor", boardImage: "⚙️", boardType: "avr",
//     connectedComponents: [
//       { id: "dc-motor", pin: { ena: 2, in1: 3, in2: 4 }, label: "Motor 1" },
//       { id: "stepper", pin: { in1: 8, in2: 9, in3: 10, in4: 11 }, label: "Stepper" },
//       { id: "current-sensor", pin: "A0", label: "Current Monitor" },
//       { id: "lcd-i2c", pin: "I2C", label: "Display" }
//     ]
//   },

//   // === ESP32 (32-bit) ===
//   "ESP-001": {
//     id: "ESP-001", name: "IoT Hub Pro", board: "esp32", fqbn: "esp32:esp32:esp32",
//     location: "Lab Room", boardImage: "📡", boardType: "esp32",
//     connectedComponents: [
//       { id: "dht22", pin: 4, label: "Environment Sensor" },
//       { id: "mq2", pin: { analog: 34, digital: 5 }, label: "Gas Detector" },
//       { id: "pir", pin: 13, label: "Presence Sensor" },
//       { id: "relay", pin: 12, label: "Power Control" },
//       { id: "oled", pin: "I2C", label: "Display" }
//     ]
//   },
//   "ESP-002": {
//     id: "ESP-002", name: "WiFi Weather Monitor", board: "esp32", fqbn: "esp32:esp32:esp32",
//     location: "Outdoor - Patio", boardImage: "☁️", boardType: "esp32",
//     connectedComponents: [
//       { id: "dht22", pin: 23, label: "Temperature & Humidity" },
//       { id: "bmp280", pin: "I2C", label: "Barometric Pressure" },
//       { id: "rain-sensor", pin: 35, label: "Rain Detection" },
//       { id: "ldr", pin: 36, label: "Light Intensity" }
//     ]
//   },
//   "ESP-003": {
//     id: "ESP-003", name: "Smart Device Controller", board: "esp32", fqbn: "esp32:esp32:esp32",
//     location: "Living Room", boardImage: "🎮", boardType: "esp32",
//     connectedComponents: [
//       { id: "relay-4ch", pin: { ch1: 25, ch2: 26, ch3: 27, ch4: 32 }, label: "4-Channel Relay Module" },
//       { id: "lcd-i2c", pin: "I2C", label: "Status Display" },
//       { id: "buzzer", pin: 33, label: "Notification Bell" },
//       { id: "led-red", pin: 16, label: "Status LED Red" },
//       { id: "led-green", pin: 17, label: "Status LED Green" }
//     ]
//   },
//   "ESP-004": {
//     id: "ESP-004", name: "Industrial Motor Control", board: "esp32", fqbn: "esp32:esp32:esp32",
//     location: "Factory Floor - Station 1", boardImage: "🏭", boardType: "esp32",
//     connectedComponents: [
//       { id: "dc-motor", pin: { ena: 12, in1: 13, in2: 14 }, label: "DC Motor PWM" },
//       { id: "stepper", pin: { in1: 25, in2: 26, in3: 27, in4: 32 }, label: "Stepper Motor" },
//       { id: "current-sensor", pin: 34, label: "Load Monitor" },
//       { id: "oled", pin: "I2C", label: "Data Display" }
//     ]
//   },

//   // === YOUR LAB BOARD (ESP32-WROOM-32D) ===
//   "ESP-LAB": {
//     id: "ESP-LAB", name: "Lab Training Board", board: "esp32", fqbn: "esp32:esp32:esp32",
//     location: "Lab", boardImage: "🖥️", boardType: "esp32",
//     connectedComponents: [
//       { id: "lan8720",      pin: { mdc: 23, mdio: 18, power: 16, addr: 1 },              label: "LAN8720 Ethernet"      },
//       { id: "l298n",        pin: { ena: 14, in1: 27, in2: 26, enb: 25, in3: 33, in4: 32 }, label: "L298N Motor Driver"  },
//       { id: "buzzer",       pin: 19,                                                       label: "Buzzer"               },
//       { id: "ldr",          pin: 34,                                                       label: "LDR Light Sensor"     },
//       { id: "led-red",      pin: 21,                                                       label: "LED Red"              },
//       { id: "led-green",    pin: 22,                                                       label: "LED Green"            },
//       { id: "led-blue",     pin: 5,                                                        label: "LED Blue"             },
//       { id: "led-with-pot", pin: { led: 2, pot: 35 },                                     label: "LED + Potentiometer"  },
//       { id: "dht11",        pin: 4,                                                        label: "DHT11 Temperature"    },
//       { id: "oled",         pin: "I2C",                                                    label: "OLED Display"         },
//       { id: "relay-2ch",    pin: { ch1: 12, ch2: 13 },                                    label: "2-Channel Relay"      }
//     ]
//   }
// };

// // ─────────────────────────────────────────────
// const COMPONENT_ICONS = {
//   // existing
//   "dht11": "🌡️", "dht22": "🌡️", "bmp280": "📊", "rain-sensor": "🌧️",
//   "pir": "🚨", "soil-moisture": "💧", "ldr": "💡", "water-pump": "💦",
//   "relay": "⚡", "relay-4ch": "⚡", "relay-2ch": "⚡",
//   "buzzer": "🔔", "led-red": "🔴", "led-green": "🟢",
//   "lcd-i2c": "📺", "oled": "📺", "ultrasonic": "📡",
//   "dc-motor": "⚙️", "stepper": "🔄", "current-sensor": "⚡", "mq2": "💨",
//   // new
//   "lan8720": "🌐",
//   "l298n": "🚗",
//   "led-blue": "🔵",
//   "led-yellow": "🟡",
//   "led-white": "⚪",
//   "led-with-pot": "🎛️",
//   "potentiometer": "🎛️"
// };

// // ─────────────────────────────────────────────
// const COMPONENT_TEMPLATES = {
//   // ── existing templates (unchanged) ──────────
//   "dht11": {
//     library: "DHT sensor library",
//     includes: ['#include <DHT.h>'],
//     defines: (p) => [`#define DHT_PIN ${p}`, '#define DHT_TYPE DHT11'],
//     globals: ['DHT dht(DHT_PIN, DHT_TYPE);'],
//     setup: ['dht.begin();'],
//     loop: `\n  float humidity = dht.readHumidity();\n  float temperature = dht.readTemperature();\n  if (!isnan(humidity) && !isnan(temperature)) {\n    Serial.print("Temp: "); Serial.print(temperature); Serial.println(" C");\n    Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");\n  }`
//   },
//   "dht22": {
//     library: "DHT sensor library",
//     includes: ['#include <DHT.h>'],
//     defines: (p) => [`#define DHT_PIN ${p}`, '#define DHT_TYPE DHT22'],
//     globals: ['DHT dht(DHT_PIN, DHT_TYPE);'],
//     setup: ['dht.begin();'],
//     loop: `\n  float humidity = dht.readHumidity();\n  float temperature = dht.readTemperature();\n  if (!isnan(humidity) && !isnan(temperature)) {\n    Serial.print("Temp: "); Serial.print(temperature); Serial.println(" C");\n    Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");\n  }`
//   },
//   "bmp280": {
//     library: "Adafruit BMP280 Library",
//     includes: ['#include <Wire.h>', '#include <Adafruit_BMP280.h>'],
//     defines: () => [],
//     globals: ['Adafruit_BMP280 bmp;'],
//     setup: ['if (!bmp.begin(0x76)) { Serial.println("BMP280 not found!"); while(1); }'],
//     loop: `\n  Serial.print("Pressure: "); Serial.print(bmp.readPressure()/100.0F); Serial.println(" hPa");\n  Serial.print("Altitude: "); Serial.print(bmp.readAltitude(1013.25)); Serial.println(" m");`
//   },
//   "rain-sensor": {
//     library: null, includes: [],
//     defines: (p, boardType) => boardType === 'esp32'
//       ? [`#define RAIN_PIN ${p}  // ESP32 ADC pin`]
//       : [`#define RAIN_PIN ${p}`],
//     globals: [],
//     setup: [],
//     loop: `\n  int rainValue = analogRead(RAIN_PIN);\n  Serial.print("Rain: "); Serial.println(rainValue > 2500 ? "Dry" : "Wet");`
//   },
//   "pir": {
//     library: null, includes: [],
//     defines: (p) => [`#define PIR_PIN ${p}`],
//     globals: [],
//     setup: ['pinMode(PIR_PIN, INPUT);'],
//     loop: `\n  if (digitalRead(PIR_PIN) == HIGH) {\n    Serial.println("Motion detected!");\n  }`
//   },
//   "soil-moisture": {
//     library: null, includes: [],
//     defines: (p, boardType) => boardType === 'esp32'
//       ? [`#define SOIL_PIN ${p}  // ESP32 ADC pin`]
//       : [`#define SOIL_PIN ${p}`],
//     globals: [],
//     setup: [],
//     loop: `\n  int soilValue = analogRead(SOIL_PIN);\n  int moisture = map(soilValue, 4095, 0, 0, 100);\n  Serial.print("Soil Moisture: "); Serial.print(moisture); Serial.println("%");`
//   },
//   "ldr": {
//     library: null, includes: [],
//     defines: (p, boardType) => boardType === 'esp32'
//       ? [`#define LDR_PIN ${p}  // ESP32 ADC pin`]
//       : [`#define LDR_PIN ${p}`],
//     globals: [],
//     setup: [],
//     loop: `\n  int light = analogRead(LDR_PIN);\n  Serial.print("Light Level: "); Serial.println(light);`
//   },
//   "water-pump": {
//     library: null, includes: [],
//     defines: (p) => [`#define PUMP_PIN ${p}`],
//     globals: [],
//     setup: ['pinMode(PUMP_PIN, OUTPUT);', 'digitalWrite(PUMP_PIN, LOW);'],
//     loop: ``
//   },
//   "relay": {
//     library: null, includes: [],
//     defines: (p) => [`#define RELAY_PIN ${p}`],
//     globals: [],
//     setup: ['pinMode(RELAY_PIN, OUTPUT);', 'digitalWrite(RELAY_PIN, HIGH);'],
//     loop: ``
//   },
//   "relay-4ch": {
//     library: null, includes: [],
//     defines: (p) => [
//       `#define RELAY1 ${p.ch1}`, `#define RELAY2 ${p.ch2}`,
//       `#define RELAY3 ${p.ch3}`, `#define RELAY4 ${p.ch4}`
//     ],
//     globals: [],
//     setup: [
//       'pinMode(RELAY1, OUTPUT); digitalWrite(RELAY1, HIGH);',
//       'pinMode(RELAY2, OUTPUT); digitalWrite(RELAY2, HIGH);',
//       'pinMode(RELAY3, OUTPUT); digitalWrite(RELAY3, HIGH);',
//       'pinMode(RELAY4, OUTPUT); digitalWrite(RELAY4, HIGH);'
//     ],
//     loop: ``
//   },
//   "buzzer": {
//     library: null, includes: [],
//     defines: (p) => [`#define BUZZER_PIN ${p}`],
//     globals: [],
//     setup: ['pinMode(BUZZER_PIN, OUTPUT);'],
//     loop: `\n  tone(BUZZER_PIN, 1000, 200);\n  delay(500);`
//   },
//   "led-red": {
//     library: null, includes: [],
//     defines: (p) => [`#define LED_RED ${p}`],
//     globals: [],
//     setup: ['pinMode(LED_RED, OUTPUT);'],
//     loop: `\n  digitalWrite(LED_RED, HIGH); delay(300);\n  digitalWrite(LED_RED, LOW);  delay(300);`
//   },
//   "led-green": {
//     library: null, includes: [],
//     defines: (p) => [`#define LED_GREEN ${p}`],
//     globals: [],
//     setup: ['pinMode(LED_GREEN, OUTPUT);'],
//     loop: `\n  digitalWrite(LED_GREEN, HIGH); delay(300);\n  digitalWrite(LED_GREEN, LOW);  delay(300);`
//   },
//   "lcd-i2c": {
//     library: "LiquidCrystal I2C",
//     includes: ['#include <Wire.h>', '#include <LiquidCrystal_I2C.h>'],
//     defines: () => [],
//     globals: ['LiquidCrystal_I2C lcd(0x27, 16, 2);'],
//     setup: ['lcd.init();', 'lcd.backlight();', 'lcd.setCursor(0, 0);', 'lcd.print("System Ready");'],
//     loop: `\n  lcd.setCursor(0, 1);\n  lcd.print("Uptime: ");\n  lcd.print(millis()/1000);\n  lcd.print("s   ");`
//   },
//   "oled": {
//     library: "Adafruit SSD1306",
//     includes: ['#include <Wire.h>', '#include <Adafruit_GFX.h>', '#include <Adafruit_SSD1306.h>'],
//     defines: () => ['#define SCREEN_WIDTH 128', '#define SCREEN_HEIGHT 64', '#define OLED_RESET -1'],
//     globals: ['Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);'],
//     setup: [
//       'if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { Serial.println("OLED failed"); while(1); }',
//       'display.clearDisplay();', 'display.setTextSize(1);',
//       'display.setTextColor(SSD1306_WHITE);', 'display.setCursor(0,0);',
//       'display.println("System Ready");', 'display.display();'
//     ],
//     loop: `\n  display.clearDisplay();\n  display.setCursor(0,0);\n  display.print("Uptime: ");\n  display.print(millis()/1000);\n  display.println("s");\n  display.display();`
//   },
//   "ultrasonic": {
//     library: null, includes: [],
//     defines: (p) => [`#define TRIG_PIN ${p.trig}`, `#define ECHO_PIN ${p.echo}`],
//     globals: [],
//     setup: ['pinMode(TRIG_PIN, OUTPUT);', 'pinMode(ECHO_PIN, INPUT);'],
//     loop: `\n  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  long duration = pulseIn(ECHO_PIN, HIGH);\n  float distance = duration * 0.034 / 2;\n  Serial.print("Distance: "); Serial.print(distance); Serial.println(" cm");`
//   },
//   "dc-motor": {
//     library: null, includes: [],
//     defines: (p) => [`#define MOTOR_ENA ${p.ena}`, `#define MOTOR_IN1 ${p.in1}`, `#define MOTOR_IN2 ${p.in2}`],
//     globals: [],
//     setup: ['pinMode(MOTOR_ENA, OUTPUT);', 'pinMode(MOTOR_IN1, OUTPUT);', 'pinMode(MOTOR_IN2, OUTPUT);'],
//     loop: ``
//   },
//   "stepper": {
//     library: "Stepper",
//     includes: ['#include <Stepper.h>'],
//     defines: (p) => [
//       `#define STEPPER_IN1 ${p.in1}`, `#define STEPPER_IN2 ${p.in2}`,
//       `#define STEPPER_IN3 ${p.in3}`, `#define STEPPER_IN4 ${p.in4}`,
//       '#define STEPS_PER_REV 2048'
//     ],
//     globals: ['Stepper stepper(STEPS_PER_REV, STEPPER_IN1, STEPPER_IN3, STEPPER_IN2, STEPPER_IN4);'],
//     setup: ['stepper.setSpeed(10);'],
//     loop: ``
//   },
//   "current-sensor": {
//     library: null, includes: [],
//     defines: (p, boardType) => boardType === 'esp32'
//       ? [`#define CURRENT_PIN ${p}  // ESP32 ADC pin`]
//       : [`#define CURRENT_PIN ${p}`],
//     globals: [],
//     setup: [],
//     loop: `\n  int sensorValue = analogRead(CURRENT_PIN);\n  float voltage = sensorValue * (3.3 / 4095.0);\n  float current = (voltage - 1.65) / 0.185;\n  Serial.print("Current: "); Serial.print(current); Serial.println(" A");`
//   },
//   "mq2": {
//     library: null, includes: [],
//     defines: (p) => [
//       `#define MQ2_ANALOG  ${typeof p === 'object' ? p.analog  : p}`,
//       `#define MQ2_DIGITAL ${typeof p === 'object' ? p.digital : 5}`
//     ],
//     globals: [],
//     setup: ['pinMode(MQ2_DIGITAL, INPUT);'],
//     loop: `\n  int gasValue = analogRead(MQ2_ANALOG);\n  bool gasDetected = digitalRead(MQ2_DIGITAL) == LOW;\n  Serial.print("Gas Level: "); Serial.print(gasValue);\n  if(gasDetected) Serial.println(" - WARNING!");\n  else Serial.println(" - OK");`
//   },

//   // ── NEW templates for your Lab Board ─────────

//   "lan8720": {
//     library: "ETH (ESP32 built-in)",
//     includes: ['#include <ETH.h>'],
//     defines: () => [
//       '#define ETH_CLK_MODE  ETH_CLOCK_GPIO0_IN',
//       '#define ETH_PHY_ADDR  1',
//       '#define ETH_PHY_MDC   23',
//       '#define ETH_PHY_MDIO  18',
//       '#define ETH_PHY_POWER 16',
//       '#define ETH_PHY_TYPE  ETH_PHY_LAN8720'
//     ],
//     globals: [
//       'static bool eth_connected = false;',
//       'void EthEvent(WiFiEvent_t event) {',
//       '  if (event == ARDUINO_EVENT_ETH_CONNECTED) eth_connected = true;',
//       '  if (event == ARDUINO_EVENT_ETH_DISCONNECTED) eth_connected = false;',
//       '}'
//     ],
//     setup: [
//       'WiFi.onEvent(EthEvent);',
//       'ETH.begin(ETH_PHY_ADDR, ETH_PHY_POWER, ETH_PHY_MDC, ETH_PHY_MDIO, ETH_PHY_TYPE, ETH_CLK_MODE);'
//     ],
//     loop: `\n  if (eth_connected) {\n    Serial.print("LAN IP: "); Serial.println(ETH.localIP());\n  } else {\n    Serial.println("LAN: waiting for link...");\n  }`
//   },

//   "l298n": {
//     library: null,
//     includes: [],
//     defines: (p) => [
//       `#define L298N_ENA ${p.ena}`,
//       `#define L298N_IN1 ${p.in1}`,
//       `#define L298N_IN2 ${p.in2}`,
//       `#define L298N_ENB ${p.enb}`,
//       `#define L298N_IN3 ${p.in3}`,
//       `#define L298N_IN4 ${p.in4}`
//     ],
//     globals: [],
//     setup: [
//       'pinMode(L298N_ENA, OUTPUT);',
//       'pinMode(L298N_IN1, OUTPUT);',
//       'pinMode(L298N_IN2, OUTPUT);',
//       'pinMode(L298N_ENB, OUTPUT);',
//       'pinMode(L298N_IN3, OUTPUT);',
//       'pinMode(L298N_IN4, OUTPUT);',
//       '// Motor A & B initially stopped',
//       'digitalWrite(L298N_IN1, LOW); digitalWrite(L298N_IN2, LOW);',
//       'digitalWrite(L298N_IN3, LOW); digitalWrite(L298N_IN4, LOW);'
//     ],
//     loop: `\n  // Motor A Forward at speed 200\n  digitalWrite(L298N_IN1, HIGH); digitalWrite(L298N_IN2, LOW);\n  analogWrite(L298N_ENA, 200);\n  // Motor B Forward at speed 200\n  digitalWrite(L298N_IN3, HIGH); digitalWrite(L298N_IN4, LOW);\n  analogWrite(L298N_ENB, 200);\n  delay(2000);\n  // Stop both motors\n  digitalWrite(L298N_IN1, LOW); digitalWrite(L298N_IN2, LOW);\n  digitalWrite(L298N_IN3, LOW); digitalWrite(L298N_IN4, LOW);\n  delay(1000);\n  // Motor A Reverse\n  digitalWrite(L298N_IN1, LOW); digitalWrite(L298N_IN2, HIGH);\n  analogWrite(L298N_ENA, 150);\n  // Motor B Reverse\n  digitalWrite(L298N_IN3, LOW); digitalWrite(L298N_IN4, HIGH);\n  analogWrite(L298N_ENB, 150);\n  delay(2000);\n  // Stop both motors\n  digitalWrite(L298N_IN1, LOW); digitalWrite(L298N_IN2, LOW);\n  digitalWrite(L298N_IN3, LOW); digitalWrite(L298N_IN4, LOW);\n  delay(1000);`
//   },

//   "relay-2ch": {
//     library: null,
//     includes: [],
//     defines: (p) => [
//       `#define RELAY1_PIN ${p.ch1}`,
//       `#define RELAY2_PIN ${p.ch2}`
//     ],
//     globals: [],
//     setup: [
//       'pinMode(RELAY1_PIN, OUTPUT);',
//       'digitalWrite(RELAY1_PIN, HIGH);  // HIGH = OFF (active-low)',
//       'pinMode(RELAY2_PIN, OUTPUT);',
//       'digitalWrite(RELAY2_PIN, HIGH);  // HIGH = OFF (active-low)'
//     ],
//     loop: `\n  digitalWrite(RELAY1_PIN, LOW);  delay(1000);  // Relay 1 ON\n  digitalWrite(RELAY1_PIN, HIGH); delay(1000);  // Relay 1 OFF\n  digitalWrite(RELAY2_PIN, LOW);  delay(1000);  // Relay 2 ON\n  digitalWrite(RELAY2_PIN, HIGH); delay(1000);  // Relay 2 OFF`
//   },

//   "led-blue": {
//     library: null, includes: [],
//     defines: (p) => [`#define LED_BLUE ${p}`],
//     globals: [],
//     setup: ['pinMode(LED_BLUE, OUTPUT);', 'digitalWrite(LED_BLUE, LOW);'],
//     loop: `\n  digitalWrite(LED_BLUE, HIGH); delay(300);\n  digitalWrite(LED_BLUE, LOW);  delay(300);`
//   },

//   "led-yellow": {
//     library: null, includes: [],
//     defines: (p) => [`#define LED_YELLOW ${p}`],
//     globals: [],
//     setup: ['pinMode(LED_YELLOW, OUTPUT);', 'digitalWrite(LED_YELLOW, LOW);'],
//     loop: `\n  digitalWrite(LED_YELLOW, HIGH); delay(300);\n  digitalWrite(LED_YELLOW, LOW);  delay(300);`
//   },

//   "led-white": {
//     library: null, includes: [],
//     defines: (p) => [`#define LED_WHITE ${p}`],
//     globals: [],
//     setup: ['pinMode(LED_WHITE, OUTPUT);', 'digitalWrite(LED_WHITE, LOW);'],
//     loop: `\n  digitalWrite(LED_WHITE, HIGH); delay(300);\n  digitalWrite(LED_WHITE, LOW);  delay(300);`
//   },

//   "potentiometer": {
//     library: null, includes: [],
//     defines: (p, boardType) => boardType === 'esp32'
//       ? [`#define POT_PIN ${p}  // ESP32 ADC (use 34/35/36/39 input-only pins)`]
//       : [`#define POT_PIN ${p}`],
//     globals: [],
//     setup: [],
//     loop: `\n  int potValue = analogRead(POT_PIN);              // 0 - 4095 on ESP32\n  int mapped  = map(potValue, 0, 4095, 0, 100);\n  Serial.print("Pot: "); Serial.print(potValue);\n  Serial.print("  -> "); Serial.print(mapped); Serial.println("%");`
//   },

//   "led-with-pot": {
//     library: null, includes: [],
//     defines: (p) => [
//       `#define LED_PWM_PIN ${p.led}`,
//       `#define POT_ADC_PIN ${p.pot}  // ESP32 input-only ADC pin (34/35/36/39)`
//     ],
//     globals: [
//       'const int PWM_CHANNEL   = 0;',
//       'const int PWM_FREQ      = 5000;',
//       'const int PWM_RESOLUTION = 8;    // 8-bit -> 0-255'
//     ],
//     setup: [
//       'ledcSetup(PWM_CHANNEL, PWM_FREQ, PWM_RESOLUTION);',
//       'ledcAttachPin(LED_PWM_PIN, PWM_CHANNEL);'
//     ],
//     loop: `\n  int potValue   = analogRead(POT_ADC_PIN);         // 0 - 4095\n  int brightness = map(potValue, 0, 4095, 0, 255);  // scale to 8-bit PWM\n  ledcWrite(PWM_CHANNEL, brightness);\n  Serial.print("Pot: "); Serial.print(potValue);\n  Serial.print("  Brightness: "); Serial.println(brightness);`
//   }
// };





const ARDUINO_DATABASE = {
  "ESP-LAB": {
    id: "ESP-LAB", name: "Lab Training Board", board: "esp32", fqbn: "esp32:esp32:esp32",
    location: "Lab", boardImage: "🖥️", boardType: "esp32",
    connectedComponents: [
      { id: "lan8720",      pin: { mdc: 23, mdio: 18, power: 16, addr: 1 },                 label: "LAN8720 Ethernet Module"       },
      { id: "l298n",        pin: { ena: 14, in1: 27, in2: 26, enb: 25, in3: 33, in4: 32 },  label: "L298N Dual Motor Driver"       },
      { id: "buzzer",       pin: 19,                                                          label: "Piezo Buzzer"                  },
      { id: "ldr",          pin: 34,                                                          label: "LDR Light Sensor"              },
      { id: "led-red",      pin: 21,                                                          label: "LED Red"                       },
      { id: "led-green",    pin: 22,                                                          label: "LED Green"                     },
      { id: "led-blue",     pin: 5,                                                           label: "LED Blue"                      },
      { id: "led-yellow",   pin: 15,                                                          label: "LED Yellow"                    },
      { id: "led-with-pot", pin: { led: 2, pot: 35 },                                        label: "LED with Potentiometer"        },
      { id: "dht11",        pin: 4,                                                           label: "DHT11 Temp & Humidity Sensor"  },
      { id: "oled",         pin: "I2C",                                                       label: "OLED 128x64 Display (I2C)"     },
      { id: "relay-2ch",    pin: { ch1: 12, ch2: 13 },                                       label: "2-Channel Relay Module"        }
    ]
  }
};

const COMPONENT_ICONS = {
  "lan8720":      "🌐",
  "l298n":        "🚗",
  "buzzer":       "🔔",
  "ldr":          "💡",
  "led-red":      "🔴",
  "led-green":    "🟢",
  "led-blue":     "🔵",
  "led-yellow":   "🟡",
  "led-with-pot": "🎛️",
  "dht11":        "🌡️",
  "oled":         "📺",
  "relay-2ch":    "⚡"
};

const COMPONENT_TEMPLATES = {

  "lan8720": {
    library: "ETH (ESP32 Built-in)",
    includes: ['#include <ETH.h>'],
    defines: () => [
      '#define ETH_CLK_MODE  ETH_CLOCK_GPIO0_IN',
      '#define ETH_PHY_ADDR  1',
      '#define ETH_PHY_MDC   23',
      '#define ETH_PHY_MDIO  18',
      '#define ETH_PHY_POWER 16',
      '#define ETH_PHY_TYPE  ETH_PHY_LAN8720'
    ],
    globals: [
      'static bool eth_connected = false;',
      'void EthEvent(WiFiEvent_t event) {',
      '  if (event == ARDUINO_EVENT_ETH_CONNECTED)    eth_connected = true;',
      '  if (event == ARDUINO_EVENT_ETH_DISCONNECTED) eth_connected = false;',
      '}'
    ],
    setup: [
      'WiFi.onEvent(EthEvent);',
      'ETH.begin(ETH_PHY_ADDR, ETH_PHY_POWER, ETH_PHY_MDC, ETH_PHY_MDIO, ETH_PHY_TYPE, ETH_CLK_MODE);',
      'Serial.println("LAN8720: Waiting for Ethernet link...");'
    ],
    loop: `\n  if (eth_connected) {\n    Serial.print("LAN8720 IP Address: ");\n    Serial.println(ETH.localIP());\n  } else {\n    Serial.println("LAN8720: No Ethernet link yet...");\n  }`
  },

  "l298n": {
    library: null,
    includes: [],
    defines: (p) => [
      `#define L298N_ENA ${p.ena}   // Motor A Speed (PWM)`,
      `#define L298N_IN1 ${p.in1}   // Motor A Direction 1`,
      `#define L298N_IN2 ${p.in2}   // Motor A Direction 2`,
      `#define L298N_ENB ${p.enb}   // Motor B Speed (PWM)`,
      `#define L298N_IN3 ${p.in3}   // Motor B Direction 1`,
      `#define L298N_IN4 ${p.in4}   // Motor B Direction 2`
    ],
    globals: [],
    setup: [
      'pinMode(L298N_ENA, OUTPUT);',
      'pinMode(L298N_IN1, OUTPUT);',
      'pinMode(L298N_IN2, OUTPUT);',
      'pinMode(L298N_ENB, OUTPUT);',
      'pinMode(L298N_IN3, OUTPUT);',
      'pinMode(L298N_IN4, OUTPUT);',
      '// Start with both motors stopped',
      'digitalWrite(L298N_IN1, LOW); digitalWrite(L298N_IN2, LOW);',
      'digitalWrite(L298N_IN3, LOW); digitalWrite(L298N_IN4, LOW);',
      'Serial.println("L298N Motor Driver Ready");'
    ],
    loop: `\n  // ---- Motor A Forward ----\n  Serial.println("Motor A & B: Forward");\n  digitalWrite(L298N_IN1, HIGH); digitalWrite(L298N_IN2, LOW);\n  analogWrite(L298N_ENA, 200);\n  digitalWrite(L298N_IN3, HIGH); digitalWrite(L298N_IN4, LOW);\n  analogWrite(L298N_ENB, 200);\n  delay(2000);\n  // ---- Stop ----\n  Serial.println("Motor A & B: Stop");\n  digitalWrite(L298N_IN1, LOW); digitalWrite(L298N_IN2, LOW);\n  digitalWrite(L298N_IN3, LOW); digitalWrite(L298N_IN4, LOW);\n  delay(1000);\n  // ---- Motor A & B Reverse ----\n  Serial.println("Motor A & B: Reverse");\n  digitalWrite(L298N_IN1, LOW); digitalWrite(L298N_IN2, HIGH);\n  analogWrite(L298N_ENA, 150);\n  digitalWrite(L298N_IN3, LOW); digitalWrite(L298N_IN4, HIGH);\n  analogWrite(L298N_ENB, 150);\n  delay(2000);\n  // ---- Stop ----\n  Serial.println("Motor A & B: Stop");\n  digitalWrite(L298N_IN1, LOW); digitalWrite(L298N_IN2, LOW);\n  digitalWrite(L298N_IN3, LOW); digitalWrite(L298N_IN4, LOW);\n  delay(1000);`
  },

  "buzzer": {
    library: null,
    includes: [],
    defines: (p) => [`#define BUZZER_PIN ${p}   // Piezo Buzzer Pin`],
    globals: [],
    setup: [
      'pinMode(BUZZER_PIN, OUTPUT);',
      'digitalWrite(BUZZER_PIN, LOW);',
      'Serial.println("Buzzer Ready");'
    ],
    loop: `\n  Serial.println("Buzzer: Beep ON");\n  tone(BUZZER_PIN, 1000);  // 1kHz tone\n  delay(300);\n  noTone(BUZZER_PIN);\n  Serial.println("Buzzer: Beep OFF");\n  delay(700);`
  },

  "ldr": {
    library: null,
    includes: [],
    defines: (p) => [
      `#define LDR_PIN ${p}   // LDR Analog Input (ESP32 ADC input-only pin)`
    ],
    globals: [],
    setup: [
      'Serial.println("LDR Light Sensor Ready");'
    ],
    loop: `\n  int ldrRaw = analogRead(LDR_PIN);           // 0 (dark) - 4095 (bright)\n  int ldrPct = map(ldrRaw, 0, 4095, 0, 100); // convert to percentage\n  Serial.print("LDR Raw: "); Serial.print(ldrRaw);\n  Serial.print("  Light Level: "); Serial.print(ldrPct); Serial.println("%");\n  if (ldrRaw < 1000) Serial.println("LDR Status: DARK");\n  else if (ldrRaw < 3000) Serial.println("LDR Status: DIM");\n  else Serial.println("LDR Status: BRIGHT");`
  },

  "led-red": {
    library: null,
    includes: [],
    defines: (p) => [`#define LED_RED_PIN ${p}   // Red LED`],
    globals: [],
    setup: [
      'pinMode(LED_RED_PIN, OUTPUT);',
      'digitalWrite(LED_RED_PIN, LOW);',
      'Serial.println("LED Red Ready");'
    ],
    loop: `\n  Serial.println("LED Red: ON");\n  digitalWrite(LED_RED_PIN, HIGH);\n  delay(500);\n  Serial.println("LED Red: OFF");\n  digitalWrite(LED_RED_PIN, LOW);\n  delay(500);`
  },

  "led-green": {
    library: null,
    includes: [],
    defines: (p) => [`#define LED_GREEN_PIN ${p}   // Green LED`],
    globals: [],
    setup: [
      'pinMode(LED_GREEN_PIN, OUTPUT);',
      'digitalWrite(LED_GREEN_PIN, LOW);',
      'Serial.println("LED Green Ready");'
    ],
    loop: `\n  Serial.println("LED Green: ON");\n  digitalWrite(LED_GREEN_PIN, HIGH);\n  delay(500);\n  Serial.println("LED Green: OFF");\n  digitalWrite(LED_GREEN_PIN, LOW);\n  delay(500);`
  },

  "led-blue": {
    library: null,
    includes: [],
    defines: (p) => [`#define LED_BLUE_PIN ${p}   // Blue LED`],
    globals: [],
    setup: [
      'pinMode(LED_BLUE_PIN, OUTPUT);',
      'digitalWrite(LED_BLUE_PIN, LOW);',
      'Serial.println("LED Blue Ready");'
    ],
    loop: `\n  Serial.println("LED Blue: ON");\n  digitalWrite(LED_BLUE_PIN, HIGH);\n  delay(500);\n  Serial.println("LED Blue: OFF");\n  digitalWrite(LED_BLUE_PIN, LOW);\n  delay(500);`
  },

  "led-yellow": {
    library: null,
    includes: [],
    defines: (p) => [`#define LED_YELLOW_PIN ${p}   // Yellow LED`],
    globals: [],
    setup: [
      'pinMode(LED_YELLOW_PIN, OUTPUT);',
      'digitalWrite(LED_YELLOW_PIN, LOW);',
      'Serial.println("LED Yellow Ready");'
    ],
    loop: `\n  Serial.println("LED Yellow: ON");\n  digitalWrite(LED_YELLOW_PIN, HIGH);\n  delay(500);\n  Serial.println("LED Yellow: OFF");\n  digitalWrite(LED_YELLOW_PIN, LOW);\n  delay(500);`
  },

  "led-with-pot": {
    library: null,
    includes: [],
    defines: (p) => [
      `#define LED_PWM_PIN  ${p.led}   // LED controlled by Potentiometer (PWM)`,
      `#define POT_ADC_PIN  ${p.pot}   // Potentiometer Analog Input (ESP32 ADC input-only pin)`
    ],
    globals: [
      '// ESP32 LEDC PWM settings for LED brightness control',
      'const int PWM_CHANNEL    = 0;    // LEDC channel (0-15)',
      'const int PWM_FREQ       = 5000; // PWM frequency in Hz',
      'const int PWM_RESOLUTION = 8;    // 8-bit resolution (0-255)'
    ],
    setup: [
      'ledcSetup(PWM_CHANNEL, PWM_FREQ, PWM_RESOLUTION);',
      'ledcAttachPin(LED_PWM_PIN, PWM_CHANNEL);',
      'Serial.println("LED + Potentiometer Ready");',
      'Serial.println("Rotate pot to change LED brightness");'
    ],
    loop: `\n  int potRaw     = analogRead(POT_ADC_PIN);         // 0 - 4095\n  int brightness = map(potRaw, 0, 4095, 0, 255);   // scale to 8-bit PWM\n  ledcWrite(PWM_CHANNEL, brightness);\n  Serial.print("Potentiometer: "); Serial.print(potRaw);\n  Serial.print("  LED Brightness: "); Serial.print(brightness);\n  Serial.print("/255  ("); Serial.print(map(brightness,0,255,0,100)); Serial.println("%)")`
  },

  "dht11": {
    library: "DHT sensor library",
    includes: ['#include <DHT.h>'],
    defines: (p) => [
      `#define DHT11_PIN  ${p}   // DHT11 Data Pin`,
      `#define DHT_TYPE   DHT11`
    ],
    globals: ['DHT dht(DHT11_PIN, DHT_TYPE);'],
    setup: [
      'dht.begin();',
      'Serial.println("DHT11 Temperature & Humidity Sensor Ready");'
    ],
    loop: `\n  float humidity    = dht.readHumidity();\n  float temperature = dht.readTemperature();  // Celsius\n  if (isnan(humidity) || isnan(temperature)) {\n    Serial.println("DHT11 Error: Failed to read sensor!");\n  } else {\n    Serial.print("DHT11 Temperature: "); Serial.print(temperature); Serial.println(" °C");\n    Serial.print("DHT11 Humidity   : "); Serial.print(humidity);    Serial.println(" %");\n    float heatIndex = dht.computeHeatIndex(temperature, humidity, false);\n    Serial.print("DHT11 Heat Index : "); Serial.print(heatIndex); Serial.println(" °C");\n  }`
  },

  "oled": {
    library: "Adafruit SSD1306",
    includes: [
      '#include <Wire.h>',
      '#include <Adafruit_GFX.h>',
      '#include <Adafruit_SSD1306.h>'
    ],
    defines: () => [
      '#define SCREEN_WIDTH  128   // OLED display width in pixels',
      '#define SCREEN_HEIGHT  64   // OLED display height in pixels',
      '#define OLED_RESET     -1   // Reset pin (-1 = share Arduino reset pin)',
      '#define OLED_ADDRESS 0x3C   // I2C address (0x3C or 0x3D)'
    ],
    globals: [
      'Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);'
    ],
    setup: [
      'Wire.begin();',
      'if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {',
      '  Serial.println("OLED Error: SSD1306 not found! Check wiring.");',
      '  while (1);',
      '}',
      'display.clearDisplay();',
      'display.setTextSize(1);',
      'display.setTextColor(SSD1306_WHITE);',
      'display.setCursor(0, 0);',
      'display.println("  Lab Training Board");',
      'display.println("  ESP32-WROOM-32D");',
      'display.println("--------------------");',
      'display.println("  System Ready!");',
      'display.display();',
      'Serial.println("OLED 128x64 Display Ready");'
    ],
    loop: `\n  display.clearDisplay();\n  display.setTextSize(1);\n  display.setCursor(0, 0);\n  display.println("Lab Training Board");\n  display.println("-------------------");\n  display.print("Uptime: ");\n  display.print(millis() / 1000);\n  display.println(" sec");\n  display.print("Free RAM: ");\n  display.print(ESP.getFreeHeap());\n  display.println(" B");\n  display.display();`
  },

  "relay-2ch": {
    library: null,
    includes: [],
    defines: (p) => [
      `#define RELAY1_PIN ${p.ch1}   // Relay Channel 1 (active-LOW)`,
      `#define RELAY2_PIN ${p.ch2}   // Relay Channel 2 (active-LOW)`
    ],
    globals: [],
    setup: [
      'pinMode(RELAY1_PIN, OUTPUT);',
      'digitalWrite(RELAY1_PIN, HIGH);  // HIGH = OFF for active-low relay',
      'pinMode(RELAY2_PIN, OUTPUT);',
      'digitalWrite(RELAY2_PIN, HIGH);  // HIGH = OFF for active-low relay',
      'Serial.println("2-Channel Relay Module Ready (Active-LOW)");'
    ],
    loop: `\n  Serial.println("Relay 1: ON");\n  digitalWrite(RELAY1_PIN, LOW);   // LOW  = ON\n  delay(1000);\n  Serial.println("Relay 1: OFF");\n  digitalWrite(RELAY1_PIN, HIGH);  // HIGH = OFF\n  delay(500);\n  Serial.println("Relay 2: ON");\n  digitalWrite(RELAY2_PIN, LOW);   // LOW  = ON\n  delay(1000);\n  Serial.println("Relay 2: OFF");\n  digitalWrite(RELAY2_PIN, HIGH);  // HIGH = OFF\n  delay(500);`
  }

};


const generateCode = (arduino, components) => {
  if (!arduino || components.length === 0) {
    return `// Arduino Code Dumper\n// Select components to generate code\n\nvoid setup() {\n  Serial.begin(9600);\n  Serial.println("Ready");\n}\n\nvoid loop() {\n  delay(1000);\n}`;
  }

  let includes = new Set(), defines = [], globals = [], setupCode = [], loopCode = [];
  
  if (arduino.boardType === 'esp32') {
    setupCode.push('Serial.begin(115200);');
    setupCode.push('delay(1000);  // Give ESP32 time to initialize');
  } else {
    setupCode.push('Serial.begin(9600);');
  }

  components.forEach(comp => {
    const t = COMPONENT_TEMPLATES[comp.id];
    if (!t) return;
    t.includes.forEach(i => includes.add(i));
    defines.push(...t.defines(comp.pin, arduino.boardType));
    globals.push(...t.globals);
    setupCode.push(...t.setup);
    if (t.loop) loopCode.push(t.loop);
  });

  let code = `/*\n * Device: ${arduino.id} - ${arduino.name}\n * Board: ${arduino.board} (${arduino.fqbn})\n * Board Type: ${arduino.boardType.toUpperCase()}\n * Location: ${arduino.location}\n * Generated: ${new Date().toISOString()}\n * Components: ${components.map(c => c.label).join(', ')}\n */\n\n`;

  if (includes.size > 0) code += Array.from(includes).join('\n') + '\n\n';
  if (defines.length > 0) code += defines.join('\n') + '\n\n';
  if (globals.length > 0) code += globals.join('\n') + '\n\n';

  code += `void setup() {\n  ${setupCode.join('\n  ')}\n  Serial.println("${arduino.name} Ready");\n}\n\n`;
  code += `void loop() {`;
  if (loopCode.length > 0) code += loopCode.join('\n');
  code += `\n  delay(1000);\n}\n`;

  return code;
};


// ============================================================================
// GEMINI AI CODE GENERATOR
// ============================================================================
const generateCodeWithGemini = async (arduino, components) => {
  const apiKey = process.env.REACT_APP_GEMINI_KEY;
  if (!apiKey) throw new Error("REACT_APP_GEMINI_KEY not set in .env");
  if (!arduino || components.length === 0) throw new Error("No components selected.");

  const componentDetails = components.map(comp => {
    const pinInfo = typeof comp.pin === 'object' && !Array.isArray(comp.pin)
      ? Object.entries(comp.pin).map(([k, v]) => `${k}=${v}`).join(', ')
      : `pin=${comp.pin}`;
    return `- ${comp.label} (id: ${comp.id}, ${pinInfo})`;
  }).join('\n');

  const libraryHints = components.map(comp => {
    const t = COMPONENT_TEMPLATES[comp.id];
    return t?.library ? `- ${comp.label}: requires "${t.library}"` : null;
  }).filter(Boolean).join('\n');

 const prompt = `You are an expert ESP32/Arduino firmware engineer. Generate production-ready Arduino .ino code.

REFERENCE EXAMPLE - Match this exact style and quality:
/*
 * Device: ESP-LAB - Lab Training Board
 * Board: esp32 (esp32:esp32:esp32)
 * Board Type: ESP32
 * Location: Lab
 * Generated: 2026-01-01T00:00:00.000Z
 * Components: LED Red, Buzzer
 */
#include <DHT.h>

#define LED_RED_PIN 21
#define BUZZER_PIN 19

void setup() {
  Serial.begin(115200);
  delay(1000);
  pinMode(LED_RED_PIN, OUTPUT);
  digitalWrite(LED_RED_PIN, LOW);
  Serial.println("LED Red Ready");
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  Serial.println("Buzzer Ready");
  Serial.println("Lab Training Board Ready");
}

void loop() {
  digitalWrite(LED_RED_PIN, HIGH);
  Serial.println("LED Red: ON");
  delay(500);
  digitalWrite(LED_RED_PIN, LOW);
  Serial.println("LED Red: OFF");
  delay(500);
  tone(BUZZER_PIN, 1000);
  Serial.println("Buzzer: ON");
  delay(300);
  noTone(BUZZER_PIN);
  Serial.println("Buzzer: OFF");
  delay(700);
  delay(1000);
}

NOW GENERATE CODE FOR:
BOARD:
- Device: ${arduino.id} - ${arduino.name}
- Board: ${arduino.board}, FQBN: ${arduino.fqbn}
- Type: ${arduino.boardType.toUpperCase()}
- Location: ${arduino.location}

COMPONENTS (use EXACT pins):
${componentDetails}

REQUIRED LIBRARIES:
${libraryHints || '- None'}

STRICT RULES:
1. Match the exact style of the reference example above
2. Header comment block at top with exact device details and current timestamp: ${new Date().toISOString()}
3. Serial.begin(115200) then immediately delay(1000)
4. #define for all pin definitions
5. Simple digitalWrite for plain LEDs — NEVER ledcSetup/ledcAttachPin for simple LEDs
6. LEDC PWM only for led-with-pot component
7. Active-LOW relays: HIGH=OFF, LOW=ON, initialize HIGH
8. ESP32 ADC pins 34,35,36,39 are INPUT ONLY — never pinMode OUTPUT
9. DHT: use isnan() error check
10. OLED: I2C address 0x3C, Wire.h + Adafruit_GFX.h + Adafruit_SSD1306.h
11. LAN8720: ETH.h, WiFi.onEvent for connection events
12. Short Serial messages: "LED Green: ON" not "Turning LED Green Pin 22 ON"
13. Short delays: 500ms for LEDs, 300ms for buzzer, 1000ms for relays
14. NEVER use while(!Serial) — freezes ESP32
15. NEVER add demo sequences like both-on-together or combined actions
16. Sequential simple loop — one component action at a time

Return ONLY the .ino code. No markdown, no backticks, no explanation.`;

  const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
      })
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${err?.error?.message || `HTTP ${response.status}`}`);
  }

  const data = await response.json();
  let code = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!code.trim()) throw new Error("Gemini returned empty response.");
  code = code.replace(/^```(?:cpp|arduino|c\+\+)?\n?/gm, '').replace(/^```\s*$/gm, '').trim();
  return code;
};


const injectStyles = () => {
  if (document.getElementById('ard-dumper-css')) return;
  const s = document.createElement('style');
  s.id = 'ard-dumper-css';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
    @keyframes ardModalIn { from { opacity:0; transform:translateY(30px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
    @keyframes ardFadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes ardPopIn { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
    @keyframes ardSlideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    @keyframes ardBounce { 0%{ transform:scale(0.4); opacity:0; } 60%{ transform:scale(1.06); } 100%{ transform:scale(1); opacity:1; } }
    @keyframes ardPulse { 0%, 100% { opacity:1; } 50% { opacity:0.5; } }
    @keyframes ardSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
    @keyframes ardShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .ard-drag-tile:hover { transform:translateY(-3px) scale(1.08) !important; box-shadow:0 8px 20px rgba(37,99,235,0.14) !important; border-color:#93c5fd !important; }
    .ard-drag-tile:active { transform:scale(0.92) !important; }
    .ard-chip:hover .ard-chip-x { opacity:1 !important; }
    .ard-code-ln:hover { background:rgba(37,99,235,0.03) !important; }
    .ard-log:hover { background:rgba(37,99,235,0.025) !important; }
    * { box-sizing:border-box; }
    ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:#d4d8e0; border-radius:3px; } ::-webkit-scrollbar-thumb:hover { background:#a0a6b4; }
  `;
  document.head.appendChild(s);
};

// ============================================================================
// MAIN APP
// ============================================================================
export default function ArduinoDumper() {
  const [showIdModal, setShowIdModal] = useState(true);
  const [modalInput, setModalInput] = useState('');
  const [modalError, setModalError] = useState('');

  const [selectedArduino, setSelectedArduino] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [editableCode, setEditableCode] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('visual');

  const [agentConnected, setAgentConnected] = useState(false);
  const [uploadPhase, setUploadPhase] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [availablePorts, setAvailablePorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [serialLog, setSerialLog] = useState([]);


  // AI generation state
  const [codeGenMode, setCodeGenMode] = useState('manual'); // 'manual' | 'ai'
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiGenerated, setAiGenerated] = useState(false);


  // Flash timing
  const [flashStartTime, setFlashStartTime] = useState(null);
  const [flashElapsed, setFlashElapsed] = useState(0);

  // Setup state
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupPhase, setSetupPhase] = useState('idle');
  const [setupSteps, setSetupSteps] = useState({
    arduino_cli: { status: 'pending', progress: 0, message: 'Waiting...' },
    core_index: { status: 'pending', progress: 0, message: 'Waiting...' },
    avr_core: { status: 'pending', progress: 0, message: 'Waiting...' },
    esp32_core: { status: 'pending', progress: 0, message: 'Waiting...' }
  });
  const [needsSetup, setNeedsSetup] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const [draggingComp, setDraggingComp] = useState(null);
  const [dragOverDrop, setDragOverDrop] = useState(false);



  const wsRef = useRef(null);
  const logEndRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => { injectStyles(); }, []);

  const addLog = useCallback((msg, type = 'info') => {
    setSerialLog(prev => [...prev.slice(-100), { timestamp: new Date().toLocaleTimeString(), message: msg, type }]);
  }, []);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [serialLog]);

  useEffect(() => {
    const c = generateCode(selectedArduino, selectedComponents);
    setGeneratedCode(c);
    if (!isEditMode) setEditableCode(c);
  }, [selectedArduino, selectedComponents, isEditMode]);

  // Flash timer
  useEffect(() => {
    if (flashStartTime && uploadPhase !== 'idle' && uploadPhase !== 'success' && uploadPhase !== 'error') {
      timerRef.current = setInterval(() => {
        setFlashElapsed(((Date.now() - flashStartTime) / 1000).toFixed(1));
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [flashStartTime, uploadPhase]);


  // Auto-generate AI code when mode switches to 'ai' and components are selected
  useEffect(() => {
    if (codeGenMode === 'ai' && selectedComponents.length > 0 && selectedArduino) {
      setAiGenerated(false);
      setAiError('');
      setIsGeneratingAI(true);
      addLog('✨ Generating AI code with Gemini...', 'info');
      generateCodeWithGemini(selectedArduino, selectedComponents)
        .then(code => {
          setGeneratedCode(code);
          setEditableCode(code);
          setAiGenerated(true);
          addLog('✨ AI code generated successfully!', 'success');
          setActiveTab('code');
        })
        .catch(err => {
          setAiError(err.message);
          addLog(`AI generation failed: ${err.message}`, 'error');
          setCodeGenMode('manual'); // fall back to manual on error
        })
        .finally(() => setIsGeneratingAI(false));
    }
    if (codeGenMode === 'manual') {
      const c = generateCode(selectedArduino, selectedComponents);
      setGeneratedCode(c);
      if (!isEditMode) setEditableCode(c);
      setAiGenerated(false);
      setAiError('');
    }
  }, [codeGenMode]);


  // ========== WEBSOCKET CONNECTION ==========
  const connectToAgent = useCallback((skipSetupCheck = false) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    if (!skipSetupCheck) {
      setIsReconnecting(true);
      addLog('Connecting to Flash Agent...', 'info');
    }
    
    const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8765';
    // const wsUrl = 'ws://localhost:8765';
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => { 
        setAgentConnected(true); 
        setIsReconnecting(false);
        wsRef.current = ws; 
        addLog('Connected to Flash Agent', 'success'); 
      };
      
      ws.onmessage = (e) => { 
        try { 
          handleAgentMessage(JSON.parse(e.data)); 
        } catch (err) { 
          addLog(`Parse error: ${err.message}`, 'error'); 
        } 
      };
      
      ws.onerror = () => { 
        addLog('Connection error - is Flash Agent running?', 'error'); 
        setAgentConnected(false); 
        setIsReconnecting(false);
      };
      
      ws.onclose = () => { 
        wsRef.current = null; 
        setAgentConnected(false); 
        setIsReconnecting(false);
        addLog('Disconnected from Flash Agent', 'warning'); 
      };
    } catch (e) { 
      setIsReconnecting(false);
      addLog(`Failed: ${e.message}`, 'error'); 
    }
  }, [addLog]);

  const handleAgentMessage = useCallback((data) => {
    switch (data.type) {
      case 'connected': 
        addLog(`Flash Agent v${data.version} ready (Fast Flash)`);
        setNeedsSetup(data.needs_setup);
        if (data.needs_setup) {
          setShowSetupModal(true);
          setSetupPhase('waiting');
          addLog('First-time setup required', 'warning');
        } else {
          wsRef.current.send(JSON.stringify({ type: 'list_ports' }));
        }
        break;
        
      case 'setup_start':
        setSetupPhase('running');
        addLog('Starting setup...', 'info');
        break;
        
      case 'setup_progress':
        setSetupSteps(prev => ({
          ...prev,
          [data.step]: {
            status: data.status === 'success' ? 'complete' : 
                   data.status === 'error' ? 'error' : 'running',
            progress: data.progress,
            message: data.message
          }
        }));
        addLog(data.message, data.status);
        break;
        
      case 'setup_complete':
        setSetupPhase('complete');
        addLog('Setup complete!', 'success');
        setTimeout(() => {
          setShowSetupModal(false);
          setNeedsSetup(false);
          wsRef.current.send(JSON.stringify({ type: 'list_ports' }));
        }, 2000);
        break;
        
      case 'setup_error':
        setSetupPhase('error');
        addLog(data.message, 'error');
        break;
      
      case 'ports': 
        setAvailablePorts(data.ports || []); 
        if (data.ports && data.ports.length > 0 && !selectedPort) {
          const preferredPort = data.ports.find(p => p.is_esp32 || p.is_arduino) || data.ports[0];
          setSelectedPort(preferredPort.port);
        }
        addLog(`Found ${data.ports?.length || 0} port(s)`); 
        break;
        
      case 'compile_start': 
        setUploadPhase('compiling'); 
        setUploadProgress(10); 
        setUploadMessage(data.message || 'Compiling...'); 
        addLog(data.message || 'Compiling...'); 
        break;
        
      case 'compile_progress': 
        setUploadProgress(data.progress || 30); 
        setUploadMessage(data.message || 'Compiling...');
        addLog(data.message); 
        break;
        
      case 'compile_complete': 
        setUploadProgress(50); 
        setUploadMessage(data.message || 'Compiled ✓'); 
        addLog(data.message || 'Compiled', 'success'); 
        break;
        
      case 'compile_error': 
        setUploadPhase('error'); 
        setUploadMessage('Compile error'); 
        setFlashStartTime(null);
        addLog(`Compile error: ${data.error}`, 'error'); 
        break;
        
      case 'upload_start': 
        setUploadPhase('uploading'); 
        setUploadProgress(60); 
        setUploadMessage(data.message || 'Uploading...'); 
        addLog(data.message || 'Uploading...'); 
        break;
        
      case 'upload_progress': 
        setUploadProgress(60 + (data.progress * 0.3)); 
        break;
        
      case 'upload_complete': 
        setUploadProgress(95); 
        addLog(data.message || 'Upload complete', 'success'); 
        break;
        
      case 'upload_error': 
        setUploadPhase('error'); 
        setUploadMessage('Upload failed'); 
        setFlashStartTime(null);
        addLog(`Upload error: ${data.error}`, 'error'); 
        break;
        
      case 'verify_complete': 
        setUploadPhase('success'); 
        setUploadProgress(100); 
        setUploadMessage(data.message || 'Success!'); 
        setFlashStartTime(null);
        addLog(data.message || 'Flashed!', 'success'); 
        setTimeout(() => { 
          setUploadPhase('idle'); 
          setUploadProgress(0); 
          setUploadMessage(''); 
          setFlashElapsed(0);
        }, 3000); 
        break;
        
      case 'error': 
        addLog(`Error: ${data.message}`, 'error'); 
        setFlashStartTime(null);
        break;
        
      default: 
        break;
    }
  }, [addLog, selectedPort]);

  // Auto-connect on mount
  useEffect(() => {
    const timer = setTimeout(() => { connectToAgent(); }, 500);
    return () => {
      clearTimeout(timer);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectToAgent]);

  const startSetup = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      setSetupPhase('running');
      wsRef.current.send(JSON.stringify({ type: 'setup' }));
    }
  }, []);

  const uploadCode = useCallback(() => {
    if (uploadPhase === 'error') {
  setUploadPhase('idle');
  setUploadProgress(0);
  setUploadMessage('');
}

    if (!selectedArduino || selectedComponents.length === 0) { 
      addLog('Select components first', 'error'); 
      return; 
    }
    if (!agentConnected) { 
      addLog('Flash Agent not connected', 'error'); 
      connectToAgent();
      return; 
    }
    if (!selectedPort) { 
      addLog('No serial port selected', 'error'); 
      return; 
    }
    
    const code = isEditMode ? editableCode : generatedCode;
    const libs = selectedComponents.map(c => COMPONENT_TEMPLATES[c.id]?.library).filter(Boolean);
    
    // Start timing
    setFlashStartTime(Date.now());
    setFlashElapsed(0);
    setUploadPhase('compiling'); 
    setUploadProgress(5); 
    setUploadMessage('Starting...');
    addLog(`⚡ Fast Flash: ${selectedArduino.name} → ${selectedPort}`);
    
    wsRef.current.send(JSON.stringify({ 
      type: 'compile_and_upload', 
      code, 
      fqbn: selectedArduino.fqbn, 
      port: selectedPort, 
      libraries: libs,
      boardType: selectedArduino.boardType
    }));
  }, [selectedArduino, selectedComponents, agentConnected, selectedPort, isEditMode, editableCode, generatedCode, addLog, connectToAgent]);

  // ========== MODAL ==========
  const handleModalSubmit = () => {
    const id = modalInput.trim().toUpperCase();
    if (!id) { setModalError('Please enter an Arduino ID'); return; }
    const a = ARDUINO_DATABASE[id];
    if (a) { 
      setSelectedArduino(a); 
      setSelectedComponents([]); 
      setShowIdModal(false); 
      setModalError(''); 
      addLog(`Loaded: ${a.name} (${a.boardType.toUpperCase()})`, 'success'); 
    } else { 
      setModalError(`"${id}" not found. Try ARD-001-005 or ESP-001-004`); 
    }
  };

  // ========== DRAG & DROP ==========
  const onDragStart = (e, comp) => { 
    setDraggingComp(comp); 
    e.dataTransfer.effectAllowed = 'copy'; 
    e.dataTransfer.setData('text/plain', comp.id); 
  };
  const onDragEnd = () => { setDraggingComp(null); setDragOverDrop(false); };
  const onDropOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setDragOverDrop(true); };
  const onDropLeave = () => setDragOverDrop(false);
  const onDrop = (e) => {
    e.preventDefault(); setDragOverDrop(false);
    if (draggingComp && !selectedComponents.find(c => c.id === draggingComp.id)) {
      setSelectedComponents(prev => [...prev, draggingComp]); 
      addLog(`Added: ${draggingComp.label}`, 'success');
    }
    setDraggingComp(null);
  };

  const toggleComponent = useCallback((comp) => {
    setSelectedComponents(prev => prev.find(c => c.id === comp.id) 
      ? prev.filter(c => c.id !== comp.id) 
      : [...prev, comp]);
  }, []);

  const removeComponent = (comp) => { 
    setSelectedComponents(prev => prev.filter(c => c.id !== comp.id)); 
    addLog(`Removed: ${comp.label}`); 
  };

  const copyCode = async () => { 
    await navigator.clipboard.writeText(isEditMode ? editableCode : generatedCode); 
    setCopied(true); addLog('Copied', 'success'); 
    setTimeout(() => setCopied(false), 2000); 
  };
  
  const downloadCode = () => { 
    const b = new Blob([isEditMode ? editableCode : generatedCode], { type: 'text/plain' }); 
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(b); 
    a.download = `${selectedArduino?.id || 'sketch'}.ino`; 
    a.click(); 
    addLog('Downloaded', 'success'); 
  };
  
  const refreshPorts = () => { 
    if (wsRef.current?.readyState === WebSocket.OPEN) { 
      wsRef.current.send(JSON.stringify({ type: 'list_ports' })); 
      addLog('Refreshing ports...'); 
    } 
  };

  const getLibraries = () => { 
    const s = new Set(); 
    selectedComponents.forEach(c => { 
      const t = COMPONENT_TEMPLATES[c.id]; 
      if (t?.library) s.add(t.library); 
    }); 
    return Array.from(s); 
  };

  const logColor = (t) => ({ error: '#dc2626', success: '#059669', warning: '#d97706' }[t] || '#6b7280');
  const logBg = (t) => ({ error: '#fef2f2', success: '#f0fdf4', warning: '#fffbeb' }[t] || 'transparent');

  const lineStyle = (line) => {
    const tr = line.trim();
    if (tr.startsWith('//') || tr.startsWith('/*') || tr.startsWith('*')) return { color: '#9ca3af' };
    if (tr.startsWith('#')) return { color: '#7c3aed' };
    if (line.includes('void ')) return { color: '#2563eb' };
    if (line.includes('Serial.')) return { color: '#d97706' };
    if (/\b(float|int|long|bool|char)\b/.test(line)) return { color: '#059669' };
    return { color: '#334155' };
  };

  const uploadBtnBg = () => {
    if (!selectedArduino || selectedComponents.length === 0) return '#e2e8f0';
    if (uploadPhase === 'success') return '#22c55e';
   if (uploadPhase === 'error') return 'linear-gradient(135deg, #f59e0b, #f97316)';
    if (uploadPhase !== 'idle') return '#f59e0b';
    return 'linear-gradient(135deg, #2563eb, #3b82f6)';
  };
  
const uploadBtnText = () => {
    if (uploadPhase === 'compiling') return `⚙️ Compiling... ${flashElapsed}s`;
    if (uploadPhase === 'uploading') return `📤 Uploading... ${flashElapsed}s`;
    if (uploadPhase === 'success') return '✓ Done!';
    if (uploadPhase === 'error') return '🔄 Retry Flash';
    return '⚡ Flash';
};

  const F = "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif";
  const M = "'JetBrains Mono', monospace";

  // =====================================================================
  // RENDER: ID MODAL
  // =====================================================================
  if (showIdModal) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(155deg, #eef2ff 0%, #f0f4ff 40%, #f8f9ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, animation: 'ardFadeIn 0.3s ease', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '52px 44px', maxWidth: 500, width: '100%', boxShadow: '0 20px 70px rgba(37,99,235,0.09), 0 6px 24px rgba(0,0,0,0.05)', animation: 'ardModalIn 0.45s cubic-bezier(0.16,1,0.3,1)', textAlign: 'center', border: '1px solid rgba(37,99,235,0.06)' }}>
          <div><img src="/Lab.png" alt="Logo" style={{ width: '75%', height: '75%', objectFit: 'contain' }} /></div>
          {/* <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.4px' }}>Arduino Code Dumper</h1> */}
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 32px', lineHeight: 1.5 }}>Arduino & ESP32 • ⚡ Flash Edition</p>
          <input
            value={modalInput} 
            onChange={e => { setModalInput(e.target.value.toUpperCase()); setModalError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleModalSubmit()} 
            placeholder="e.g. ARD-001 or ESP-001" 
            autoFocus
            style={{ width: '100%', padding: '16px 18px', fontSize: 17, fontFamily: M, fontWeight: 500, textAlign: 'center', letterSpacing: 2, border: `2px solid ${modalError ? '#fca5a5' : modalInput ? '#93c5fd' : '#e2e8f0'}`, borderRadius: 14, outline: 'none', background: modalError ? '#fff5f5' : '#f8fafc', color: '#0f172a', transition: 'all 0.2s' }}
          />
          {modalError && <p style={{ fontSize: 12, color: '#dc2626', margin: '10px 0 0', animation: 'ardSlideUp 0.25s ease', lineHeight: 1.4 }}>{modalError}</p>}
          <button onClick={handleModalSubmit} style={{ width: '100%', padding: 15, marginTop: 16, background: modalInput ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : '#e2e8f0', color: modalInput ? 'white' : '#94a3b8', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: modalInput ? 'pointer' : 'not-allowed', boxShadow: modalInput ? '0 6px 20px rgba(37,99,235,0.22)' : 'none', transition: 'all 0.2s', fontFamily: F }}>
            Load Device →
          </button>
          <div style={{ marginTop: 24, padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Available IDs</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center' }}>
              {Object.keys(ARDUINO_DATABASE).map(id => (
                <button key={id} onClick={() => { setModalInput(id); setModalError(''); }} style={{ padding: '5px 11px', borderRadius: 7, border: `1px solid ${modalInput === id ? '#bfdbfe' : '#e2e8f0'}`, background: modalInput === id ? '#eff6ff' : 'white', color: modalInput === id ? '#2563eb' : '#64748b', fontSize: 11, fontFamily: M, cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}>
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================================
  // RENDER: MAIN DASHBOARD
  // =====================================================================
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb', fontFamily: F, color: '#1e293b', animation: 'ardFadeIn 0.3s ease' }}>

      {/* HEADER */}
      <header style={{ background: 'white', borderBottom: '1px solid #e8ecf4', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/Lab.png" alt="Logo" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          <div>
            {/* <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0f172a' }}>Arduino Code Dumper</h1> */}
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Select → Configure → ⚡ Flash</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: '#f0f4ff', borderRadius: 10, border: '1px solid #dbeafe' }}>
            <span style={{ fontSize: 18 }}>{selectedArduino.boardImage}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1e40af', lineHeight: 1.2 }}>{selectedArduino.name}</div>
              <div style={{ fontSize: 10, color: '#64748b', fontFamily: M }}>
                {selectedArduino.id} • {selectedArduino.boardType === 'esp32' ? '🌐 ESP32' : '🔧 Arduino'}
              </div>
            </div>
            <button onClick={() => { setShowIdModal(true); setModalInput(''); setModalError(''); setSelectedComponents([]); }} style={{ padding: '3px 8px', background: 'white', border: '1px solid #dbeafe', borderRadius: 5, fontSize: 10, color: '#3b82f6', cursor: 'pointer', fontWeight: 500, fontFamily: F }}>Change</button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: agentConnected ? '#f0fdf4' : isReconnecting ? '#fffbeb' : '#fef2f2', borderRadius: 8, border: `1px solid ${agentConnected ? '#bbf7d0' : isReconnecting ? '#fde68a' : '#fecaca'}` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: agentConnected ? '#22c55e' : isReconnecting ? '#f59e0b' : '#ef4444', animation: isReconnecting ? 'ardPulse 1s infinite' : 'none' }} />
            <span style={{ fontSize: 11, color: agentConnected ? '#15803d' : isReconnecting ? '#92400e' : '#dc2626', fontWeight: 500 }}>
              {agentConnected ? 'Agent' : isReconnecting ? 'Connecting...' : 'Offline'}
            </span>
            {!agentConnected && !isReconnecting && (
              <button onClick={connectToAgent} style={{ padding: '2px 7px', background: 'white', border: '1px solid #fecaca', borderRadius: 4, fontSize: 9, color: '#dc2626', cursor: 'pointer', fontFamily: F }}>Connect</button>
            )}
          </div>
          
          <button onClick={uploadCode} disabled={selectedComponents.length === 0 || (uploadPhase !== 'idle' && uploadPhase !== 'error')}
            style={{ padding: '10px 22px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: 12, cursor: selectedComponents.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, background: uploadBtnBg(), color: selectedComponents.length === 0 ? '#94a3b8' : 'white', boxShadow: selectedComponents.length > 0 && uploadPhase === 'idle' ? '0 4px 14px rgba(37,99,235,0.22)' : 'none', transition: 'all 0.2s', fontFamily: F, minWidth: 160 }}>
            {uploadBtnText()}
          </button>
        </div>
      </header>

      {/* PROGRESS BAR with timing */}
      {uploadPhase !== 'idle' && (
        <div style={{ padding: '8px 24px 10px', background: 'white', borderBottom: '1px solid #e8ecf4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11, color: '#64748b' }}>
            <span>{uploadMessage}</span>
            <span style={{ fontFamily: M }}>{Math.round(uploadProgress)}% • {flashElapsed}s</span>
          </div>
          <div style={{ width: '100%', height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${uploadProgress}%`, background: uploadPhase === 'error' ? '#ef4444' : uploadPhase === 'success' ? '#22c55e' : '#3b82f6', borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', height: uploadPhase !== 'idle' ? 'calc(100vh - 110px)' : 'calc(100vh - 66px)' }}>

        {/* SIDEBAR */}
        <aside style={{ width: 200, borderRight: '1px solid #e8ecf4', background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 12px 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.7 }}>Components</span>
              <span style={{ fontSize: 8, color: '#bcc3d0', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>Drag →</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {selectedArduino.connectedComponents.map((comp, i) => {
                const isSelected = !!selectedComponents.find(c => c.id === comp.id);
                return (
                  <div key={comp.id + i}
                    className={isSelected ? '' : 'ard-drag-tile'}
                    draggable={!isSelected}
                    onDragStart={e => !isSelected && onDragStart(e, comp)}
                    onDragEnd={onDragEnd}
                    onClick={() => toggleComponent(comp)}
                    title={comp.label}
                    style={{
                      width: '100%', aspectRatio: '1', borderRadius: 12,
                      background: isSelected ? '#eff6ff' : '#f8fafc',
                      border: `2px solid ${isSelected ? '#93c5fd' : '#edf0f7'}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                      cursor: isSelected ? 'pointer' : 'grab',
                      transition: 'all 0.2s ease', userSelect: 'none',
                      opacity: isSelected ? 0.5 : 1,
                      animation: `ardBounce 0.35s ease ${i * 0.04}s both`,
                    }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{COMPONENT_ICONS[comp.id] || '⚙️'}</span>
                    <span style={{ fontSize: 7.5, fontWeight: 600, color: isSelected ? '#3b82f6' : '#64748b', textAlign: 'center', lineHeight: 1.2, maxWidth: 66, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {comp.label.length > 12 ? comp.label.split(' ')[0] : comp.label}
                    </span>
                    {isSelected && <span style={{ fontSize: 7, color: '#3b82f6', fontWeight: 700 }}>✓ added</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {getLibraries().length > 0 && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid #e8ecf4', background: '#fffbeb' }}>
              <p style={{ fontSize: 8, fontWeight: 600, color: '#92400e', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Libraries</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {getLibraries().map(l => <span key={l} style={{ fontSize: 9, color: '#92400e', background: 'white', padding: '3px 6px', borderRadius: 4, border: '1px solid #fde68a' }}>📦 {l}</span>)}
              </div>
            </div>
          )}

          {agentConnected && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid #e8ecf4', background: '#f0fdf4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 8, fontWeight: 600, color: '#15803d', textTransform: 'uppercase', letterSpacing: 0.5 }}>Port</span>
                <button onClick={refreshPorts} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, padding: 0 }}>🔄</button>
              </div>
              <select value={selectedPort} onChange={e => setSelectedPort(e.target.value)} style={{ width: '100%', padding: '5px 6px', background: 'white', border: '1px solid #bbf7d0', borderRadius: 5, fontSize: 9, fontFamily: M, color: '#1e293b', outline: 'none', cursor: 'pointer' }}>
                {availablePorts.length === 0 ? <option value="">No ports</option> : availablePorts.map(p => <option key={p.port} value={p.port}>{p.port} {p.is_arduino ? '★ AVR' : p.is_esp32 ? '📡 ESP32' : ''}</option>)}
              </select>
            </div>
          )}
        </aside>

        {/* CENTER */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fafbfe', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e8ecf4', background: 'white', padding: '0 20px' }}>
            <button onClick={() => setActiveTab('visual')} style={{ padding: '13px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: activeTab === 'visual' ? '#2563eb' : '#94a3b8', border: 'none', background: 'transparent', borderBottom: `2px solid ${activeTab === 'visual' ? '#2563eb' : 'transparent'}`, transition: 'all 0.2s', fontFamily: F }}>🎨 Visual</button>
            <button onClick={() => setActiveTab('code')} style={{ padding: '13px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: activeTab === 'code' ? '#2563eb' : '#94a3b8', border: 'none', background: 'transparent', borderBottom: `2px solid ${activeTab === 'code' ? '#2563eb' : 'transparent'}`, transition: 'all 0.2s', fontFamily: F }}>💻 Code</button>
          </div>

          {activeTab === 'visual' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 72, marginBottom: 12 }}>{selectedArduino.boardImage}</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{selectedArduino.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontFamily: M, marginBottom: 4 }}>{selectedArduino.id}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>📍 {selectedArduino.location}</div>
                  <div style={{ fontSize: 10, color: '#2563eb', fontWeight: 600, marginTop: 8, padding: '4px 8px', background: '#eff6ff', borderRadius: 5 }}>
                    {selectedArduino.boardType === 'esp32' ? '🌐 ESP32 32-bit' : '🔧 Arduino 8-bit'}
                  </div>
                </div>
              </div>

              <div
                onDragOver={onDropOver} onDragLeave={onDropLeave} onDrop={onDrop}
                style={{
                  width: '100%', maxWidth: 700, minHeight: 130, borderRadius: 18,
                  border: `2px dashed ${dragOverDrop ? '#3b82f6' : selectedComponents.length > 0 ? '#c7d2fe' : '#d1d5db'}`,
                  background: dragOverDrop ? '#eff6ff' : selectedComponents.length > 0 ? 'white' : '#f8fafc',
                  padding: selectedComponents.length > 0 ? 18 : 28,
                  transition: 'all 0.25s ease',
                  display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
                  gap: 0, boxShadow: selectedComponents.length > 0 ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
                }}>
                {selectedComponents.length === 0 ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 34, margin: '0 0 8px', opacity: 0.4 }}>📥</p>
                    <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, fontWeight: 500 }}>
                      {dragOverDrop ? 'Drop to add!' : 'Drag components here from sidebar'}
                    </p>
                    <p style={{ fontSize: 11, color: '#c4c9d4', margin: '6px 0 0' }}>or click components in sidebar to toggle</p>
                  </div>
                ) : (
                  selectedComponents.map((comp, i) => (
                    <React.Fragment key={comp.id}>
                      {i > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, flexShrink: 0, animation: `ardPopIn 0.25s ease ${i * 0.04}s both` }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="9" stroke="#c7d2fe" strokeWidth="1.5" fill="#eef2ff"/>
                            <path d="M10 6V14M6 10H14" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round"/>
                          </svg>
                        </div>
                      )}
                      <div className="ard-chip" style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                        padding: '14px 16px', borderRadius: 14, background: '#f0f4ff',
                        border: '2px solid #c7d2fe', position: 'relative',
                        animation: `ardPopIn 0.3s ease ${i * 0.05}s both`,
                        boxShadow: '0 2px 8px rgba(37,99,235,0.06)', minWidth: 80,
                      }}>
                        <button className="ard-chip-x" onClick={() => removeComponent(comp)} style={{
                          position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%',
                          background: '#ef4444', border: '2px solid white', color: 'white', fontSize: 10,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.15s', boxShadow: '0 2px 6px rgba(239,68,68,0.25)',
                          padding: 0, lineHeight: 1, fontFamily: F,
                        }}>✕</button>
                        <span style={{ fontSize: 28, lineHeight: 1 }}>{COMPONENT_ICONS[comp.id] || '⚙️'}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#1e40af', textAlign: 'center', maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {comp.label.length > 14 ? comp.label.split(' ')[0] : comp.label}
                        </span>
                      </div>
                    </React.Fragment>
                  ))
                )}
              </div>

              {selectedComponents.length > 0 && (
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, animation: 'ardSlideUp 0.3s ease' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>
                    {selectedComponents.length} component{selectedComponents.length > 1 ? 's' : ''} selected for {selectedArduino.id}
                  </span>
                  <button onClick={() => { setSelectedComponents([]); addLog('Cleared all'); }} style={{ padding: '4px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11, color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontFamily: F }}>Clear all</button>
                </div>
              )}

            {selectedComponents.length > 0 && (
                <div style={{ marginTop: 20, width: '100%', maxWidth: 500, animation: 'ardSlideUp 0.35s ease' }}>
                  
                  {/* Mode selector label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.7 }}>Code Generation Mode</span>
                    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  </div>

                  {/* Mode toggle */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <button
                      onClick={() => { if (codeGenMode !== 'manual') setCodeGenMode('manual'); }}
                      style={{
                        flex: 1, padding: '12px 10px', borderRadius: 12,
                        border: `2px solid ${codeGenMode === 'manual' ? '#2563eb' : '#e2e8f0'}`,
                        background: codeGenMode === 'manual' ? '#eff6ff' : 'white',
                        color: codeGenMode === 'manual' ? '#1e40af' : '#64748b',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        fontFamily: F,
                        boxShadow: codeGenMode === 'manual' ? '0 2px 8px rgba(37,99,235,0.15)' : 'none',
                        transition: 'all 0.2s',
                      }}>
                      <span style={{ fontSize: 18 }}>⚙️</span>
                      <span>Manual</span>
                      <span style={{ fontSize: 9, fontWeight: 400, color: codeGenMode === 'manual' ? '#3b82f6' : '#94a3b8' }}>Template-based</span>
                    </button>

                    <button
                      onClick={() => { if (codeGenMode !== 'ai') setCodeGenMode('ai'); }}
                      disabled={isGeneratingAI}
                      style={{
                        flex: 1, padding: '12px 10px', borderRadius: 12,
                        border: `2px solid ${codeGenMode === 'ai' ? '#7c3aed' : '#e2e8f0'}`,
                        background: codeGenMode === 'ai' ? 'linear-gradient(135deg, #faf5ff, #ede9fe)' : 'white',
                        color: codeGenMode === 'ai' ? '#5b21b6' : '#64748b',
                        fontSize: 12, fontWeight: 600, cursor: isGeneratingAI ? 'not-allowed' : 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        fontFamily: F,
                        boxShadow: codeGenMode === 'ai' ? '0 2px 12px rgba(124,58,237,0.2)' : 'none',
                        transition: 'all 0.2s',
                      }}>
                      <span style={{ fontSize: 18 }}>{isGeneratingAI ? '⏳' : '✨'}</span>
                      <span>{isGeneratingAI ? 'Generating...' : 'AI Generation'}</span>
                      <span style={{ fontSize: 9, fontWeight: 400, color: codeGenMode === 'ai' ? '#7c3aed' : '#94a3b8' }}>Gemini powered</span>
                    </button>
                  </div>

                  {/* Status feedback */}
                  {codeGenMode === 'manual' && !isGeneratingAI && (
                    <div style={{ padding: '12px 16px', borderRadius: 10, background: 'white', border: '2px solid #dbeafe', textAlign: 'center' }}>
                      <p style={{ color: '#2563eb', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>✓ Ready to Generate Code</p>
                      <p style={{ color: '#94a3b8', fontSize: 11, margin: 0 }}>Switch to Code tab to view</p>
                    </div>
                  )}
                  {isGeneratingAI && (
                    <div style={{ padding: '12px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', border: '2px solid #ddd6fe', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 16, height: 16, border: '2px solid #c4b5fd', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'ardSpin 0.8s linear infinite', flexShrink: 0 }} />
                      <div>
                        <p style={{ color: '#5b21b6', fontSize: 12, fontWeight: 600, margin: '0 0 2px' }}>Gemini is generating your code...</p>
                        <p style={{ color: '#a78bfa', fontSize: 10, margin: 0 }}>Analyzing components and pin configuration</p>
                      </div>
                    </div>
                  )}
                  {aiGenerated && codeGenMode === 'ai' && !isGeneratingAI && (
                    <div style={{ padding: '12px 16px', borderRadius: 10, background: '#f0fdf4', border: '2px solid #bbf7d0', textAlign: 'center' }}>
                      <p style={{ color: '#059669', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>✅ AI code ready!</p>
                      <p style={{ color: '#94a3b8', fontSize: 11, margin: 0 }}>Switch to Code tab to view & flash</p>
                    </div>
                  )}
                  {aiError && (
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fef2f2', border: '1.5px solid #fecaca' }}>
                      <p style={{ color: '#dc2626', fontSize: 11, margin: 0, fontWeight: 500 }}>⚠️ {aiError}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <>
              <div style={{ padding: '11px 20px', borderBottom: '1px solid #e8ecf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15 }}>📝</span>
                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>Generated Code</span>
                  <span style={{ padding: '3px 9px', background: '#f1f5f9', borderRadius: 4, fontSize: 10, color: '#64748b', fontFamily: M }}>{selectedArduino.id}.ino</span>
                  {aiGenerated && codeGenMode === 'ai' && (
                    <span style={{ padding: '3px 8px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', borderRadius: 4, fontSize: 9, color: 'white', fontWeight: 700 }}>✨ AI</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setIsEditMode(!isEditMode)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: isEditMode ? '#eff6ff' : 'white', color: isEditMode ? '#2563eb' : '#64748b', fontSize: 11, cursor: 'pointer', fontWeight: 500, fontFamily: F }}>✏️ {isEditMode ? 'Preview' : 'Edit'}</button>
                  <button onClick={copyCode} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: copied ? '#f0fdf4' : 'white', color: copied ? '#059669' : '#64748b', fontSize: 11, cursor: 'pointer', fontWeight: 500, fontFamily: F }}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
                  <button onClick={downloadCode} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #dbeafe', background: '#eff6ff', color: '#2563eb', fontSize: 11, cursor: 'pointer', fontWeight: 500, fontFamily: F }}>📥 Download</button>
                </div>
              </div>
              {isEditMode ? (
                <textarea value={editableCode} onChange={e => setEditableCode(e.target.value)} spellCheck="false"
                  style={{ flex: 1, padding: 20, margin: 0, border: 'none', outline: 'none', resize: 'none', fontFamily: M, fontSize: 12, lineHeight: 1.8, background: '#fafbfe', color: '#1e293b' }} />
            ) : (
                <pre style={{ flex: 1, overflow: 'auto', padding: '14px 0', margin: 0, fontFamily: M, fontSize: 12, lineHeight: 1.8, background: isGeneratingAI ? '#faf5ff' : '#fafbfe' }}>
                  {isGeneratingAI ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                      <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
                      <p style={{ color: '#7c3aed', fontFamily: F, fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>Gemini AI is generating your code...</p>
                      <p style={{ color: '#a78bfa', fontFamily: F, fontSize: 12, margin: 0 }}>Analyzing {selectedComponents.length} component{selectedComponents.length > 1 ? 's' : ''} for {selectedArduino.id}</p>
                    </div>
                  ) : generatedCode.split('\n').map((line, i) => (
                    <div key={i} className="ard-code-ln" style={{ display: 'flex', padding: '0 20px' }}>
                      <span style={{ width: 34, textAlign: 'right', paddingRight: 12, color: '#c4c9d4', userSelect: 'none', fontSize: 10, borderRight: '1px solid #e8ecf4', marginRight: 12, flexShrink: 0 }}>{i + 1}</span>
                      <span style={lineStyle(line)}>{line || ' '}</span>
                    </div>
                  ))}
                </pre>
              )}
            </>
          )}
        </main>

        {/* RIGHT PANEL */}
        <aside style={{ width: 260, borderLeft: '1px solid #e8ecf4', background: 'white', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8ecf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafbfe' }}>
            <span style={{ fontWeight: 600, color: '#475569', fontSize: 12 }}>📟 Activity Log</span>
            <button onClick={() => setSerialLog([])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#94a3b8' }}>Clear</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
            {serialLog.length === 0 ? (
              <p style={{ color: '#cbd5e1', fontSize: 12, textAlign: 'center', marginTop: 40 }}>No activity yet...</p>
            ) : serialLog.map((log, i) => (
              <div key={i} className="ard-log" style={{ display: 'flex', gap: 6, padding: '4px 6px', borderRadius: 4, background: logBg(log.type), marginBottom: 2 }}>
                <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: M, flexShrink: 0, paddingTop: 1 }}>{log.timestamp}</span>
                <span style={{ fontSize: 10, color: logColor(log.type), fontFamily: M, wordBreak: 'break-word' }}>{log.message}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </aside>
      </div>

      {/* SETUP PROGRESS MODAL */}
      {showSetupModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, animation: 'ardFadeIn 0.2s ease' }}>
          <div style={{ position: 'relative', background: 'white', borderRadius: 24, padding: 40, maxWidth: 560, width: '90%', boxShadow: '0 25px 80px rgba(0,0,0,0.15)', animation: 'ardModalIn 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            
            {setupPhase === 'waiting' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🔧</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>First-Time Setup Required</h2>
                  <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                    This will download and install the Arduino CLI and required cores.<br/>
                    <strong style={{ color: '#2563eb' }}>ESP32 core may take 10-30 minutes on first install.</strong>
                  </p>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 12 }}>Setup will install:</div>
                  {['Arduino CLI', 'Package Index', 'Arduino AVR Core (~5 min)', 'ESP32 Core (~10-30 min)'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, marginBottom: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1' }} />
                      <span style={{ fontSize: 13, color: '#475569' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <button onClick={startSetup} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #2563eb, #3b82f6)', border: 'none', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 20px rgba(37,99,235,0.25)', fontFamily: F }}>
                  🚀 Start Setup
                </button>
              </>
            )}

            {setupPhase === 'running' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ fontSize: 48, marginBottom: 12, animation: 'ardSpin 2s linear infinite' }}>⚙️</div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Installing Components...</h2>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Please wait, this may take several minutes</p>
                </div>
                
                {Object.entries(setupSteps).map(([key, step]) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ 
                          width: 20, height: 20, borderRadius: '50%', 
                          background: step.status === 'complete' ? '#22c55e' : step.status === 'running' ? '#3b82f6' : step.status === 'error' ? '#ef4444' : '#e2e8f0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, color: 'white', fontWeight: 600
                        }}>
                          {step.status === 'complete' ? '✓' : step.status === 'error' ? '✗' : step.status === 'running' ? '...' : ''}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                          {key === 'arduino_cli' ? 'Arduino CLI' : 
                           key === 'core_index' ? 'Package Index' :
                           key === 'avr_core' ? 'Arduino AVR Core' :
                           'ESP32 Core'}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: '#64748b', fontFamily: M }}>{step.progress}%</span>
                    </div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', width: `${step.progress}%`, 
                        background: step.status === 'complete' ? '#22c55e' : step.status === 'error' ? '#ef4444' : '#3b82f6',
                        borderRadius: 3, transition: 'width 0.3s'
                      }} />
                    </div>
                    <p style={{ fontSize: 10, color: step.status === 'error' ? '#dc2626' : '#64748b', margin: '4px 0 0', fontFamily: M }}>{step.message}</p>
                  </div>
                ))}
              </>
            )}

            {setupPhase === 'complete' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16, animation: 'ardBounce 0.5s ease' }}>✅</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#059669', margin: '0 0 8px' }}>Setup Complete!</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Flash Agent is ready to use</p>
              </div>
            )}

            {setupPhase === 'error' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#dc2626', margin: '0 0 8px' }}>Setup Incomplete</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>Some features may not work. Check the activity log.</p>
                <button onClick={() => setShowSetupModal(false)} style={{ padding: '10px 24px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: F }}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}