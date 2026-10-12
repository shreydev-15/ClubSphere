import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../common/Icons';

export function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && (
          <span className="input-prefix-icon" aria-hidden="true">
            <Icon size={16} />
          </span>
        )}
        <input
          id={id}
          type={computedType}
          required={required}
          className={`form-input ${Icon ? 'has-prefix' : ''} ${isPassword ? 'has-suffix' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-suffix-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        )}
      </div>
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
