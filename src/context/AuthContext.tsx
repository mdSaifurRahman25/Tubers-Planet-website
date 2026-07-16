"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import toast from "react-hot-toast";

import type {
    AuthApiResponse,
    AuthUser,
    LoginInput,
    RegisterInput,
} from "@/types/auth.types";

interface AuthContextValue {
    user: AuthUser | null;
    isLoggedIn: boolean;
    isAuthLoading: boolean;
    login: (input: LoginInput) => Promise<boolean>;
    signUp: (input: RegisterInput) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
    undefined
);

const getErrorMessage = (data: AuthApiResponse): string => {
    if (data.errors) {
        const firstError = Object.values(data.errors)
            .flat()
            .find(Boolean);

        if (firstError) {
            return firstError;
        }
    }

    return data.message || "Something went wrong";
};

const readResponse = async (
    response: Response
): Promise<AuthApiResponse> => {
    try {
        return (await response.json()) as AuthApiResponse;
    } catch {
        return {
            success: false,
            message: "Invalid response from the server",
        };
    }
};

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const refreshUser = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch("/api/auth/session", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            const data = await readResponse(response);

            if (response.ok && data.user) {
                setUser(data.user);
                return;
            }

            setUser(null);
        } catch (error) {
            console.error("Unable to verify authentication:", error);
            setUser(null);
        }
    }, []);

    const signUp = useCallback(
        async (input: RegisterInput): Promise<boolean> => {
            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(input),
                });

                const data = await readResponse(response);

                if (!response.ok || !data.user) {
                    toast.error(getErrorMessage(data));
                    return false;
                }

                setUser(data.user);
                toast.success(data.message);

                return true;
            } catch (error) {
                console.error("Registration failed:", error);
                toast.error("Unable to create your account");

                return false;
            }
        },
        []
    );

    const login = useCallback(
        async (input: LoginInput): Promise<boolean> => {
            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(input),
                });

                const data = await readResponse(response);

                if (!response.ok || !data.user) {
                    toast.error(getErrorMessage(data));
                    return false;
                }

                setUser(data.user);
                toast.success(data.message);

                return true;
            } catch (error) {
                console.error("Login failed:", error);
                toast.error("Unable to log in");

                return false;
            }
        },
        []
    );

    const logout = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            const data = await readResponse(response);

            if (!response.ok) {
                toast.error(getErrorMessage(data));
                return;
            }

            setUser(null);
            toast.success(data.message);
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Unable to log out");
        }
    }, []);

    useEffect(() => {
        let isActive = true;

        const initializeAuth = async () => {
            try {
                await refreshUser();
            } finally {
                if (isActive) {
                    setIsAuthLoading(false);
                }
            }
        };

        void initializeAuth();

        return () => {
            isActive = false;
        };
    }, [refreshUser]);

    const contextValue = useMemo<AuthContextValue>(
        () => ({
            user,
            isLoggedIn: Boolean(user),
            isAuthLoading,
            login,
            signUp,
            logout,
            refreshUser,
        }),
        [
            user,
            isAuthLoading,
            login,
            signUp,
            logout,
            refreshUser,
        ]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
}