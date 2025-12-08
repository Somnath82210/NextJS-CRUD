export interface MetricData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
  bgColor?: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  sales: number;
  status: 'Success' | 'Pending';
}

//side bar
export interface  NavItem {
  icon: React.ReactNode;
  label: string;
  count?: number;
  subItems?: { name: string; route: string }[];
  route?: string;
}

export interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}
  // product activity

  export interface ProductivityCardProps {
    title: string;
    description: string;
  }

  // metric cards 

  export interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    subtitle: string;
    bgColor?: string;
  }

  //yearly target 
  export interface YearlyTargetProps {
    totalCost: string;
    targetValue: string;
    percentage: number;
  }
  
  