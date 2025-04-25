import { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { InputArea } from "./InputArea";
import { ResetButton } from "./ResetButton";
import { Selector } from "./Selector";
import {
  textToHex,
  hexToText,
  hexToProgram,
  programToHex,
} from "./../utils/hexUtils";
import "./../App.css";

export const HexConverter = () => {
  const { t, i18n } = useTranslation();
  const [gen, setGen] = useState("1");
  const [text, setText] = useState("");
  const [hex, setHex] = useState("");
  const [program, setProgram] = useState("");

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

  return (
    <div>
      <h2>{t("title")}</h2>
      <Selector
        label={t("language")}
        value={i18n.language}
        options={[
          { value: "en", label: "English" },
          { value: "fr", label: "Français" },
          { value: "de", label: "Deutsch" },
          { value: "it", label: "Italiano" },
          { value: "es", label: "Español" },
          { value: "ja", label: "日本語" },
          { value: "ko", label: "한국어" },
        ]}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
      />
      {i18n.language !== "ko" && (
        <Selector
          label={t("gen")}
          value={gen}
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
          ]}
          onChange={(event) => setGen(event.target.value)}
        />
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
