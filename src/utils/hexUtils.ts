import { hexCBInstructionMap } from "./../data/hexCBInstructionMap";
import { hexInstructionMap } from "./../data/hexInstructionMap";
import { hexCharJPMap, charHexJPMap } from "./../data/hexCharJPMaps";
import { hexCharENMap, charHexENMap } from "./../data/hexCharENMaps";
import { Language } from "./../types";

const charHexMap = (language: Language) => {
  switch (language) {
    case "en":
      return charHexENMap;
    case "jp":
      return charHexJPMap;
  }
  return charHexENMap;
};

const hexCharMap = (language: Language) => {
  switch (language) {
    case "en":
      return hexCharENMap;
    case "jp":
      return hexCharJPMap;
  }
  return hexCharENMap;
};

export const textToHex = (text: string, language: Language) => {
  return text
    .split("")
    .map((char) => charHexMap(language)[char] || "")
    .join(" ");
};

export const hexToText = (hex: string, language: Language) => {
  const hexArray = hex.match(/.{1,2}/g) || [];
  return hexArray.map((hex) => hexCharMap(language)[hex] || "").join("");
};

export const hexToProgram = (hex: string) => {
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
