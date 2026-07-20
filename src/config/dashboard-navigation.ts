import type {
    LucideIcon,
} from "lucide-react";

import {
    Coins,
    CreditCard,
    Images,
    LayoutDashboard,
    LifeBuoy,
    Sparkles,
    UserRound,
} from "lucide-react";

export interface DashboardNavigationItem {
    label: string;
    href: string;
    icon: LucideIcon;
    exact?: boolean;
}

export const dashboardNavigation:
    DashboardNavigationItem[] = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            exact: true,
        },
        {
            label: "Generate Thumbnail",
            href: "/generate",
            icon: Sparkles,
        },
        {
            label: "My Generations",
            href: "/generations",
            icon: Images,
        },
        {
            label: "Credits & Usage",
            href: "/credits",
            icon: Coins,
        },
        {
            label: "Billing & Payments",
            href: "/billing",
            icon: CreditCard,
        },
        {
            label: "Profile",
            href: "/profile",
            icon: UserRound,
        },
    ];

export const dashboardSupportNavigation:
    DashboardNavigationItem = {
    label: "Support",
    href: "/support",
    icon: LifeBuoy,
};