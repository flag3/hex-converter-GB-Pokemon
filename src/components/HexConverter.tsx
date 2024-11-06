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
  const [gen, setGen] = useState(1);
  const { t, i18n } = useTranslation();

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    const newHex = textToHex(newText, i18n.language, gen);
    const newProgram = hexToProgram(newHex);
    setText(newText);
    setHex(newHex);
    setProgram(newProgram);
  };

  const handleHexChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newHex = event.target.value.replace(/[^0-9A-Fa-f\s]/g, "");
    const newText = hexToText(newHex, i18n.language, gen);
    const newProgram = hexToProgram(newHex);
    setHex(newHex);
    setText(newText);
    setProgram(newProgram);
  };

  const handleProgramChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newProgram = event.target.value;
    const newHex = programToHex(newProgram);
    const newText = hexToText(newHex, i18n.language, gen);
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

  const handleGenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newGen = parseInt(event.target.value);
    setGen(newGen);
    const newHex = textToHex(text, i18n.language, newGen);
    const newProgram = hexToProgram(newHex);
    setHex(newHex);
    setProgram(newProgram);
  };

  return (
    <div>
      <h2>{t("title")}</h2>
      <div>
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
      </div>
      {i18n.language !== "ko" && (
        <div>
          {t("gen")}
          <select
            id="generation-selector"
            onChange={handleGenChange}
            value={gen}
            disabled={i18n.language === "ko"}
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
      )}
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
