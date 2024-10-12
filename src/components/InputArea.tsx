import React, { ChangeEvent } from "react";

interface InputAreaProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <textarea value={value} onChange={onChange} rows={20} cols={48} />
    </div>
  );
};

export default InputArea;
