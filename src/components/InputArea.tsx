import { ChangeEvent } from "react";

interface InputAreaProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const InputArea = ({ label, value, onChange }: InputAreaProps) => {
  return (
    <div>
      <label>{label}</label>
      <textarea value={value} onChange={onChange} rows={20} cols={44} />
    </div>
  );
}
