export function Textarea({
  label,
  id,
  error,
  helperText,
  className = '',
  required = false,
  maxLength,
  value,
  ...props
}) {
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`.trim()}>
      <div className="form-label-row">
        {label && (
          <label htmlFor={id} className="form-label">
            {label} {required && <span className="text-required" aria-hidden="true">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="char-count">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        required={required}
        className="form-textarea"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="form-error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="form-helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
