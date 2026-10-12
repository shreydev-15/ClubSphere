export function IconWrapper({ children, size = 18, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function DashboardIcon(props) {
  return (
    <IconWrapper {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </IconWrapper>
  );
}

export function ClubsIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconWrapper>
  );
}

export function EventsIcon(props) {
  return (
    <IconWrapper {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </IconWrapper>
  );
}

export function DiscussionsIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </IconWrapper>
  );
}

export function ChatIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </IconWrapper>
  );
}

export function ProfileIcon(props) {
  return (
    <IconWrapper {...props}>
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </IconWrapper>
  );
}

export function AdminIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </IconWrapper>
  );
}

export function PlusIcon(props) {
  return (
    <IconWrapper {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </IconWrapper>
  );
}

export function SearchIcon(props) {
  return (
    <IconWrapper {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </IconWrapper>
  );
}

export function FilterIcon(props) {
  return (
    <IconWrapper {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </IconWrapper>
  );
}

export function CalendarSyncIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M21.5 2v6h-6" />
      <path d="M21.34 15.57a9 9 0 1 1-.57-8.38l6.73-5.19" />
    </IconWrapper>
  );
}

export function CloseIcon(props) {
  return (
    <IconWrapper {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </IconWrapper>
  );
}

export function CheckIcon(props) {
  return (
    <IconWrapper {...props}>
      <polyline points="20 6 9 17 4 12" />
    </IconWrapper>
  );
}

export function LogoutIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </IconWrapper>
  );
}

export function ChevronRightIcon(props) {
  return (
    <IconWrapper {...props}>
      <polyline points="9 18 15 12 9 6" />
    </IconWrapper>
  );
}

export function BackIcon(props) {
  return (
    <IconWrapper {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </IconWrapper>
  );
}

export function SendIcon(props) {
  return (
    <IconWrapper {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </IconWrapper>
  );
}

export function MenuIcon(props) {
  return (
    <IconWrapper {...props}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </IconWrapper>
  );
}

export function EyeIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </IconWrapper>
  );
}

export function EyeOffIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </IconWrapper>
  );
}

export function ClockIcon(props) {
  return (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </IconWrapper>
  );
}

export function MapPinIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </IconWrapper>
  );
}

export function TrashIcon(props) {
  return (
    <IconWrapper {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </IconWrapper>
  );
}

export function EditIcon(props) {
  return (
    <IconWrapper {...props}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </IconWrapper>
  );
}
