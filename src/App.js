import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// ARDUINO DATABASE - Device Registry
// ============================================================================
const ARDUINO_DATABASE = {
  "ARD-001": {
    id: "ARD-001", name: "Weather Station Unit", board: "arduino-nano", fqbn: "arduino:avr:nano",
    location: "Building A - Rooftop", boardImage: "🌞",
    connectedComponents: [
      { id: "dht22", pin: 2, label: "Temperature & Humidity" },
      { id: "bmp280", pin: "I2C", label: "Barometric Pressure" },
      { id: "rain-sensor", pin: "A0", label: "Rain Detection" },
      { id: "ldr", pin: "A1", label: "Light Sensor" },
      { id: "lcd-i2c", pin: "I2C", label: "Display" }
    ]
  },
  "ARD-002": {
    id: "ARD-002", name: "Smart Home Controller", board: "arduino-nano", fqbn: "arduino:avr:nano",
    location: "Building B - Server Room", boardImage: "🏠",
    connectedComponents: [
      { id: "relay-4ch", pin: { ch1: 4, ch2: 5, ch3: 6, ch4: 7 }, label: "4-Channel Relay" },
      { id: "pir", pin: 2, label: "Motion Sensor - Hall" },
      { id: "dht11", pin: 3, label: "Indoor Temperature" },
      { id: "buzzer", pin: 8, label: "Alert Buzzer" }
    ]
  },
  "ARD-003": {
    id: "ARD-003", name: "Plant Monitor", board: "arduino-nano", fqbn: "arduino:avr:nano",
    location: "Greenhouse", boardImage: "🌱",
    connectedComponents: [
      { id: "soil-moisture", pin: "A0", label: "Soil Moisture" },
      { id: "dht11", pin: 2, label: "Air Temperature" },
      { id: "ldr", pin: "A2", label: "Light Sensor" },
      { id: "water-pump", pin: 3, label: "Water Pump" },
      { id: "oled", pin: "I2C", label: "Display" }
    ]
  },
  "ARD-004": {
    id: "ARD-004", name: "Security System", board: "arduino-nano", fqbn: "arduino:avr:nano",
    location: "Main Gate", boardImage: "🔐",
    connectedComponents: [
      { id: "ultrasonic", pin: { trig: 9, echo: 10 }, label: "Distance Sensor" },
      { id: "pir", pin: 2, label: "Motion Detector" },
      { id: "buzzer", pin: 4, label: "Alarm" },
      { id: "led-red", pin: 5, label: "Alert LED" },
      { id: "led-green", pin: 6, label: "Status LED" }
    ]
  },
  "ARD-005": {
    id: "ARD-005", name: "Motor Controller", board: "arduino-nano", fqbn: "arduino:avr:nano",
    location: "Factory Floor", boardImage: "⚙️",
    connectedComponents: [
      { id: "dc-motor", pin: { ena: 2, in1: 3, in2: 4 }, label: "Motor 1" },
      { id: "stepper", pin: { in1: 8, in2: 9, in3: 10, in4: 11 }, label: "Stepper" },
      { id: "current-sensor", pin: "A0", label: "Current Monitor" },
      { id: "lcd-i2c", pin: "I2C", label: "Display" }
    ]
  },
  "ESP-001": {
    id: "ESP-001", name: "IoT Hub", board: "esp32", fqbn: "esp32:esp32:esp32",
    location: "Lab Room", boardImage: "📡",
    connectedComponents: [
      { id: "dht22", pin: 4, label: "Environment Sensor" },
      { id: "mq2", pin: { analog: 34, digital: 5 }, label: "Gas Detector" },
      { id: "pir", pin: 13, label: "Presence Sensor" },
      { id: "relay", pin: 12, label: "Power Control" },
      { id: "oled", pin: "I2C", label: "Display" }
    ]
  }
};

// ============================================================================
// COMPONENT ICONS & TEMPLATES
// ============================================================================
const COMPONENT_ICONS = {
  "dht11": "🌡️", "dht22": "🌡️", "bmp280": "📊", "rain-sensor": "🌧️",
  "pir": "🚨", "soil-moisture": "💧", "ldr": "💡", "water-pump": "💦",
  "relay": "⚡", "relay-4ch": "⚡", "buzzer": "🔔", "led-red": "🔴",
  "led-green": "🟢", "lcd-i2c": "📺", "oled": "📺", "ultrasonic": "📡",
  "dc-motor": "⚙️", "stepper": "🔄", "current-sensor": "⚡", "mq2": "💨"
};

