import "./App.css";
import { HexConverter } from "./components/HexConverter";
import { initI18next } from "./i18n/config";

initI18next();

function App() {
  return <HexConverter />;
}

export default App;
