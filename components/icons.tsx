
import React from 'react';

type IconProps = {
  className?: string;
};

export const DashboardIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" />
  </svg>
);

export const LeaderboardIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const GuildIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1.111a6 6 0 01.358-2.122M12 7.854a4 4 0 110-5.292" />
  </svg>
);

export const ShopIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const FitnessIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

export const LearningIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.028 1.841l7 3.5a1 1 0 00.732 0l7-3.5a1 1 0 00.028-1.841l-7-3.5zM3 9.736l7 3.5 7-3.5v3.548l-7 3.5-7-3.5V9.736z" />
    </svg>
);

export const SocialSkillIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
    </svg>
);

export const CareerIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 11-2 0V4H6v12a1 1 0 11-2 0V4zm5 4a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
    </svg>
);

export const HobbiesIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 4a1 1 0 000 2 1 1 0 011 1v1a1 1 0 102 0V8a1 1 0 10-2 0v2a1 1 0 01-1 1 1 1 0 000 2h3a1 1 0 100-2H9a1 1 0 01-1-1v-1a1 1 0 00-2 0v-1a1 1 0 011-1 1 1 0 100-2H7z" />
    </svg>
);

export const MindfulnessIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 3.5a.5.5 0 01.5.5v12a.5.5 0 01-1 0v-12a.5.5 0 01.5-.5zM5.5 10a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8a.5.5 0 01-.5-.5z" />
      <path d="M15.354 5.354a.5.5 0 010 .708l-5 5a.5.5 0 01-.708-.708l5-5a.5.5 0 01.708 0zM4.646 5.354a.5.5 0 01.708 0l5 5a.5.5 0 01-.708.708l-5-5a.5.5 0 010-.708z" />
    </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ExclamationCircleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a14.95 14.95 0 0114.32 11.23M20 20a14.95 14.95 0 01-14.32-11.23" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const CoachIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 100-2 1 1 0 000 2zM11 8a1 1 0 100-2 1 1 0 000 2zM7 12a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.002L2.094 5.051a11.954 11.954 0 00-1.83 5.952c.162 2.53.864 4.863 2.01 6.883a.5.5 0 00.82.023l.115-.116a.5.5 0 00-.023-.82c-1.072-1.9-1.7-4.08-1.838-6.452a.5.5 0 00-.495-.504 9.954 9.954 0 011.526-4.957.5.5 0 00-.82-.023L3.094 4.051A9.954 9.954 0 0010 11.954a.5.5 0 001 0c0-1.042-.164-2.06-.47-3.002a.5.5 0 00-.94-.223c-.324.985-.49 2.028-.49 3.075a.5.5 0 001 0c0-.002 0-.003 0-.005a1 1 0 012 0 .5.5 0 001 0 1 1 0 012 0 .5.5 0 001 0c0-1.047-.166-2.08-.477-3.023a.5.5 0 00-.939-.23l-.001.003c-.324.985-.49 2.028-.49 3.075a.5.5 0 001 0c0-2.951 1.042-5.692 2.768-7.79a.5.5 0 00-.732-.68l-.115.116a.5.5 0 00.023.82c1.64 1.99 2.58 4.54 2.72 7.188a.5.5 0 00.495.504 9.954 9.954 0 01-1.526 4.957.5.5 0 00.82.023l.001-.002A11.954 11.954 0 0010 1.944z" clipRule="evenodd" />
  </svg>
);

