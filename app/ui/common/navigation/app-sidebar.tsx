'use client';

import Link from 'next/link';

import { ItemIcon } from '@/app/ui/common/navigation/item-icon';
import { NavItem } from '@/app/ui/common/navigation/navigation-items';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const brand = process.env.NEXT_PUBLIC_BRAND;

function isItemActive(pathname: string, href: string) {
  return pathname === href;
}

function isGroupOpen(pathname: string, items: NavItem[]) {
  return items.some((item) => {
    if ('href' in item && item.href) {
      return isItemActive(pathname, item.href);
    }
    return false;
  });
}

export default function AppSidebar({
  footer,
  navItems,
}: {
  footer: string;
  navItems: NavItem[];
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="h-10 justify-center border-b px-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {brand}
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              if ('items' in item && item.items) {
                const open = isGroupOpen(pathname, item.items);

                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen={open}
                    className="group/collapsible"
                  >
                    <SidebarGroup className="py-0">
                      <SidebarGroupLabel
                        asChild
                        className="group/label p-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <ItemIcon type={item.iconName} />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>

                      <CollapsibleContent>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            {item.items.map((subItem) => {
                              if (!('href' in subItem) || !subItem.href) {
                                return null;
                              }

                              const active = isItemActive(
                                pathname,
                                subItem.href,
                              );

                              return (
                                <SidebarMenuItem key={subItem.title}>
                                  <SidebarMenuButton
                                    asChild
                                    isActive={active}
                                    className="pl-4"
                                  >
                                    <Link
                                      href={subItem.href}
                                      onClick={handleNavClick}
                                    >
                                      <ItemIcon type={subItem.iconName} />
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              );
                            })}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                );
              }

              const active = isItemActive(pathname, item.href);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={active}>
                    <Link href={item.href} onClick={handleNavClick}>
                      <ItemIcon type={item.iconName} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2 text-sm text-muted-foreground">
        {footer}
      </SidebarFooter>
    </Sidebar>
  );
}
