"use client";

import {
    useState,
    type ReactNode,
} from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

import { useAuth } from "@/context/AuthContext";

import type {
    DashboardUser,
} from "@/types/dashboard.types";

interface DashboardShellProps {
    children: ReactNode;
    initialUser: DashboardUser;
}

export default function DashboardShell({
    children,
    initialUser,
}: DashboardShellProps) {
    const {
        user,
    } = useAuth();

    const [
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
    ] = useState(false);

    const currentUser:
        DashboardUser =
        user || initialUser;

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-zinc-950 text-white">
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            >
                <div className="absolute -left-40 top-20 size-96 rounded-full bg-purple-600/10 blur-3xl" />

                <div className="absolute right-0 top-0 size-96 rounded-full bg-pink-600/8 blur-3xl" />

                <div className="absolute bottom-0 left-1/2 size-80 rounded-full bg-fuchsia-600/5 blur-3xl" />
            </div>

            <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
                <DashboardSidebar
                    user={currentUser}
                />
            </div>

            {isMobileSidebarOpen ? (
                <>
                    <button
                        type="button"
                        aria-label="Close dashboard menu"
                        onClick={() =>
                            setIsMobileSidebarOpen(
                                false
                            )
                        }
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                    />

                    <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[88vw] lg:hidden">
                        <DashboardSidebar
                            user={currentUser}
                            isMobile
                            onClose={() =>
                                setIsMobileSidebarOpen(
                                    false
                                )
                            }
                        />
                    </div>
                </>
            ) : null}

            <div className="relative z-10 min-h-screen lg:pl-72">
                <DashboardHeader
                    user={currentUser}
                    onOpenMobileSidebar={() =>
                        setIsMobileSidebarOpen(
                            true
                        )
                    }
                />

                <main className="min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}