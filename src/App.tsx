import { useState, ChangeEvent } from "react";
import InputArea from "./components/InputArea";
import ResetButton from "./components/ResetButton";
import { textToHex, hexToText, hexToProgram } from "./utils/hexUtils";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [hex, setHex] = useState("");
  const [program, setProgram] = useState("");

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    const newHex = textToHex(newText);
    const newProgram = hexToProgram(newHex.replace(/\s/g, ""));
    setText(newText);
    setHex(newHex);
    setProgram(newProgram);
  };

  const handleHexChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newHex = event.target.value.replace(/[^0-9A-Fa-f\s]/g, "");
    const newText = hexToText(newHex.replace(/\s/g, "").toUpperCase());
    const newProgram = hexToProgram(newHex.replace(/\s/g, "").toUpperCase());
    setHex(newHex);
    setText(newText);
    setProgram(newProgram);
  };

  const handleReset = () => {
    setText("");
    setHex("");
    setProgram("");
  };

  return (
    <div className="App">
      <h2>Hex Converter for Game Boy Pokémon</h2>
      <div className="input-container">
        <InputArea label="Text" value={text} onChange={handleTextChange} />
        <InputArea label="Hex" value={hex} onChange={handleHexChange} />
        <InputArea label="Program" value={program} readOnly />
      </div>
      <ResetButton onClick={handleReset} />
    </div>
  );
}

export default App;
