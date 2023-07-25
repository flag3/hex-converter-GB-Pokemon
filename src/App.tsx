import { useState, ChangeEvent } from "react";
import { hexToZ80InstructionMap } from "./hexToZ80InstructionMap";
import { hexToCBPrefixedZ80InstructionMap } from "./hexToCBPrefixedZ80InstructionMap";
import {
  stringToHexMap,
  hexToStringMap,
  specialStringToHexMap,
} from "./stringAndHexMaps";
import "./App.css";

function App() {
  const [string, setString] = useState("");
  const [hex, setHex] = useState("");
  const [program, setProgram] = useState("");

  const handleStringChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newString = event.target.value;
    const newHex = stringToHex(newString);
    const newProgram = hexToZ80Program(newHex.replace(/\s/g, ""));
    setString(newString);
    setHex(newHex);
    setProgram(newProgram);
  };

  const handleHexChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newHex = event.target.value.replace(/[^0-9A-Fa-f\s]/g, "");
    const newString = hexToString(newHex.replace(/\s/g, "").toUpperCase());
    const newProgram = hexToZ80Program(newHex.replace(/\s/g, "").toUpperCase());
    setHex(newHex);
    setString(newString);
    setProgram(newProgram);
  };

  const stringToHex = (str: string) => {
    return str
      .split("")
      .map((char) => specialStringToHexMap[char] || stringToHexMap[char] || "")
      .join(" ");
  };

  const hexToString = (hex: string) => {
    const hexArray = hex.match(/.{1,2}/g) || [];
    return hexArray.map((hex) => hexToStringMap[hex] || "").join("");
  };

  const hexToZ80Program = (hex: string) => {
    const hexArray = hex.match(/.{1,2}/g) || [];
    let program = "";
    for (let i = 0; i < hexArray.length; i++) {
      let instruction: string;
      if (hexArray[i] === "CB") {
        instruction =
          hexToCBPrefixedZ80InstructionMap[hexArray[++i]] || "prefix cb";
      } else {
        instruction = hexToZ80InstructionMap[hexArray[i]] || "";
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
              : "**")
        );
      } else if (operandCount === 1) {
        instruction = instruction.replace(
          "*",
          operands[0]
            ? operands[0].length === 1
              ? operands[0] + "*"
              : operands[0]
            : "**"
        );
      }
      program += instruction + "\n";
      i += operandCount;
    }
    return program;
  };

  return (
    <div className="App">
      <h2>Pokemon Z80 Hex and String Converter</h2>

      <label>文字列</label>
      <textarea
        value={string}
        onChange={handleStringChange}
        rows={20}
        cols={40}
      />

      <label>16進数</label>
      <textarea value={hex} onChange={handleHexChange} rows={20} cols={40} />

      <label>Z80</label>
      <textarea value={program} readOnly rows={20} cols={40} />
    </div>
  );
}

export default App;
