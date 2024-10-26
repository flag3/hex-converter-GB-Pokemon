import { hexCBInstructionMap } from "./../constants/hexCBInstructionMap";
import { hexInstructionMap } from "./../constants/hexInstructionMap";
import { hexCharENMap, charHexENMap } from "./../constants/hexCharENMaps";
import { hexCharFRDEMap, charHexFRDEMap } from "./../constants/hexCharFRDEMaps";
import { hexCharITESMap, charHexITESMap } from "./../constants/hexCharITESMaps";
import { hexCharJAMap, charHexJAMap } from "./../constants/hexCharJAMaps";

const charHexMap = (language: string) => {
  switch (language) {
    case "en":
      return charHexENMap;
    case "fr":
      return charHexFRDEMap;
    case "de":
      return charHexFRDEMap;
    case "it":
      return charHexITESMap;
    case "es":
      return charHexITESMap;
    case "ja":
      return charHexJAMap;
  }
  return charHexENMap;
};

const hexCharMap = (language: string) => {
  switch (language) {
    case "en":
      return hexCharENMap;
    case "fr":
      return hexCharFRDEMap;
    case "de":
      return hexCharFRDEMap;
    case "it":
      return hexCharITESMap;
    case "es":
      return hexCharITESMap;
    case "ja":
      return hexCharJAMap;
  }
  return hexCharENMap;
};

export const textToHex = (text: string, language: string) => {
  const result = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (nextChar === "\u3099" || nextChar === "\u309A") {
      const combinedChar = char + nextChar;

      if (charHexMap(language)[combinedChar]) {
        result.push(charHexMap(language)[combinedChar]);
      } else {
        result.push("");
      }

      i++;
    } else {
      result.push(charHexMap(language)[char] || "");
    }
  }

  return result.join(" ");
};

export const hexToText = (hex: string, language: string) => {
  const hexArray =
    hex
      .replace(/\s/g, "")
      .toUpperCase()
      .match(/.{1,2}/g) || [];
  return hexArray.map((hex) => hexCharMap(language)[hex] || "").join("");
};

export const hexToProgram = (hex: string) => {
  const hexArray =
    hex
      .replace(/\s/g, "")
      .toUpperCase()
      .match(/.{1,2}/g) || [];
  let program = "";
  for (let i = 0; i < hexArray.length; i++) {
    let instruction: string;
    if (hexArray[i] === "CB") {
      instruction =
        hexCBInstructionMap[hexArray[++i]] ||
        hexInstructionMap[hexArray[i - 1]];
    } else {
      instruction = hexInstructionMap[hexArray[i]] || "";
    }

    const operandCount = (instruction.match(/\*/g) || []).length;
    const operands = hexArray.slice(i + 1, i + 1 + operandCount);

    if (operandCount === 2) {
      instruction = instruction.replace(
        "**",
        `${operands[1] ? (operands[1].length === 1 ? `${operands[1]}*` : operands[1]) : "**"}${operands[0] ? (operands[0].length === 1 ? `${operands[0]}*` : operands[0]) : "**"}`,
      );
    } else if (operandCount === 1) {
      instruction = instruction.replace(
        "*",
        `${operands[0] ? (operands[0].length === 1 ? `${operands[0]}*` : operands[0]) : "**"}`,
      );
    }
    i += operandCount;
    if (i < hexArray.length - 1) {
      program += `${instruction}\n`;
    } else {
      program += instruction;
    }
  }
  return program;
};

const patternToRegex = (pattern: string): RegExp => {
  let regexStr = "";
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "*") {
      if (i + 1 < pattern.length && pattern[i + 1] === "*") {
        regexStr += "([0-9A-Fa-f]{4})";
        i++;
      } else {
        regexStr += "([0-9A-Fa-f]{2})";
      }
    } else if (pattern[i] === ",") {
      regexStr += "\\s*,\\s*";
    } else {
      const specialChars = /[.*+?^=!:${}()|[\]/\\]/;
      if (specialChars.test(pattern[i])) {
        regexStr += "\\" + pattern[i];
      } else {
        regexStr += pattern[i];
      }
    }
  }
  return new RegExp(`^${regexStr}$`);
};

