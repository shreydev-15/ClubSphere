export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <span className="spinner" aria-hidden="true" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="btn-icon" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
