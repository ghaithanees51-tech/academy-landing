declare module "../data/navItems.js" {
  export interface DropdownItem {
    label: string;
    href: string;
  }

  export interface NavItem {
    label: string;
    href?: string;
    children?: DropdownItem[];
  }

  export const navItems: NavItem[];
}
