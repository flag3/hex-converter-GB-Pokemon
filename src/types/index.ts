export type Language = "en" | "fr" | "de" | "it" | "es" | "ja" | "ko";
export type Generation = "1" | "2";

export interface CharacterMap {
  [key: string]: string;
}

export interface GenerationMaps {
  hex: CharacterMap;
  char: CharacterMap;
}

export interface LanguageMap {
  [language: string]: {
    gen1: GenerationMaps;
    gen2: GenerationMaps;
  };
}

export interface InstructionInfo {
  opcode: string;
  operandPattern: string;
}

export interface InstructionMaps {
  instructionInfoMap: { [instruction: string]: InstructionInfo[] };
  cbInstructionInfoMap: { [instruction: string]: InstructionInfo[] };
}

export interface SelectorOption {
  value: string;
  label: string;
}

export type MapType = "hex" | "char";
