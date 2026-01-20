type StatusBannerProps = {
  tone: 'success' | 'error';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const StatusBanner = ({ tone, message, actionLabel, onAction }: StatusBannerProps) => {
  // Tone controls styles and ARIA role.
  const className = tone === 'success' ? 'status-banner is-success' : 'status-banner is-error';
  const role = tone === 'success' ? 'status' : 'alert';

  return (
    // role=status is polite, role=alert is assertive for errors.
    <div className={className} role={role}>
      <span>{message}</span>
      {actionLabel && onAction ? (
        <button type="button" className="button-link ghost" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};
