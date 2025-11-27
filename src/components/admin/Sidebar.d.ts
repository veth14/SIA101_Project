interface SidebarProps {
    isMobile?: boolean;
}
interface SubNavItem {
    name: string;
    href: string;
    icon: JSX.Element;
    description?: string;
}
interface NavItem {
    name: string;
    href?: string;
    icon: JSX.Element;
    subItems?: SubNavItem[];
    roles: string[];
}
export declare const navigation: NavItem[];
export declare const Sidebar: ({}: SidebarProps) => import("react/jsx-runtime").JSX.Element;
export {};
