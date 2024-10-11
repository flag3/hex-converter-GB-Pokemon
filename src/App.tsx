import "./App.css";
import HexConverter from "./components/HexConverter";
import { initI18next } from "./i18n/config";

initI18next();

function App() {
  return (
    <div>
      <HexConverter />
    </div>
  );
}

export default App;
