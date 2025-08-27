
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import { DashboardIcon, LeaderboardIcon, GuildIcon, ShopIcon, ProfileIcon } from '../components/icons';

const NavItem: React.FC<{
  screen: Screen;
  label: string;
  icon: React.ReactNode;
}> = ({ screen, label, icon }) => {
  const { activeScreen, setActiveScreen } = useAppContext();
  const isActive = activeScreen === screen;

  return (
    <button
      onClick={() => setActiveScreen(screen)}
      className={`flex flex-col items-center justify-center flex-1 transition-colors duration-200 pt-2 pb-1 ${
        isActive ? 'text-[#0544E3]' : 'text-gray-400 hover:text-[#0544E3]'
      }`}
      aria-label={`Go to ${label}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* FIX: Add type assertion for props to fix 'className' property error in React.cloneElement */}
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6 mb-1' })}
      <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
    </button>
  );
};

const BottomNavBar: React.FC = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex justify-around items-start px-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <NavItem screen={Screen.DASHBOARD} label="Dashboard" icon={<DashboardIcon />} />
      <NavItem screen={Screen.LEADERBOARD} label="Ranks" icon={<LeaderboardIcon />} />
      <NavItem screen={Screen.GUILDS} label="Guilds" icon={<GuildIcon />} />
      <NavItem screen={Screen.SHOP} label="Shop" icon={<ShopIcon />} />
      <NavItem screen={Screen.PROFILE} label="Profile" icon={<ProfileIcon />} />
    </nav>
  );
};

export default BottomNavBar;
