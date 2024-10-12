import { useState, ChangeEvent } from "react";
import "./../App.css";
import { useTranslation } from "react-i18next";
import InputArea from "./InputArea";
import ResetButton from "./ResetButton";
import {
  textToHex,
  hexToText,
  hexToProgram,
  programToHex,
} from "./../utils/hexUtils";

export default function HexConverter() {
  const [text, setText] = useState("");
  const [hex, setHex] = useState("");
  const [program, setProgram] = useState("");
  const { t, i18n } = useTranslation();

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    const newHex = textToHex(newText, i18n.language);
    const newProgram = hexToProgram(newHex.replace(/\s/g, ""));
    setText(newText);
    setHex(newHex);
    setProgram(newProgram);
  };

  const handleHexChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newHex = event.target.value.replace(/[^0-9A-Fa-f\s]/g, "");
    const newText = hexToText(
      newHex.replace(/\s/g, "").toUpperCase(),
      i18n.language,
    );
    const newProgram = hexToProgram(newHex.replace(/\s/g, "").toUpperCase());
    setHex(newHex);
    setText(newText);
    setProgram(newProgram);
  };

  const handleProgramChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newProgram = event.target.value;
    const newHex = programToHex(newProgram);
    const newText = hexToText(newHex.replace(/\s/g, ""), i18n.language);
    setProgram(newProgram);
    setHex(newHex);
    setText(newText);
  };

  const handleReset = () => {
    setText("");
    setHex("");
    setProgram("");
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div>
      <h2>{t("title")}</h2>
      {t("language")}
      <select
        id="language-selector"
        onChange={handleLanguageChange}
        value={i18n.language}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="it">Italiano</option>
        <option value="es">Español</option>
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
      </select>
      <div className="input-container">
        <InputArea label={t("text")} value={text} onChange={handleTextChange} />
        <InputArea label={t("hex")} value={hex} onChange={handleHexChange} />
        <InputArea
          label={t("program")}
          value={program}
          onChange={handleProgramChange}
        />
      </div>
      <ResetButton onClick={handleReset} />
    </div>
  );
}
