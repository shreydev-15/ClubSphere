import { CloseIcon } from '../common/Icons';

export function Alert({
  variant = 'neutral',
  title,
  children,
  onClose,
  className = '',
}) {
  return (
    <div className={`alert alert-${variant} ${className}`.trim()} role="alert">
      <div className="alert-body">
        {title && <strong className="alert-title">{title}</strong>}
        <div className="alert-content">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          <CloseIcon size={14} />
        </button>
      )}
    </div>
  );
}
