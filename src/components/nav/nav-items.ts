import {
  Bell,
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
  /** Static unread badge count. Dynamic counts (e.g. alerts) se calculan en el nav. */
  badge?: number;
}

export const navItems: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Portfolios", href: "/portfolios", icon: Wallet },
  { label: "Explorar", href: "/explore", icon: Search },
  { label: "Watchlist", href: "/watchlist", icon: Star },
  { label: "Alertas", href: "/alerts", icon: Bell },
  { label: "Más", href: "/settings", icon: MoreHorizontal },
];
