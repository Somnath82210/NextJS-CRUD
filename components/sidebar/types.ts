
export interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  logo?: React.ReactNode;
  logoText?: string;
}