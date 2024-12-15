import {
  instructionMap,
  instructionCBMap,
} from "./../constants/instructionMaps";
import {
  enGen1HexCharMap,
  enGen1CharHexMap,
  enGen2HexCharMap,
  enGen2CharHexMap,
} from "./../constants/enCharMaps";
import {
  frdeGen1HexCharMap,
  frdeGen1CharHexMap,
  frdeGen2HexCharMap,
  frdeGen2CharHexMap,
} from "./../constants/frdeCharMaps";
import {
  itesGen1HexCharMap,
  itesGen1CharHexMap,
  itesGen2HexCharMap,
  itesGen2CharHexMap,
} from "./../constants/itesCharMaps";
import {
  jaGen1HexCharMap,
  jaGen1CharHexMap,
  jaGen2HexCharMap,
  jaGen2CharHexMap,
} from "./../constants/jaCharMaps";
import {
  koHexCharMap,
  koCharHexMap,
  koHexChar2ByteMap,
} from "./../constants/koCharMaps";

interface CharacterMap {
  [key: string]: string;
}

interface LanguageMap {
  [language: string]: {
    gen1: { [key: string]: CharacterMap };
    gen2: { [key: string]: CharacterMap };
  };
}

const languageMaps: LanguageMap = {
  en: {
    gen1: { hex: enGen1HexCharMap, char: enGen1CharHexMap },
    gen2: { hex: enGen2HexCharMap, char: enGen2CharHexMap },
  },
  fr: {
    gen1: { hex: frdeGen1HexCharMap, char: frdeGen1CharHexMap },
    gen2: { hex: frdeGen2HexCharMap, char: frdeGen2CharHexMap },
  },
  de: {
    gen1: { hex: frdeGen1HexCharMap, char: frdeGen1CharHexMap },
    gen2: { hex: frdeGen2HexCharMap, char: frdeGen2CharHexMap },
  },
  it: {
    gen1: { hex: itesGen1HexCharMap, char: itesGen1CharHexMap },
    gen2: { hex: itesGen2HexCharMap, char: itesGen2CharHexMap },
  },
  es: {
    gen1: { hex: itesGen1HexCharMap, char: itesGen1CharHexMap },
    gen2: { hex: itesGen2HexCharMap, char: itesGen2CharHexMap },
  },
  ja: {
    gen1: { hex: jaGen1HexCharMap, char: jaGen1CharHexMap },
    gen2: { hex: jaGen2HexCharMap, char: jaGen2CharHexMap },
  },
  ko: {
    gen1: { hex: koHexCharMap, char: koCharHexMap },
    gen2: { hex: koHexCharMap, char: koCharHexMap },
  },
};

const getMap = (
  language: string,
  gen: string,
  type: "hex" | "char",
): CharacterMap => {
  const defaultMap = languageMaps.en.gen1[type];
  const languageMap = languageMaps[language];
  if (!languageMap) return defaultMap;

  return gen === "2" ? languageMap.gen2[type] : languageMap.gen1[type];
};

const charHexMap = (language: string, gen: string): CharacterMap => {
  return getMap(language, gen, "char");
};

const hexCharMap = (language: string, gen: string): CharacterMap => {
  return getMap(language, gen, "hex");
};

export const textToHex = (
  text: string,
  language: string,
  gen: string,
): string => {
  const result = [];
  const map = charHexMap(language, gen);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (["\u3099", "\u309A"].includes(nextChar)) {
      const combinedChar = char + nextChar;
      result.push(map[combinedChar] || "");
      i++;
    } else {
      result.push(map[char] || "");
    }
  }

  return result.join(" ");
};

export const hexToText = (
  hex: string,
  language: string,
  gen: string,
): string => {
  const hexArray =
    hex
      .replace(/\s/g, "")
      .toUpperCase()
      .match(/.{1,2}/g) || [];
  const map = hexCharMap(language, gen);

  if (language === "ko") {
    const result = [];
    for (let i = 0; i < hexArray.length; i++) {
      const hex = hexArray[i];
      if (hex >= "00" && hex <= "0A" && i + 1 < hexArray.length) {
        const nextHex = hexArray[i + 1];
        result.push(koHexChar2ByteMap[hex]?.[nextHex]);
        i++;
      } else {
        result.push(map[hex]);
      }
    }
    return result.join("");
  }

  return hexArray.map((hex) => map[hex] || "").join("");
};

