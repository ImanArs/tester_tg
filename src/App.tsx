import { useEffect, useState } from 'react';
import WebApp from "@twa-dev/sdk";

const App = () => {
  const [theme, setTheme] = useState(WebApp.themeParams);

  useEffect(() => {
    WebApp.onEvent('themeChanged', () => {
      setTheme(WebApp.themeParams);
    });
  }, []);

  useEffect(() => {
    WebApp.ready(); // Сообщаем Telegram, что приложение готово
    console.log('Данные о запуске:', WebApp.initDataUnsafe);
  }, []);

  return (
    <div style={{ backgroundColor: theme.bg_color, color: theme.text_color }}>
      <h1>Telegram Mini App</h1>
      <button onClick={() => WebApp.close()}>Закрыть</button>
    </div>
  );
};

export default App;
