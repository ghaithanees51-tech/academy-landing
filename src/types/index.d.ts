// ─── Nav ────────────────────────────────────────────────────────────────────

export interface DropdownItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: DropdownItem[];
}