const processOperands = (
  instruction: string,
  operands: string[],
  operandCount: number,
): string => {
  if (operandCount === 2) {
    return instruction.replace(
      "**",
      `${operands[1] ? (operands[1].length === 1 ? `${operands[1]}*` : operands[1]) : "**"}${operands[0] ? (operands[0].length === 1 ? `${operands[0]}*` : operands[0]) : "**"}`,
    );
  }
  if (operandCount === 1) {
    return instruction.replace(
      "*",
      `${operands[0] ? (operands[0].length === 1 ? `${operands[0]}*` : operands[0]) : "**"}`,
    );
  }
  return instruction;
};

export const hexToProgram = (hex: string): string => {
  const hexArray =
    hex
      .replace(/\s/g, "")
      .toUpperCase()
      .match(/.{1,2}/g) || [];
  const result = [];

  for (let i = 0; i < hexArray.length; i++) {
    let instruction: string;

    if (hexArray[i] === "CB") {
      instruction =
        instructionCBMap[hexArray[++i]] || instructionMap[hexArray[i - 1]];
    } else {
      instruction = instructionMap[hexArray[i]] || "";
    }

    const operandCount = (instruction.match(/\*/g) || []).length;
    const operands = hexArray.slice(i + 1, i + 1 + operandCount);

    instruction = processOperands(instruction, operands, operandCount);
    i += operandCount;

    result.push(instruction);
  }

  return result.join("\n");
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
  if (!map[instructionPart]) return null;

  for (const { opcode, operandPattern } of map[instructionPart]) {
    if (operandPattern === "" && operandPart.length === 0) {
      return { opcode, operandsHex: "" };
    }

    const match = operandPart.match(patternToRegex(operandPattern));
    if (!match) continue;

    const operandsHex = match
      .slice(1)
      .map((wildcard) => {
        if (operandPattern.includes("**")) {
          return `${wildcard.slice(2, 4)} ${wildcard.slice(0, 2)}`;
        }
        return wildcard;
      })
      .join(" ")
      .toUpperCase();

    return { opcode, operandsHex };
  }

  return null;
};

const buildInstructionMaps = () => {
  const instructionInfoMap: { [instruction: string]: InstructionInfo[] } = {};
  const cbInstructionInfoMap: { [instruction: string]: InstructionInfo[] } = {};

  Object.entries(instructionMap).forEach(([hex, template]) => {
    const firstSpaceIndex = template.indexOf(" ");
    const instruction =
      firstSpaceIndex === -1 ? template : template.slice(0, firstSpaceIndex);
    const operandPattern =
      firstSpaceIndex === -1 ? "" : template.slice(firstSpaceIndex + 1).trim();

    if (!instructionInfoMap[instruction]) {
      instructionInfoMap[instruction] = [];
    }

    instructionInfoMap[instruction].push({
      opcode: hex,
      operandPattern,
    });
  });

  Object.entries(instructionCBMap).forEach(([hex, template]) => {
    const normalizedTemplate = template.replace(/\s+/g, " ");
    if (!cbInstructionInfoMap[normalizedTemplate]) {
      cbInstructionInfoMap[normalizedTemplate] = [];
    }

    cbInstructionInfoMap[normalizedTemplate].push({
      opcode: hex,
      operandPattern: "",
    });
  });

  return {
    instructionInfoMap: instructionInfoMap,
    cbInstructionInfoMap: cbInstructionInfoMap,
  };
};

export const programToHex = (program: string): string => {
  const lines = program.split("\n");
  const { instructionInfoMap, cbInstructionInfoMap } = buildInstructionMaps();

  return lines
    .map((line) => {
      line = line.replace(/\s+/g, " ").trim();

      if (cbInstructionInfoMap[line]) {
        const { opcode } = cbInstructionInfoMap[line][0];
        return `CB ${opcode}`;
      }

      const firstSpaceIndex = line.indexOf(" ");
      const instructionPart =
        firstSpaceIndex === -1 ? line : line.slice(0, firstSpaceIndex);
      const operandPart =
        firstSpaceIndex === -1 ? "" : line.slice(firstSpaceIndex + 1);

      const parsed = parseInstruction(
        instructionPart,
        operandPart,
        instructionInfoMap,
      );
      if (!parsed) return "";

      const { opcode, operandsHex } = parsed;
      return operandsHex ? `${opcode} ${operandsHex}` : opcode;
    })
    .filter(Boolean)
    .join(" ");
};
