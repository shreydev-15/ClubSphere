export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
  const variantClass = `badge-${variant}`;
  const sizeClass = `badge-${size}`;

  return (
    <span className={`badge ${variantClass} ${sizeClass} ${className}`.trim()}>
      {children}
    </span>
  );
}