const COMPONENT_TEMPLATES = {
  "dht11": {
    library: "DHT sensor library", includes: ['#include <DHT.h>'],
    defines: (p) => [`#define DHT_PIN ${p}`, '#define DHT_TYPE DHT11'],
    globals: ['DHT dht(DHT_PIN, DHT_TYPE);'], setup: ['dht.begin();'],
    loop: `\n  float humidity = dht.readHumidity();\n  float temperature = dht.readTemperature();\n  if (!isnan(humidity) && !isnan(temperature)) {\n    Serial.print("Temp: "); Serial.print(temperature); Serial.println("C");\n    Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");\n  }`
  },
  "dht22": {
    library: "DHT sensor library", includes: ['#include <DHT.h>'],
    defines: (p) => [`#define DHT_PIN ${p}`, '#define DHT_TYPE DHT22'],
    globals: ['DHT dht(DHT_PIN, DHT_TYPE);'], setup: ['dht.begin();'],
    loop: `\n  float humidity = dht.readHumidity();\n  float temperature = dht.readTemperature();\n  if (!isnan(humidity) && !isnan(temperature)) {\n    Serial.print("Temp: "); Serial.print(temperature); Serial.println("C");\n    Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");\n  }`
  },
  "bmp280": {
    library: "Adafruit BMP280 Library", includes: ['#include <Wire.h>', '#include <Adafruit_BMP280.h>'],
    defines: () => [], globals: ['Adafruit_BMP280 bmp;'],
    setup: ['if (!bmp.begin(0x76)) { Serial.println("BMP280 not found!"); while(1); }'],
    loop: `\n  Serial.print("Pressure: "); Serial.print(bmp.readPressure()/100.0F); Serial.println(" hPa");\n  Serial.print("Altitude: "); Serial.print(bmp.readAltitude(1013.25)); Serial.println(" m");`
  },
  "rain-sensor": {
    library: null, includes: [], defines: (p) => [`#define RAIN_PIN ${p}`], globals: [], setup: [],
    loop: `\n  int rainValue = analogRead(RAIN_PIN);\n  Serial.print("Rain: "); Serial.println(rainValue > 500 ? "Dry" : "Wet");`
  },
  "pir": {
    library: null, includes: [], defines: (p) => [`#define PIR_PIN ${p}`], globals: [],
    setup: ['pinMode(PIR_PIN, INPUT);'],
    loop: `\n  if (digitalRead(PIR_PIN) == HIGH) {\n    Serial.println("Motion detected!");\n  }`
  },
  "soil-moisture": {
    library: null, includes: [], defines: (p) => [`#define SOIL_PIN ${p}`], globals: [], setup: [],
    loop: `\n  int soilValue = analogRead(SOIL_PIN);\n  int moisture = map(soilValue, 1023, 0, 0, 100);\n  Serial.print("Soil Moisture: "); Serial.print(moisture); Serial.println("%");`
  },
  "ldr": {
    library: null, includes: [], defines: (p) => [`#define LDR_PIN ${p}`], globals: [], setup: [],
    loop: `\n  int light = analogRead(LDR_PIN);\n  Serial.print("Light: "); Serial.println(light);`
  },
  "water-pump": {
    library: null, includes: [], defines: (p) => [`#define PUMP_PIN ${p}`], globals: [],
    setup: ['pinMode(PUMP_PIN, OUTPUT);', 'digitalWrite(PUMP_PIN, LOW);'], loop: ``
  },
  "relay": {
    library: null, includes: [], defines: (p) => [`#define RELAY_PIN ${p}`], globals: [],
    setup: ['pinMode(RELAY_PIN, OUTPUT);', 'digitalWrite(RELAY_PIN, HIGH);'], loop: ``
  },
  "relay-4ch": {
    library: null, includes: [],
    defines: (p) => [`#define RELAY1 ${p.ch1}`, `#define RELAY2 ${p.ch2}`, `#define RELAY3 ${p.ch3}`, `#define RELAY4 ${p.ch4}`],
    globals: [],
    setup: ['pinMode(RELAY1, OUTPUT); digitalWrite(RELAY1, HIGH);', 'pinMode(RELAY2, OUTPUT); digitalWrite(RELAY2, HIGH);', 'pinMode(RELAY3, OUTPUT); digitalWrite(RELAY3, HIGH);', 'pinMode(RELAY4, OUTPUT); digitalWrite(RELAY4, HIGH);'],
    loop: ``
  },
  "buzzer": {
    library: null, includes: [], defines: (p) => [`#define BUZZER_PIN ${p}`], globals: [],
    setup: ['pinMode(BUZZER_PIN, OUTPUT);'], loop: ``
  },
  "led-red": {
    library: null, includes: [], defines: (p) => [`#define LED_RED ${p}`], globals: [],
    setup: ['pinMode(LED_RED, OUTPUT);'], loop: ``
  },
  "led-green": {
    library: null, includes: [], defines: (p) => [`#define LED_GREEN ${p}`], globals: [],
    setup: ['pinMode(LED_GREEN, OUTPUT);'], loop: ``
  },
  "lcd-i2c": {
    library: "LiquidCrystal I2C", includes: ['#include <Wire.h>', '#include <LiquidCrystal_I2C.h>'],
    defines: () => [], globals: ['LiquidCrystal_I2C lcd(0x27, 16, 2);'],
    setup: ['lcd.init();', 'lcd.backlight();', 'lcd.setCursor(0, 0);', 'lcd.print("System Ready");'],
    loop: `\n  lcd.setCursor(0, 1);\n  lcd.print("Uptime: ");\n  lcd.print(millis()/1000);\n  lcd.print("s   ");`
  },
  "oled": {
    library: "Adafruit SSD1306", includes: ['#include <Wire.h>', '#include <Adafruit_GFX.h>', '#include <Adafruit_SSD1306.h>'],
    defines: () => ['#define SCREEN_WIDTH 128', '#define SCREEN_HEIGHT 64', '#define OLED_RESET -1'],
    globals: ['Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);'],
    setup: ['if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { Serial.println("OLED failed"); while(1); }', 'display.clearDisplay();', 'display.setTextSize(1);', 'display.setTextColor(SSD1306_WHITE);', 'display.setCursor(0,0);', 'display.println("System Ready");', 'display.display();'],
    loop: `\n  display.clearDisplay();\n  display.setCursor(0,0);\n  display.print("Uptime: ");\n  display.print(millis()/1000);\n  display.println("s");\n  display.display();`
  },
  "ultrasonic": {
    library: null, includes: [],
    defines: (p) => [`#define TRIG_PIN ${p.trig}`, `#define ECHO_PIN ${p.echo}`], globals: [],
    setup: ['pinMode(TRIG_PIN, OUTPUT);', 'pinMode(ECHO_PIN, INPUT);'],
    loop: `\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  long duration = pulseIn(ECHO_PIN, HIGH);\n  float distance = duration * 0.034 / 2;\n  Serial.print("Distance: "); Serial.print(distance); Serial.println(" cm");`
  },
  "dc-motor": {
    library: null, includes: [],
    defines: (p) => [`#define MOTOR_ENA ${p.ena}`, `#define MOTOR_IN1 ${p.in1}`, `#define MOTOR_IN2 ${p.in2}`], globals: [],
    setup: ['pinMode(MOTOR_ENA, OUTPUT);', 'pinMode(MOTOR_IN1, OUTPUT);', 'pinMode(MOTOR_IN2, OUTPUT);'], loop: ``
  },
  "stepper": {
    library: "Stepper", includes: ['#include <Stepper.h>'],
    defines: (p) => [`#define STEPPER_IN1 ${p.in1}`, `#define STEPPER_IN2 ${p.in2}`, `#define STEPPER_IN3 ${p.in3}`, `#define STEPPER_IN4 ${p.in4}`, '#define STEPS_PER_REV 2048'],
    globals: ['Stepper stepper(STEPS_PER_REV, STEPPER_IN1, STEPPER_IN3, STEPPER_IN2, STEPPER_IN4);'],
    setup: ['stepper.setSpeed(10);'], loop: ``
  },
  "current-sensor": {
    library: null, includes: [], defines: (p) => [`#define CURRENT_PIN ${p}`], globals: [], setup: [],
    loop: `\n  int sensorValue = analogRead(CURRENT_PIN);\n  float voltage = sensorValue * (5.0 / 1023.0);\n  float current = (voltage - 2.5) / 0.185;\n  Serial.print("Current: "); Serial.print(current); Serial.println(" A");`
  },
  "mq2": {
    library: null, includes: [],
    defines: (p) => [`#define MQ2_ANALOG ${typeof p === 'object' ? p.analog : p}`, `#define MQ2_DIGITAL ${typeof p === 'object' ? p.digital : 5}`],
    globals: [], setup: ['pinMode(MQ2_DIGITAL, INPUT);'],
    loop: `\n  int gasValue = analogRead(MQ2_ANALOG);\n  bool gasDetected = digitalRead(MQ2_DIGITAL) == LOW;\n  Serial.print("Gas Level: "); Serial.print(gasValue);\n  if(gasDetected) Serial.println(" - WARNING!");\n  else Serial.println(" - OK");`
  }
};