interface InstructionInfo {
  opcode: string;
  operandPattern: string;
}

const parseInstruction = (
  instructionPart: string,
  operandPart: string,
  map: { [instruction: string]: InstructionInfo[] },
): { opcode: string; operandsHex: string } | null => {
  if (!map[instructionPart]) {
    return null;
  }

  for (const instructionInfo of map[instructionPart]) {
    const { opcode, operandPattern } = instructionInfo;

    if (operandPattern === "") {
      if (operandPart.length === 0) {
        return { opcode, operandsHex: "" };
      }
    }

    const regex = patternToRegex(operandPattern);
    const match = operandPart.match(regex);

    if (match) {
      let operandsHex = "";

      const operandMatches = match.slice(1);

      for (let i = 0; i < operandMatches.length; i++) {
        const wildcard = operandMatches[i];
        if (operandPattern.includes("**")) {
          const lowByte = wildcard.slice(2, 4);
          const highByte = wildcard.slice(0, 2);
          operandsHex += `${lowByte} ${highByte} `;
        } else {
          operandsHex += `${wildcard} `;
        }
      }

      operandsHex = operandsHex.trim().toUpperCase();

      return { opcode, operandsHex };
    }
  }

  return null;
};

export const programToHex = (program: string): string => {
  const lines = program.split("\n");
  let hexString = "";

  const instructionMap: { [instruction: string]: InstructionInfo[] } = {};
  const cbInstructionMap: { [instruction: string]: InstructionInfo[] } = {};

  for (const [hex, template] of Object.entries(hexInstructionMap)) {
    const firstSpaceIndex = template.indexOf(" ");
    if (firstSpaceIndex === -1) {
      const instruction = template;
      const operandPattern = "";

      if (!instructionMap[instruction]) {
        instructionMap[instruction] = [];
      }

      instructionMap[instruction].push({
        opcode: hex,
        operandPattern: operandPattern,
      });
    } else {
      const instruction = template.slice(0, firstSpaceIndex);
      const operandPattern = template.slice(firstSpaceIndex + 1).trim();

      if (!instructionMap[instruction]) {
        instructionMap[instruction] = [];
      }

      instructionMap[instruction].push({
        opcode: hex,
        operandPattern: operandPattern,
      });
    }
  }

  for (const [hex, template] of Object.entries(hexCBInstructionMap)) {
    const normalizedTemplate = template.replace(/\s+/g, " ");
    if (!cbInstructionMap[normalizedTemplate]) {
      cbInstructionMap[normalizedTemplate] = [];
    }

    cbInstructionMap[normalizedTemplate].push({
      opcode: hex,
      operandPattern: "",
    });
  }

  lines.forEach((line) => {
    line = line.replace(/\s+/g, " ").trim();

    if (cbInstructionMap[line]) {
      const cbInstructionInfo = cbInstructionMap[line][0];
      const opcode = `CB ${cbInstructionInfo.opcode}`;
      hexString += `${opcode} `;
      return;
    }

    let instructionPart = "";
    let operandPart = "";

    const firstSpaceIndex = line.indexOf(" ");
    if (firstSpaceIndex === -1) {
      instructionPart = line;
      operandPart = "";
    } else {
      instructionPart = line.slice(0, firstSpaceIndex);
      operandPart = line.slice(firstSpaceIndex + 1);
    }

    const currentInstructionMap = instructionMap;

    const parsed = parseInstruction(
      instructionPart,
      operandPart,
      currentInstructionMap,
    );

    if (!parsed) {
      return;
    }

    const { opcode, operandsHex } = parsed;

    if (operandsHex) {
      hexString += `${opcode} ${operandsHex} `;
    } else {
      hexString += `${opcode} `;
    }
  });

  return hexString.trim();
};