export const LockClosedIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v2H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 4V6a2 2 0 114 0v2H8z" clipRule="evenodd" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const VisaIcon: React.FC<IconProps> = ({ className = 'w-20' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 25" role="img" aria-label="Visa Logo">
      <path fill="#26348C" d="M38.8.2L31.5 25h5.8l7.3-24.8zm10.7 11.4c0-2.8-1.8-4.3-4.9-4.3-1.8 0-3.3.7-4.2 1.2l1 5c.6-.4 1.5-.8 2.5-.8 1 0 1.5.5 1.5 1.3 0 1.4-2.6 1.3-4.4 2-2.7 1-4.6 2.6-4.6 5.5 0 2.9 2.2 4.5 5.1 4.5 2.1 0 3.6-.8 4.6-1.4l-1-4.9c-.8.5-1.8.8-2.8.8-1.1 0-1.7-.5-1.7-1.4 0-1.1 2.5-1.3 4.4-1.9 2.8-.9 4.8-2.4 4.8-5.6zM78 13.6c0-4.8-4.5-7.4-9.3-7.4s-8.4 2.6-8.4 2.6L61.4 25h5.4l1-5.8h.1c.8 1.4 2.5 2.3 4.5 2.3 3.9 0 5.6-2.9 5.6-6.9zm-8.8 4.4c-1.2 0-2.3-.8-2.7-1.9h-.1v1.8c0-.4-.1-1.1-.9-1.3l-.3-.1c-1.3-.4-3.1.3-3.1.3l.9-5.7s2.2-1.2 4-1.2c2.4 0 3.7 1.4 3.7 4 0 1.9-1.1 2.9-2.2 2.9zM29.9 8.9L25.3.2h-5.7L25 15.6 21.2 25h5.7l1.7-6.5 1.2-4.5c.1-.6.3-1.4.5-2.3h.1c.2 1 .4 1.7.5 2.1l2.2 8.2h5.4L29.9 8.9z"/>
      <path d="M12.9 2.5L8.2 20.3c-.3 1.2-1.4 2-2.6 2s-2.3-.8-2.6-2L0 2.5h5.3l1.8 9.2L9.3 2.5h3.6z" fill="#26348C"/>
      <path d="M12.9 2.5L9.3 2.5 7.1 11.7l1.8-9.2L5.3 2.5 0 2.5l3.1 17.8C3.4 21.5 4.5 22.3 5.7 22.3s2.3-.8 2.6-2L14.5 8.9h-1.6z" fill="#FCB131"/>
    </svg>
);

export const MastercardIcon: React.FC<IconProps> = ({ className = 'w-10' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 20">
        <circle cx="10" cy="10" r="10" fill="#EA001B"/>
        <circle cx="22" cy="10" r="10" fill="#F79E1B"/>
        <path d="M16 10a10 10 0 1 1 0 0" fill="#FF5F00"/>
    </svg>
);

export const PayPalIcon: React.FC<IconProps> = ({ className = 'w-24' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 135">
        <path d="M60.3 60.3c-2-2.9-4.8-4.8-8.1-5.8-3.4-1-6.8-1.5-10.2-1.5H23.3L15.9 99h14.5c4.8 0 9.4-1.7 13.1-5.1 4.7-4.2 7.3-10 7.8-16.1 0-.1.1-.2.1-.4 1.1-6.1-1.1-12-5.1-17.1z" fill="#253b80"/>
        <path d="M96.2 36.3c-4.4-4.8-10.2-7.5-16.3-8.2-8.5-1-16.3.8-22.9 5.3-2.9 2-5.4 4.5-7.5 7.4-2 2.9-4.8 4.8-8.1 5.8-3.4 1-6.8 1.5-10.2 1.5H23.3L0 134.1h20.8l12.3-74.1h8.1c4.8 0 9.4-1.7 13.1-5.1 4.7-4.2 7.3-10 7.8-16.1 0-.1.1-.2.1-.4 1.1-6.1-1.1-12-5.1-17.1-2-2.9-4.8-4.8-8.1-5.8-3.4-1-6.8-1.5-10.2-1.5h-5.9c3-5.7 7.7-10.1 13.5-12.8 9.2-4.3 19.3-4.9 28.9-1.9 8.2 2.5 15.3 8.3 19.2 16.3.5 1 1 2 1.5 3z" fill="#179bd7"/>
    </svg>
);