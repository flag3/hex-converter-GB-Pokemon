import { hexCBInstructionMap } from "./../constants/hexCBInstructionMap";
import { hexInstructionMap } from "./../constants/hexInstructionMap";
import {
  hexCharENGen1Map,
  charHexENGen1Map,
} from "./../constants/hexCharENGen1Maps";
import {
  hexCharENGen2Map,
  charHexENGen2Map,
} from "./../constants/hexCharENGen2Maps";
import {
  hexCharFRDEGen1Map,
  charHexFRDEGen1Map,
} from "./../constants/hexCharFRDEGen1Maps";
import {
  hexCharFRDEGen2Map,
  charHexFRDEGen2Map,
} from "./../constants/hexCharFRDEGen2Maps";
import {
  hexCharITESGen1Map,
  charHexITESGen1Map,
} from "./../constants/hexCharITESGen1Maps";
import {
  hexCharITESGen2Map,
  charHexITESGen2Map,
} from "./../constants/hexCharITESGen2Maps";
import {
  hexCharJAGen1Map,
  charHexJAGen1Map,
} from "./../constants/hexCharJAGen1Maps";
import {
  hexCharJAGen2Map,
  charHexJAGen2Map,
} from "./../constants/hexCharJAGen2Maps";

const getMap = (
  gen: number,
  gen1Map: { [key: string]: string },
  gen2Map: { [key: string]: string },
) => {
  switch (gen) {
    case 1:
      return gen1Map;
    case 2:
      return gen2Map;
    default:
      return gen1Map;
  }
};

const charHexMap = (language: string, gen: number) => {
  switch (language) {
    case "en":
      return getMap(gen, charHexENGen1Map, charHexENGen2Map);
    case "fr":
      return getMap(gen, charHexFRDEGen1Map, charHexFRDEGen2Map);
    case "de":
      return getMap(gen, charHexFRDEGen1Map, charHexFRDEGen2Map);
    case "it":
      return getMap(gen, charHexITESGen1Map, charHexITESGen2Map);
    case "es":
      return getMap(gen, charHexITESGen1Map, charHexITESGen2Map);
    case "ja":
      return getMap(gen, charHexJAGen1Map, charHexJAGen2Map);
    default:
      return charHexENGen1Map;
  }
};

const hexCharMap = (language: string, gen: number) => {
  switch (language) {
    case "en":
      return getMap(gen, hexCharENGen1Map, hexCharENGen2Map);
    case "fr":
    case "de":
      return getMap(gen, hexCharFRDEGen1Map, hexCharFRDEGen2Map);
    case "it":
    case "es":
      return getMap(gen, hexCharITESGen1Map, hexCharITESGen2Map);
    case "ja":
      return getMap(gen, hexCharJAGen1Map, hexCharJAGen2Map);
    default:
      return hexCharENGen1Map;
  }
};

export const textToHex = (text: string, language: string, gen: number) => {
  const result = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (nextChar === "\u3099" || nextChar === "\u309A") {
      const combinedChar = char + nextChar;

      if (charHexMap(language, gen)[combinedChar]) {
        result.push(charHexMap(language, gen)[combinedChar]);
      } else {
        result.push("");
      }

      i++;
    } else {
      result.push(charHexMap(language, gen)[char] || "");
    }
  }

  return result.join(" ");
};

export const hexToText = (hex: string, language: string, gen: number) => {
  const hexArray =
    hex
      .replace(/\s/g, "")
      .toUpperCase()
      .match(/.{1,2}/g) || [];
  return hexArray.map((hex) => hexCharMap(language, gen)[hex] || "").join("");
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
