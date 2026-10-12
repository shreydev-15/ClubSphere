export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
}) {
  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`.trim()}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? '14px' : undefined),
      }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <Skeleton width="40%" height="20px" className="mb-2" />
      <Skeleton width="80%" height="14px" className="mb-1" />
      <Skeleton width="60%" height="14px" className="mb-4" />
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton width="70px" height="24px" />
        <Skeleton width="90px" height="24px" />
      </div>
    </div>
  );
}
