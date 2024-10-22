import { hexCBInstructionMap } from "./../constants/hexCBInstructionMap";
import { hexInstructionMap } from "./../constants/hexInstructionMap";
import { hexCharJPMap, charHexJPMap } from "./../constants/hexCharJPMaps";
import { hexCharENMap, charHexENMap } from "./../constants/hexCharENMaps";

const charHexMap = (language: string) => {
  switch (language) {
    case "en":
      return charHexENMap;
    case "ja":
      return charHexJPMap;
  }
  return charHexENMap;
};

const hexCharMap = (language: string) => {
  switch (language) {
    case "en":
      return hexCharENMap;
    case "ja":
      return hexCharJPMap;
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

const normalize = (str: string) =>
  str.toLowerCase().replace(/\s+/g, " ").trim();

const patternToRegex = (pattern: string): RegExp => {
  let regexStr = "";
  let i = 0;
  while (i < pattern.length) {
    if (pattern[i] === "*") {
      if (i + 1 < pattern.length && pattern[i + 1] === "*") {
        regexStr += "([0-9A-Fa-f]{4})";
        i += 2;
      } else {
        regexStr += "([0-9A-Fa-f]{2})";
        i += 1;
      }
    } else if (pattern[i] === ",") {
      regexStr += "\\s*,\\s*";
      i += 1;
    } else {
      const specialChars = /[.*+?^=!:${}()|[\]/\\]/;
      if (specialChars.test(pattern[i])) {
        regexStr += "\\" + pattern[i];
      } else {
        regexStr += pattern[i];
      }
      i += 1;
    }
  }
  return new RegExp(`^${regexStr}$`);
};

export const programToHex = (program: string): string => {
  const lines = program.split("\n");
  let hexString = "";

  interface InstructionInfo {
    opcode: string;
    operandPattern: string;
  }

  const instructionMap: { [instruction: string]: InstructionInfo[] } = {};
  const cbInstructionMapParsed: { [instruction: string]: InstructionInfo[] } =
    {};

  for (const [hex, template] of Object.entries(hexInstructionMap)) {
    const normalizedTemplate = normalize(template);
    const firstSpaceIndex = normalizedTemplate.indexOf(" ");
    if (firstSpaceIndex === -1) {
      const instruction = normalizedTemplate;
      const operandPattern = "";

      if (!instructionMap[instruction]) {
        instructionMap[instruction] = [];
      }

      instructionMap[instruction].push({
        opcode: hex.toUpperCase(),
        operandPattern: operandPattern,
      });
    } else {
      const instruction = normalizedTemplate.slice(0, firstSpaceIndex);
      const operandPattern = normalizedTemplate
        .slice(firstSpaceIndex + 1)
        .trim();

      if (!instructionMap[instruction]) {
        instructionMap[instruction] = [];
      }

      instructionMap[instruction].push({
        opcode: hex.toUpperCase(),
        operandPattern: operandPattern,
      });
    }
  }

  for (const [hex, template] of Object.entries(hexCBInstructionMap)) {
    const normalizedTemplate = normalize(template);
    if (!cbInstructionMapParsed[normalizedTemplate]) {
      cbInstructionMapParsed[normalizedTemplate] = [];
    }

    cbInstructionMapParsed[normalizedTemplate].push({
      opcode: hex.toUpperCase(),
      operandPattern: "",
    });
  }

  const sortInstructionMap = (map: {
    [instruction: string]: InstructionInfo[];
  }) => {
    for (const instruction in map) {
      map[instruction].sort((a, b) => {
        const aWildcards = (a.operandPattern.match(/\*/g) || []).length;
        const bWildcards = (b.operandPattern.match(/\*/g) || []).length;
        return aWildcards - bWildcards;
      });
    }
  };

  sortInstructionMap(instructionMap);
  sortInstructionMap(cbInstructionMapParsed);

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
        } else {
          continue;
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

        operandsHex = operandsHex.trim();

        return { opcode, operandsHex };
      }
    }

    return null;
  };

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    line = line.replace(/\s+/g, " ").trim();

    const normalizedLine = normalize(line);
    if (cbInstructionMapParsed[normalizedLine]) {
      const cbInstructionInfo = cbInstructionMapParsed[normalizedLine][0];
      const opcode = `CB ${cbInstructionInfo.opcode}`;
      hexString += `${opcode} `;
      return;
    }

    let instructionPart = "";
    let operandPart = "";

    const firstSpaceIndex = line.indexOf(" ");
    if (firstSpaceIndex === -1) {
      instructionPart = normalize(line);
      operandPart = "";
    } else {
      instructionPart = normalize(line.slice(0, firstSpaceIndex));
      operandPart = line.slice(firstSpaceIndex + 1).trim();
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
