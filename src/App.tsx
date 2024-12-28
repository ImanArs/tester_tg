import { useLayoutEffect, useState } from "react";
import "./App.css";
import WebApp from "@twa-dev/sdk";

function App() {
  const [theme] = useState(WebApp.themeParams);
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });

  useLayoutEffect(() => {
    async function initializeWebApp() {
      WebApp.ready();

      // Проверяем WebApp.ready и запускаем сенсоры
      await initializeSensorsWithRetry(WebApp.Accelerometer, "Акселерометр");
      await initializeSensorsWithRetry(WebApp.Gyroscope, "Гироскоп");

      // Устанавливаем интервалы для обновления данных
      const accelerometerInterval = setInterval(() => {
        setAccelerometerData({
          x: WebApp.Accelerometer.x || 0,
          y: WebApp.Accelerometer.y || 0,
          z: WebApp.Accelerometer.z || 0,
        });
      }, 500);

      const gyroscopeInterval = setInterval(() => {
        setGyroscopeData({
          x: WebApp.Gyroscope.x || 0,
          y: WebApp.Gyroscope.y || 0,
          z: WebApp.Gyroscope.z || 0,
        });
      }, 500);

      // Очистка ресурсов при размонтировании
      return () => {
        clearInterval(accelerometerInterval);
        clearInterval(gyroscopeInterval);
        WebApp.Accelerometer.stop();
        WebApp.Gyroscope.stop();
      };
    }

    initializeWebApp();
  }, []);

  // Функция с логикой повторного запуска сенсоров
  async function initializeSensorsWithRetry(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sensor: any,
    sensorName: string,
    maxAttempts = 5,
    delay = 1000
  ) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const started = await new Promise((resolve) => {
        sensor.start({ refresh_rate: 500 }, resolve);
      });

      if (started) {
        WebApp.showAlert(`${sensorName} запущен`);
        return true;
      }

      attempts++;
      await new Promise((res) => setTimeout(res, delay));
    }

    WebApp.showAlert(
      `Не удалось запустить ${sensorName} после ${maxAttempts} попыток`
    );
    return false;
  }

  const copyInitData = () => {
    navigator.clipboard
      .writeText(WebApp.initData)
      .then(() => {
        console.log("Данные скопированы в буфер обмена:", WebApp.initData);
      })
      .catch((err) => {
        WebApp.showAlert("Ошибка при копировании в буфер обмена:", err);
      });
  };

  return (
    <div style={{ backgroundColor: theme.bg_color, color: theme.text_color }}>
      <h1>Telegram Mini App</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 25 }}>
        <button onClick={copyInitData}>Скопировать initData</button>
        <button onClick={() => WebApp.close()}>Закрыть</button>
      </div>
      <div>
        <h2>Акселерометр</h2>
        <p>X: {+accelerometerData.x.toFixed(2)} м/с²</p>
        <p>Y: {+accelerometerData.y.toFixed(2)} м/с²</p>
        <p>Z: {+accelerometerData.z.toFixed(2)} м/с²</p>
      </div>
      <div>
        <h2>Гироскоп</h2>
        <p>X: {+gyroscopeData.x.toFixed(2)} рад/с</p>
        <p>Y: {+gyroscopeData.y.toFixed(2)} рад/с</p>
        <p>Z: {+gyroscopeData.z.toFixed(2)} рад/с</p>
      </div>
    </div>
  );
}

export default App;
