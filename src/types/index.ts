export type Language = "en" | "fr" | "ge" | "it" | "sp" | "jp" | "ko";

export const LanguageOptions: {
  value: Language;
  label: string;
}[] = [
  { value: "en", label: "English" },
  { value: "jp", label: "Japanese" },
];
