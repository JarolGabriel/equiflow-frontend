import {
  Home,
  MoreHorizontal,
  Search,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Static unread badge count (real-time wired in Phase 3). */
  badge?: number;
}

export const navItems: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Portfolios", href: "/portfolios", icon: Wallet },
  { label: "Explorar", href: "/explore", icon: Search },
  { label: "Watchlist", href: "/watchlist", icon: Star },
  { label: "Más", href: "/settings", icon: MoreHorizontal },
];
