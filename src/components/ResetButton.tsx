export default function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}>
      <span className="material-icons-outlined">delete</span>
    </button>
  );
}