// ============================================================================
// CODE GENERATOR
// ============================================================================
const generateCode = (arduino, components) => {
  if (!arduino || components.length === 0) {
    return `// Arduino Code Dumper\n// Select an Arduino and components to generate code\n\nvoid setup() {\n  Serial.begin(9600);\n  Serial.println("Ready");\n}\n\nvoid loop() {\n  delay(1000);\n}`;
  }

  let includes = new Set();
  let defines = [];
  let globals = [];
  let setupCode = ['Serial.begin(9600);'];
  let loopCode = [];

  components.forEach(comp => {
    const template = COMPONENT_TEMPLATES[comp.id];
    if (!template) return;
    template.includes.forEach(i => includes.add(i));
    defines.push(...template.defines(comp.pin));
    globals.push(...template.globals);
    setupCode.push(...template.setup);
    if (template.loop) loopCode.push(template.loop);
  });

  let code = `/*\n * Device: ${arduino.id} - ${arduino.name}\n * Board: ${arduino.board} (${arduino.fqbn})\n * Location: ${arduino.location}\n * Generated: ${new Date().toISOString()}\n * Components: ${components.map(c => c.label).join(', ')}\n */\n\n`;
  
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
// MAIN APPLICATION
// ============================================================================
export default function ArduinoDumper() {
  const [arduinoId, setArduinoId] = useState('');
  const [selectedArduino, setSelectedArduino] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

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
  const [showAgentInstaller, setShowAgentInstaller] = useState(false);

  const wsRef = useRef(null);
  const logEndRef = useRef(null);

  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setSerialLog(prev => [...prev.slice(-100), { timestamp, message, type }]);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialLog]);

  useEffect(() => {
    const newCode = generateCode(selectedArduino, selectedComponents);
    setGeneratedCode(newCode);
    if (!isEditMode) setEditableCode(newCode);
  }, [selectedArduino, selectedComponents, isEditMode]);

  const connectToAgent = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    addLog('Connecting to Flash Agent...', 'info');

    try {
      const ws = new WebSocket('ws://localhost:8765');
      
      ws.onopen = () => {
        setAgentConnected(true);
        wsRef.current = ws;
        addLog('Connected to Flash Agent', 'success');
        ws.send(JSON.stringify({ type: 'list_ports' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleAgentMessage(data);
        } catch (e) {
          addLog(`Parse error: ${e.message}`, 'error');
        }
      };

      ws.onerror = () => {
        addLog('Connection error - is Flash Agent running?', 'error');
        setAgentConnected(false);
        setShowAgentInstaller(true);
      };

      ws.onclose = () => {
        wsRef.current = null;
        setAgentConnected(false);
        addLog('Disconnected from Flash Agent', 'warning');
      };
    } catch (e) {
      setShowAgentInstaller(true);
      addLog(`Failed to connect: ${e.message}`, 'error');
    }
  }, [addLog]);

  const handleAgentMessage = useCallback((data) => {
    switch (data.type) {
      case 'connected':
        addLog(`Flash Agent v${data.version} ready`, 'info');
        break;
      case 'ports':
        setAvailablePorts(data.ports || []);
        const arduinoPort = data.ports?.find(p => p.is_arduino);
        if (arduinoPort && !selectedPort) setSelectedPort(arduinoPort.port);
        addLog(`Found ${data.ports?.length || 0} serial port(s)`, 'info');
        break;
      case 'compile_start':
        setUploadPhase('compiling');
        setUploadProgress(10);
        setUploadMessage('Compiling...');
        addLog('Compiling sketch...', 'info');
        break;
      case 'compile_progress':
        setUploadProgress(data.progress || 30);
        addLog(data.message, 'info');
        break;
      case 'compile_complete':
        setUploadProgress(40);
        setUploadMessage('Compiled');
        addLog('Compilation complete', 'success');
        break;
      case 'compile_error':
        setUploadPhase('error');
        setUploadMessage('Compile error');
        addLog(`Compile error: ${data.error}`, 'error');
        break;
      case 'upload_start':
        setUploadPhase('uploading');
        setUploadProgress(50);
        setUploadMessage('Uploading...');
        addLog('Uploading to Arduino...', 'info');
        break;
      case 'upload_progress':
        setUploadProgress(50 + (data.progress * 0.4));
        break;
      case 'upload_complete':
        setUploadProgress(95);
        addLog('Upload complete', 'success');
        break;
      case 'upload_error':
        setUploadPhase('error');
        setUploadMessage('Upload failed');
        addLog(`Upload error: ${data.error}`, 'error');
        break;
      case 'verify_complete':
        setUploadPhase('success');
        setUploadProgress(100);
        setUploadMessage('Success!');
        addLog('Code flashed successfully!', 'success');
        setTimeout(() => {
          setUploadPhase('idle');
          setUploadProgress(0);
          setUploadMessage('');
        }, 3000);
        break;
      case 'error':
        addLog(`Error: ${data.message}`, 'error');
        break;
      default:
        break;
    }
  }, [addLog, selectedPort]);

  useEffect(() => {
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, []);

  const uploadCode = useCallback(() => {
    if (!selectedArduino || selectedComponents.length === 0) {
      addLog('Select Arduino and components first', 'error');
      return;
    }
    if (!agentConnected) {
      setShowAgentInstaller(true);
      addLog('Flash Agent not connected', 'error');
      return;
    }
    if (!selectedPort) {
      addLog('No serial port selected', 'error');
      return;
    }

    const codeToUpload = isEditMode ? editableCode : generatedCode;
    const libraries = selectedComponents.map(c => COMPONENT_TEMPLATES[c.id]?.library).filter(Boolean);

    setUploadPhase('compiling');
    setUploadProgress(5);
    setUploadMessage('Starting...');
    addLog(`Uploading to ${selectedArduino.name}...`, 'info');

    wsRef.current.send(JSON.stringify({
      type: 'compile_and_upload',
      code: codeToUpload,
      fqbn: selectedArduino.fqbn,
      port: selectedPort,
      libraries: libraries
    }));
  }, [selectedArduino, selectedComponents, agentConnected, selectedPort, isEditMode, editableCode, generatedCode, addLog]);

  const searchArduino = () => {
    const id = arduinoId.trim().toUpperCase();
    if (!id) { setSearchError('Enter an ID'); return; }
    const arduino = ARDUINO_DATABASE[id];
    if (arduino) {
      setSelectedArduino(arduino);
      setSelectedComponents([]);
      setSearchError('');
      addLog(`Loaded: ${arduino.name}`, 'info');
    } else {
      setSearchError(`ID "${id}" not found`);
      setSelectedArduino(null);
    }
  };

  const toggleComponent = useCallback((comp) => {
    setSelectedComponents(prev => {
      const exists = prev.find(c => c.id === comp.id);
      if (exists) {
        return prev.filter(c => c.id !== comp.id);
      }
      return [...prev, comp];
    });
  }, []);

  const selectAllComponents = () => {
    if (selectedArduino) {
      setSelectedComponents(selectedArduino.connectedComponents);
      addLog('Selected all components', 'info');
    }
  };

  const clearComponents = () => {
    setSelectedComponents([]);
    addLog('Cleared all components', 'info');
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(isEditMode ? editableCode : generatedCode);
    setCopied(true);
    addLog('Code copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([isEditMode ? editableCode : generatedCode], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${selectedArduino?.id || 'sketch'}.ino`;
    a.click();
    addLog('Downloaded sketch', 'success');
  };

  const refreshPorts = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'list_ports' }));
      addLog('Refreshing ports...', 'info');
    }
  };

  const getLibraries = () => {
    const libs = new Set();
    selectedComponents.forEach(c => {
      const t = COMPONENT_TEMPLATES[c.id];
      if (t?.library) libs.add(t.library);
    });
    return Array.from(libs);
  };

  const getUploadButtonStyle = () => {
    const base = { padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' };
    if (!selectedArduino || selectedComponents.length === 0) return { ...base, background: '#2a2a35', color: '#555', cursor: 'not-allowed' };
    if (uploadPhase === 'success') return { ...base, background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white' };
    if (uploadPhase === 'error') return { ...base, background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: 'white' };
    if (uploadPhase !== 'idle') return { ...base, background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: 'white', cursor: 'wait' };
    return { ...base, background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white' };
  };

  const getUploadButtonText = () => {
    switch (uploadPhase) {
      case 'compiling': return '⚙️ Compiling...';
      case 'uploading': return '📤 Uploading...';
      case 'success': return '✓ Success!';
      case 'error': return '✗ Failed';
      default: return '🚀 Flash to Arduino';
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return '#f87171';
      case 'success': return '#34d399';
      case 'warning': return '#fbbf24';
      default: return '#9ca3af';
    }
  };

  const getLineStyle = (line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return { color: '#6b7280' };
    if (trimmed.startsWith('#')) return { color: '#a78bfa' };
    if (line.includes('void ')) return { color: '#22d3ee' };
    if (line.includes('Serial.')) return { color: '#fbbf24' };
    return { color: '#d1d5db' };
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⚡</div>
          <div>
            <h1 style={styles.title}>Arduino Code Dumper</h1>
            <p style={styles.subtitle}>Select → Configure → Flash</p>
          </div>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.agentStatus}>
            <div style={{ ...styles.statusDot, backgroundColor: agentConnected ? '#34d399' : '#f87171' }} />
            <span style={styles.statusText}>{agentConnected ? 'Agent Connected' : 'Disconnected'}</span>
            {!agentConnected && <button onClick={connectToAgent} style={styles.reconnectBtn}>Connect</button>}
          </div>
          <button onClick={uploadCode} disabled={!selectedArduino || selectedComponents.length === 0 || uploadPhase !== 'idle'} style={getUploadButtonStyle()}>
            {getUploadButtonText()}
          </button>
        </div>
      </header>

      {uploadPhase !== 'idle' && (
        <div style={styles.progressContainer}>
          <div style={styles.progressInfo}>
            <span>{uploadMessage}</span>
            <span>{uploadProgress}%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${uploadProgress}%`, backgroundColor: uploadPhase === 'error' ? '#ef4444' : uploadPhase === 'success' ? '#10b981' : '#f59e0b' }} />
          </div>
        </div>
      )}

      <div style={styles.main}>
        <aside style={styles.sidebar}>
          <div style={styles.searchBox}>
            <label style={styles.label}>Arduino ID</label>
            <div style={styles.inputRow}>
              <input value={arduinoId} onChange={e => setArduinoId(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && searchArduino()} placeholder="e.g. ARD-001" style={styles.input} />
              <button onClick={searchArduino} style={styles.searchBtn}>🔍</button>
            </div>
            {searchError && <p style={styles.errorText}>{searchError}</p>}
            <div style={styles.dropdown}>
              <button onClick={() => setShowDropdown(!showDropdown)} style={styles.dropdownBtn}>
                <span>Or select from list...</span>
                <span>{showDropdown ? '▲' : '▼'}</span>
              </button>
              {showDropdown && (
                <div style={styles.dropdownMenu}>
                  {Object.values(ARDUINO_DATABASE).map(a => (
                    <button key={a.id} onClick={() => { setSelectedArduino(a); setArduinoId(a.id); setSelectedComponents([]); setShowDropdown(false); addLog(`Selected: ${a.name}`, 'info'); }} style={styles.dropdownItem}>
                      <span style={styles.dropdownId}>{a.id}</span>
                      <span>{a.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedArduino && (
            <div style={styles.arduinoInfo}>
              <div style={styles.arduinoHeader}>
                <div style={styles.boardIcon}>{selectedArduino.boardImage}</div>
                <div>
                  <h3 style={styles.arduinoName}>{selectedArduino.name}</h3>
                  <p style={styles.arduinoId}>{selectedArduino.id}</p>
                  <span style={styles.boardTag}>{selectedArduino.board}</span>
                </div>
              </div>
            </div>
          )}

          {selectedArduino && agentConnected && (
            <div style={styles.portSection}>
              <div style={styles.portHeader}>
                <label style={styles.label}>Serial Port</label>
                <button onClick={refreshPorts} style={styles.refreshBtn}>🔄</button>
              </div>
              <select value={selectedPort} onChange={e => setSelectedPort(e.target.value)} style={styles.portSelect}>
                {availablePorts.length === 0 ? <option value="">No ports found</option> : availablePorts.map(p => (
                  <option key={p.port} value={p.port}>{p.port} {p.is_arduino ? '★' : ''} - {p.description}</option>
                ))}
              </select>
            </div>
          )}

          {selectedArduino ? (
            <>
              <div style={styles.compHeader}>
                <span style={styles.compCount}>Components ({selectedArduino.connectedComponents.length})</span>
                <div style={styles.compActions}>
                  <button onClick={selectAllComponents} style={styles.actionBtn}>All</button>
                  <button onClick={clearComponents} style={styles.clearBtn}>Clear</button>
                </div>
              </div>
              <div style={styles.compList}>
                {selectedArduino.connectedComponents.map((c, i) => {
                  const isSelected = selectedComponents.find(x => x.id === c.id);
                  return (
                    <button key={i} onClick={() => toggleComponent(c)} style={{ ...styles.compItem, backgroundColor: isSelected ? 'rgba(16,185,129,0.15)' : '#1a1a22', border: isSelected ? '2px solid #10b981' : '2px solid transparent' }}>
                      <div style={{ ...styles.compCheck, backgroundColor: isSelected ? '#10b981' : '#333', color: isSelected ? 'white' : '#888' }}>{isSelected ? '✓' : '○'}</div>
                      <div style={styles.compInfo}>
                        <div style={styles.compLabel}>{c.label}</div>
                        <div style={styles.compPin}>Pin: {typeof c.pin === 'object' ? JSON.stringify(c.pin) : c.pin}</div>
                      </div>
                      <span style={styles.compIcon}>{COMPONENT_ICONS[c.id] || '⚙️'}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🗄️</div>
              <p style={styles.emptyTitle}>Enter Arduino ID</p>
              <p style={styles.emptyHint}>Try: ARD-001, ARD-002, ESP-001</p>
            </div>
          )}

          {selectedComponents.length > 0 && (
            <div style={styles.librariesSection}>
              <div style={styles.librariesHeader}><span>Selected: {selectedComponents.length}</span></div>
              {getLibraries().length > 0 && (
                <div style={styles.librariesList}>
                  {getLibraries().map(l => <span key={l} style={styles.libraryTag}>📦 {l}</span>)}
                </div>
              )}
            </div>
          )}
        </aside>

        <main style={styles.codePanel}>
          <div style={styles.tabsContainer}>
            <button onClick={() => setActiveTab('visual')} style={{ ...styles.tab, ...(activeTab === 'visual' ? styles.tabActive : {}) }}>🎨 Visual</button>
            <button onClick={() => setActiveTab('code')} style={{ ...styles.tab, ...(activeTab === 'code' ? styles.tabActive : {}) }}>💻 Code</button>
          </div>

          {activeTab === 'visual' && (
            <div style={styles.visualContent}>
              {!selectedArduino ? (
                <div style={styles.visualEmpty}>
                  <div style={styles.visualEmptyIcon}>📦</div>
                  <p style={styles.visualEmptyTitle}>Select an Arduino to get started</p>
                </div>
              ) : (
                <div style={styles.visualBoard}>
                  <div style={styles.boardSection}>
                    <div style={styles.boardImage}>{selectedArduino.boardImage}</div>
                    <div style={styles.boardInfo}>
                      <div style={styles.boardName}>{selectedArduino.name}</div>
                      <div style={styles.boardId}>{selectedArduino.id}</div>
                      <div style={styles.boardLocation}>📍 {selectedArduino.location}</div>
                    </div>
                  </div>
                  
                  {selectedComponents.length === 0 ? (
                    <div style={styles.selectComponentsHint}>
                      <p style={styles.hintTitle}>👈 Select components from the left panel</p>
                      <p style={styles.hintText}>Choose the sensors and modules connected to this Arduino</p>
                    </div>
                  ) : (
                    <>
                      <h2 style={styles.componentsTitle}>✨ Connected Components ({selectedComponents.length})</h2>
                      <div style={styles.componentsGrid}>
                        {selectedComponents.map((comp, i) => (
                          <div key={i} style={styles.componentCard}>
                            <button onClick={() => toggleComponent(comp)} style={styles.removeBtn} title="Remove">✕</button>
                            <div style={styles.componentIcon}>{COMPONENT_ICONS[comp.id] || '⚙️'}</div>
                            <div style={styles.componentName}>{comp.label}</div>
                            <div style={styles.componentPin}>{typeof comp.pin === 'object' ? JSON.stringify(comp.pin) : `Pin ${comp.pin}`}</div>
                          </div>
                        ))}
                      </div>
                      <div style={styles.readyMessage}>
                        <p style={styles.readyTitle}>✓ Ready to Generate Code</p>
                        <p style={styles.readyHint}>Switch to Code tab to view sketch</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <>
              <div style={styles.codeHeader}>
                <div style={styles.codeInfo}>
                  <span style={styles.codeIcon}>📝</span>
                  <span style={styles.codeTitle}>Generated Code</span>
                  {selectedArduino && <span style={styles.codeFilename}>{selectedArduino.id}.ino</span>}
                </div>
                <div style={styles.codeActions}>
                  <button onClick={() => setIsEditMode(!isEditMode)} style={{ ...styles.codeBtn, backgroundColor: isEditMode ? 'rgba(59,130,246,0.2)' : '#1a1a22', color: isEditMode ? '#60a5fa' : '#ccc' }}>✏️ {isEditMode ? 'View' : 'Edit'}</button>
                  <button onClick={copyCode} style={styles.codeBtn}>{copied ? '✓ Copied' : '📋 Copy'}</button>
                  <button onClick={downloadCode} style={styles.downloadBtn}>📥 Download</button>
                </div>
              </div>
              {isEditMode ? (
                <textarea value={editableCode} onChange={e => setEditableCode(e.target.value)} style={styles.codeTextarea} spellCheck="false" />
              ) : (
                <pre style={styles.codeArea}>
                  {generatedCode.split('\n').map((line, i) => (
                    <div key={i} style={styles.codeLine}>
                      <span style={styles.lineNumber}>{i + 1}</span>
                      <span style={getLineStyle(line)}>{line || ' '}</span>
                    </div>
                  ))}
                </pre>
              )}
            </>
          )}
        </main>

        <aside style={styles.rightPanel}>
          <div style={styles.logHeader}>
            <span style={styles.logTitle}>📟 Activity Log</span>
            <button onClick={() => setSerialLog([])} style={styles.clearLogBtn}>🗑️</button>
          </div>
          <div style={styles.logArea}>
            {serialLog.length === 0 ? <p style={styles.logEmpty}>No activity...</p> : serialLog.map((log, i) => (
              <div key={i} style={styles.logEntry}>
                <span style={styles.logTime}>{log.timestamp}</span>
                <span style={{ ...styles.logMessage, color: getLogColor(log.type) }}>{log.message}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </aside>
      </div>

      {showAgentInstaller && (
        <div style={styles.modalOverlay} onClick={() => setShowAgentInstaller(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAgentInstaller(false)} style={styles.modalClose}>✕</button>
            <div style={styles.modalIcon}>🔧</div>
            <h2 style={styles.modalTitle}>Flash Agent Required</h2>
            <p style={styles.modalText}>Run the Flash Agent to upload code to your Arduino.</p>
            <div style={styles.installerSteps}>
              <div style={styles.step}><span style={styles.stepNumber}>1</span><div><p style={styles.stepTitle}>Open terminal in backend folder</p></div></div>
              <div style={styles.step}><span style={styles.stepNumber}>2</span><div><p style={styles.stepTitle}>Run: python flash_agent.py</p></div></div>
              <div style={styles.step}><span style={styles.stepNumber}>3</span><div><p style={styles.stepTitle}>Click Connect below</p></div></div>
            </div>
            <button onClick={() => { setShowAgentInstaller(false); connectToAgent(); }} style={styles.tryConnectBtn}>🔌 Connect to Agent</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0f', color: '#e5e5e5', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  header: { backgroundColor: '#0f0f16', borderBottom: '1px solid #1f1f2e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoIcon: { width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' },
  title: { fontSize: '24px', fontWeight: '700', margin: 0, background: 'linear-gradient(135deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '13px', color: '#6b7280', margin: 0 },
  headerActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  agentStatus: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: '#1a1a22', borderRadius: '8px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
  statusText: { fontSize: '13px', color: '#9ca3af' },
  reconnectBtn: { marginLeft: '8px', padding: '4px 10px', backgroundColor: 'transparent', border: '1px solid #333', borderRadius: '6px', color: '#9ca3af', fontSize: '12px', cursor: 'pointer' },
  progressContainer: { padding: '12px 24px', backgroundColor: '#111118' },
  progressInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#9ca3af' },
  progressBar: { width: '100%', height: '6px', backgroundColor: '#1f1f2e', borderRadius: '3px', overflow: 'hidden' },
  progressFill: { height: '100%', transition: 'width 0.3s ease', borderRadius: '3px' },
  main: { display: 'flex', height: 'calc(100vh - 85px)' },
  sidebar: { width: '340px', borderRight: '1px solid #1f1f2e', backgroundColor: '#0c0c12', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  searchBox: { padding: '20px', borderBottom: '1px solid #1f1f2e' },
  label: { fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'block' },
  inputRow: { display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '12px 14px', backgroundColor: '#1a1a22', border: '1px solid #2a2a3a', borderRadius: '8px', color: 'white', fontSize: '14px', fontFamily: "'SF Mono', Consolas, monospace", outline: 'none' },
  searchBtn: { padding: '12px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '16px' },
  errorText: { marginTop: '8px', fontSize: '13px', color: '#f87171' },
  dropdown: { marginTop: '12px', position: 'relative' },
  dropdownBtn: { width: '100%', padding: '12px 14px', backgroundColor: '#1a1a22', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#6b7280', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' },
  dropdownMenu: { position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: '#1a1a22', border: '1px solid #2a2a3a', borderRadius: '8px', zIndex: 10, maxHeight: '220px', overflowY: 'auto' },
  dropdownItem: { width: '100%', padding: '12px 14px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #2a2a3a', color: 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' },
  dropdownId: { fontFamily: "'SF Mono', Consolas, monospace", color: '#34d399', fontSize: '12px' },
  arduinoInfo: { padding: '16px 20px', borderBottom: '1px solid #1f1f2e', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08))' },
  arduinoHeader: { display: 'flex', gap: '14px', alignItems: 'center' },
  boardIcon: { width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' },
  arduinoName: { margin: 0, fontSize: '16px', fontWeight: '600', color: 'white' },
  arduinoId: { margin: '4px 0 6px', fontFamily: "'SF Mono', Consolas, monospace", fontSize: '13px', color: '#34d399' },
  boardTag: { display: 'inline-block', padding: '3px 8px', backgroundColor: '#1a1a22', borderRadius: '4px', fontSize: '11px', color: '#6b7280' },
  portSection: { padding: '16px 20px', borderBottom: '1px solid #1f1f2e' },
  portHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  refreshBtn: { padding: '4px 8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' },
  portSelect: { width: '100%', padding: '10px 12px', backgroundColor: '#1a1a22', border: '1px solid #2a2a3a', borderRadius: '8px', color: 'white', fontSize: '13px', fontFamily: "'SF Mono', Consolas, monospace", cursor: 'pointer', outline: 'none' },
  compHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' },
  compCount: { fontSize: '13px', color: '#9ca3af' },
  compActions: { display: 'flex', gap: '6px' },
  actionBtn: { padding: '4px 10px', backgroundColor: 'rgba(16,185,129,0.15)', border: 'none', borderRadius: '4px', color: '#34d399', fontSize: '12px', cursor: 'pointer' },
  clearBtn: { padding: '4px 10px', backgroundColor: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '4px', color: '#f87171', fontSize: '12px', cursor: 'pointer' },
  compList: { flex: 1, overflowY: 'auto', padding: '0 12px 12px' },
  compItem: { width: '100%', padding: '14px', marginBottom: '6px', borderRadius: '10px', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' },
  compCheck: { width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', flexShrink: 0 },
  compInfo: { flex: 1 },
  compLabel: { fontSize: '14px', fontWeight: '500', color: 'white' },
  compPin: { fontSize: '11px', color: '#6b7280', marginTop: '2px', fontFamily: "'SF Mono', Consolas, monospace" },
  compIcon: { fontSize: '20px' },
  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#4b5563' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px', opacity: 0.6 },
  emptyTitle: { fontSize: '15px', fontWeight: '500', margin: '0 0 6px' },
  emptyHint: { fontSize: '12px', color: '#4b5563' },
  librariesSection: { padding: '14px 20px', borderTop: '1px solid #1f1f2e', backgroundColor: '#0f0f16' },
  librariesHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#9ca3af' },
  librariesList: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  libraryTag: { padding: '4px 10px', backgroundColor: 'rgba(251,191,36,0.1)', borderRadius: '4px', fontSize: '11px', color: '#fbbf24' },
  codePanel: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#080810', overflow: 'hidden' },
  tabsContainer: { display: 'flex', borderBottom: '1px solid #1f1f2e', backgroundColor: '#0c0c12', padding: '0 20px' },
  tab: { padding: '14px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#6b7280', border: 'none', backgroundColor: 'transparent', borderBottom: '2px solid transparent', transition: 'all 0.2s' },
  tabActive: { color: '#34d399', borderBottomColor: '#34d399' },
  visualContent: { flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  visualEmpty: { textAlign: 'center', marginTop: '80px' },
  visualEmptyIcon: { fontSize: '80px', marginBottom: '20px', opacity: 0.5 },
  visualEmptyTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#6b7280' },
  visualBoard: { width: '100%' },
  boardSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '50px' },
  boardImage: { fontSize: '100px', marginBottom: '20px' },
  boardInfo: { textAlign: 'center' },
  boardName: { fontSize: '22px', fontWeight: '700', color: '#34d399', marginBottom: '8px' },
  boardId: { fontSize: '14px', color: '#6b7280', fontFamily: "'SF Mono', Consolas, monospace", marginBottom: '8px' },
  boardLocation: { fontSize: '12px', color: '#4b5563' },
  componentsTitle: { textAlign: 'center', color: '#34d399', marginBottom: '30px', fontSize: '18px', fontWeight: '600' },
  componentsGrid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '40px' },
  componentCard: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px', borderRadius: '14px', backgroundColor: 'rgba(16,185,129,0.08)', border: '2px solid rgba(16,185,129,0.3)', minWidth: '140px', transition: 'all 0.3s' },
  removeBtn: { position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ef4444', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' },
  componentIcon: { fontSize: '48px' },
  componentName: { fontSize: '14px', fontWeight: '600', color: '#34d399', textAlign: 'center' },
  componentPin: { fontSize: '11px', color: '#6b7280', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '6px', fontFamily: "'SF Mono', Consolas, monospace" },
  readyMessage: { textAlign: 'center', padding: '24px', borderRadius: '12px', backgroundColor: 'rgba(16,185,129,0.08)', border: '2px solid rgba(16,185,129,0.2)', maxWidth: '400px', margin: '0 auto' },
  readyTitle: { color: '#34d399', fontSize: '14px', fontWeight: '600', margin: '0 0 8px' },
  readyHint: { color: '#6b7280', fontSize: '12px', margin: 0 },
  selectComponentsHint: { textAlign: 'center', padding: '40px', borderRadius: '12px', backgroundColor: 'rgba(59,130,246,0.08)', border: '2px dashed rgba(59,130,246,0.3)', maxWidth: '400px', margin: '0 auto' },
  hintTitle: { color: '#60a5fa', fontSize: '16px', fontWeight: '600', margin: '0 0 8px' },
  hintText: { color: '#6b7280', fontSize: '13px', margin: 0 },
  codeHeader: { padding: '14px 20px', borderBottom: '1px solid #1f1f2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0c0c12' },
  codeInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  codeIcon: { fontSize: '18px' },
  codeTitle: { fontWeight: '600', color: '#e5e5e5' },
  codeFilename: { padding: '4px 10px', backgroundColor: '#1a1a22', borderRadius: '4px', fontSize: '11px', color: '#6b7280', fontFamily: "'SF Mono', Consolas, monospace" },
  codeActions: { display: 'flex', gap: '8px' },
  codeBtn: { padding: '8px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#1a1a22', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' },
  downloadBtn: { padding: '8px 14px', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(6,182,212,0.15)', color: '#22d3ee', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  codeArea: { flex: 1, overflowY: 'auto', padding: '20px', margin: 0, fontFamily: "'SF Mono', Consolas, 'Courier New', monospace", fontSize: '13px', lineHeight: '1.7', backgroundColor: '#080810', color: '#d1d5db' },
  codeTextarea: { flex: 1, padding: '20px', margin: 0, fontFamily: "'SF Mono', Consolas, 'Courier New', monospace", fontSize: '13px', lineHeight: '1.7', backgroundColor: '#080810', color: '#d1d5db', border: 'none', outline: 'none', resize: 'none' },
  codeLine: { display: 'flex' },
  lineNumber: { width: '40px', textAlign: 'right', paddingRight: '14px', color: '#3f3f4a', userSelect: 'none', borderRight: '1px solid #1f1f2e', marginRight: '14px' },
  rightPanel: { width: '280px', borderLeft: '1px solid #1f1f2e', backgroundColor: '#0c0c12', display: 'flex', flexDirection: 'column' },
  logHeader: { padding: '14px 16px', borderBottom: '1px solid #1f1f2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logTitle: { fontWeight: '600', color: '#e5e5e5' },
  clearLogBtn: { padding: '4px 8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#6b7280' },
  logArea: { flex: 1, overflowY: 'auto', padding: '12px' },
  logEmpty: { color: '#4b5563', fontSize: '13px' },
  logEntry: { padding: '4px 0', fontSize: '11px', fontFamily: "'SF Mono', Consolas, monospace", borderBottom: '1px solid #1a1a22' },
  logTime: { color: '#4b5563', marginRight: '8px' },
  logMessage: { wordBreak: 'break-word' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { position: 'relative', backgroundColor: '#111118', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%', border: '1px solid #2a2a3a', textAlign: 'center' },
  modalClose: { position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '18px', cursor: 'pointer' },
  modalIcon: { fontSize: '64px', marginBottom: '16px' },
  modalTitle: { fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: 'white' },
  modalText: { fontSize: '14px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '24px' },
  installerSteps: { textAlign: 'left', marginBottom: '24px' },
  step: { display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' },
  stepNumber: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', flexShrink: 0 },
  stepTitle: { fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 },
  tryConnectBtn: { padding: '14px 28px', backgroundColor: 'transparent', border: '1px solid #34d399', borderRadius: '8px', color: '#34d399', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }
};