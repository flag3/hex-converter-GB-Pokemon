import { memo } from "react";

export const ResetButton = memo(({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick}>
      <span className="material-icons-outlined">delete</span>
    </button>
  );
});
