import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  handleNavigation?: () => void;
  collapsed?: boolean;
}

export default function NavItem({
  href,
  icon: Icon,
  children,
  handleNavigation,
  collapsed
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={handleNavigation}
      className={`
        group w-full flex items-center px-3 py-2 text-sm rounded-md
        text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
        hover:bg-gray-50 dark:hover:bg-[#1F1F23]
        transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
      `}
    >
      <div className="relative flex items-center justify-center min-w-[18px]">
        <Icon 
          className={`
            absolute
            transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
            group-hover:scale-105
          `} 
          size={18}
        />
      </div>
      <span className={`
        overflow-hidden whitespace-nowrap
        transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
        ${collapsed ? 'w-0 opacity-0 translate-x-10' : 'w-auto opacity-100 translate-x-0 ml-3'}
      `}>
        {children}
      </span>
    </Link>
  );
}