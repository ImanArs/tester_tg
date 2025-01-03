import { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import WebApp from "@twa-dev/sdk";

function App() {
  const [gyroData, setGyroData] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const [gyroSupported, setGyroSupported] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOrientation = (event: any) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        setGyroData({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
        });
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
      console.log("DeviceOrientationEvent is supported");
    } else {
      setGyroSupported(false);
      console.log("DeviceOrientationEvent is not supported");
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const [theme, setTheme] = useState(WebApp.themeParams);
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  useLayoutEffect(() => {
    WebApp.onEvent("themeChanged", () => {
      setTheme(WebApp.themeParams);
    });
  }, []);

  useLayoutEffect(() => {
    WebApp.ready();
    console.log("Данные о запуске:", WebApp.initDataUnsafe);

    setTimeout(() => {
      WebApp.Gyroscope.start({ refresh_rate: 500 }, (started) => {
        if (started) {
          WebApp.showAlert("Гироскоп запущен");
        } else {
          WebApp.showAlert("Не удалось запустить гироскоп");
        }
      });
    }, 0);

    const gyroscopeInterval = setInterval(() => {
      setGyroscopeData({
        x: WebApp.Gyroscope.x || 0,
        y: WebApp.Gyroscope.y || 0,
        z: WebApp.Gyroscope.z || 0,
      });
    }, 500);

    // Инициализация акселерометра
    setTimeout(() => {
      WebApp.Accelerometer.start({ refresh_rate: 500 }, () => {
        if (WebApp.Accelerometer.isStarted) {
          WebApp.showAlert("Акселерометр запущен");
        } else {
          WebApp.showAlert("Не удалось запустить акселерометр");
        }
      });
    }, 0);

    const accelerometerInterval = setInterval(() => {
      setAccelerometerData({
        x: WebApp.Accelerometer.x || 0,
        y: WebApp.Accelerometer.y || 0,
        z: WebApp.Accelerometer.z || 0,
      });
    }, 500);

    return () => {
      clearInterval(accelerometerInterval);
      clearInterval(gyroscopeInterval);
      WebApp.Accelerometer.stop((stopped) => {
        if (stopped) {
          WebApp.showAlert("Акселерометр остановлен");
        }
      });
      WebApp.Gyroscope.stop((stopped) => {
        if (stopped) {
          WebApp.showAlert("Гироскоп остановлен");
        }
      });
    };
  }, []);

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
        <p>X: {gyroscopeData.x.toFixed(2)} рад/с</p>
        <p>Y: {gyroscopeData.y.toFixed(2)} рад/с</p>
        <p>Z: {gyroscopeData.z.toFixed(2)} рад/с</p>
      </div>
      <div className="p-5 border">
        <h2>Гироскоп</h2>
        {gyroSupported ? (
          <>
            <p>Alpha (Z): {gyroData.alpha.toFixed(2)}°</p>
            <p>Beta (X): {gyroData.beta.toFixed(2)}°</p>
            <p>Gamma (Y): {gyroData.gamma.toFixed(2)}°</p>
          </>
        ) : (
          <p>Гироскоп не поддерживается вашим устройством.</p>
        )}
      </div>
    </div>
  );
}

export default App;
