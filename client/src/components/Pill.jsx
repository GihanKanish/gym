export default function Pill({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${className}`}>
      {children}
    </span>
  );
}
