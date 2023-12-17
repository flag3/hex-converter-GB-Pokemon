import { useState, ChangeEvent } from "react";
import { hexInstructionMap } from "./hexInstructionMap";
import { hexCBInstructionMap } from "./hexCBInstructionMap";
import { charHexMap, hexCharMap, specialCharHexMap } from "./hexCharMaps";
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

  const textToHex = (str: string) => {
    return str
      .split("")
      .map((char) => specialCharHexMap[char] || charHexMap[char] || "")
      .join(" ");
  };

  const hexToText = (hex: string) => {
    const hexArray = hex.match(/.{1,2}/g) || [];
    return hexArray.map((hex) => hexCharMap[hex] || "").join("");
  };

  const hexToProgram = (hex: string) => {
    const hexArray = hex.match(/.{1,2}/g) || [];
    let program = "";
    for (let i = 0; i < hexArray.length; i++) {
      let instruction: string;
      if (hexArray[i] === "CB") {
        instruction = hexCBInstructionMap[hexArray[++i]] || "db   CB";
      } else {
        instruction = hexInstructionMap[hexArray[i]] || "";
      }

      const operandCount = (instruction.match(/\*/g) || []).length;
      const operands = hexArray.slice(i + 1, i + 1 + operandCount);

      if (operandCount === 2) {
        instruction = instruction.replace(
          "**",
          (operands[1]
            ? operands[1].length === 1
              ? operands[1] + "*"
              : operands[1]
            : "**") +
            (operands[0]
              ? operands[0].length === 1
                ? operands[0] + "*"
                : operands[0]
              : "**"),
        );
      } else if (operandCount === 1) {
        instruction = instruction.replace(
          "*",
          operands[0]
            ? operands[0].length === 1
              ? operands[0] + "*"
              : operands[0]
            : "**",
        );
      }
      program += instruction + "\n";
      i += operandCount;
    }
    return program;
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
        <div>
          <label>Text</label>
          <textarea
            value={text}
            onChange={handleTextChange}
            rows={20}
            cols={48}
          />
        </div>

        <div>
          <label>Hex</label>
          <textarea
            value={hex}
            onChange={handleHexChange}
            rows={20}
            cols={48}
          />
        </div>

        <div>
          <label>Program</label>
          <textarea value={program} readOnly rows={20} cols={48} />
        </div>
      </div>

      <div>
        <button onClick={handleReset}>
          <span className="material-icons-outlined">delete</span>
        </button>
      </div>
    </div>
  );
}

export default App;
