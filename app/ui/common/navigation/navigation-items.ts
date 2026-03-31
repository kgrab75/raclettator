import { icons } from '@/app/ui/common/navigation/item-icon';

export type NavItem =
  | {
      title: string;
      iconName: keyof typeof icons;
      href: string;
      items?: never;
    }
  | {
      title: string;
      iconName: keyof typeof icons;
      href?: never;
      items: NavItem[];
    };

export function isNavigationItemActive(
  pathname: string,
  href?: string,
): boolean {
  if (!href) {
    return false;
  }
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isNavigationItemOpen(pathname: string, href?: string): boolean {
  if (!href) {
    return false;
  }
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
