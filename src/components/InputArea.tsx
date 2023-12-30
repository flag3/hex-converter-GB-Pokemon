import React, { ChangeEvent } from "react";

interface InputAreaProps {
  label: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <div>
      <label>{label}</label>
      <textarea
        value={value}
        onChange={onChange ? onChange : undefined}
        readOnly={readOnly}
        rows={20}
        cols={48}
      />
    </div>
  );
};

export default InputArea;
