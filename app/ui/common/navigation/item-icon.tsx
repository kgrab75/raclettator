'use client';

import {
  Calendar,
  CalendarPlus,
  CirclePlay,
  Home,
  LayoutDashboard,
  List,
  Users,
  Utensils,
} from 'lucide-react';

export const icons = {
  circlePlay: CirclePlay,
  home: Home,
  calendarPlus: CalendarPlus,
  utensils: Utensils,
  calendar: Calendar,
  users: Users,
  list: List,
  layoutDashboard: LayoutDashboard,
};

export function ItemIcon({
  type,
  className,
}: {
  type: keyof typeof icons;
  className?: string;
}) {
  const Icon = icons[type];
  return <Icon className={className} />;
}
