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

    login: (
        input: LoginInput
    ) => Promise<boolean>;

    signUp: (
        input: RegisterInput
    ) => Promise<boolean>;

    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext =
    createContext<
        AuthContextValue | undefined
    >(undefined);

/*
 * Zod validation error থাকলে প্রথম field error দেখাবে।
 * অন্যথায় API message দেখাবে।
 */
const getErrorMessage = (
    data: AuthApiResponse
): string => {
    if (data.errors) {
        const firstError =
            Object.values(
                data.errors
            )
                .flat()
                .find(Boolean);

        if (firstError) {
            return firstError;
        }
    }

    return (
        data.message ||
        "Something went wrong"
    );
};

/*
 * Server থেকে invalid বা empty JSON এলে
 * application যেন crash না করে।
 */
const readResponse = async (
    response: Response
): Promise<AuthApiResponse> => {
    try {
        return (await response.json()) as AuthApiResponse;
    } catch {
        return {
            success: false,
            message:
                "Invalid response from the server",
        };
    }
};

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<AuthUser | null>(
            null
        );

    const [
        isAuthLoading,
        setIsAuthLoading,
    ] = useState(true);

    /*
     * Existing session cookie থেকে authenticated
     * user load করবে।
     */
    const refreshUser =
        useCallback(
            async (): Promise<void> => {
                try {
                    const response =
                        await fetch(
                            "/api/auth/session",
                            {
                                method:
                                    "GET",

                                credentials:
                                    "include",

                                cache:
                                    "no-store",
                            }
                        );

                    const data =
                        await readResponse(
                            response
                        );

                    if (
                        response.ok &&
                        data.user
                    ) {
                        setUser(
                            data.user
                        );

                        return;
                    }

                    setUser(null);
                } catch (error) {
                    console.error(
                        "Unable to verify authentication:",
                        error
                    );

                    setUser(null);
                }
            },
            []
        );

    /*
     * নতুন signup flow:
     *
     * 1. Register API call করবে
     * 2. Main user এখনো তৈরি হবে না
     * 3. OTP email পাঠানো হবে
     * 4. Pending registration cookie তৈরি হবে
     * 5. /verify-email page-এ পাঠানো হবে
     *
     * OTP verification-এর আগে setUser() করা হবে না।
     */
    const signUp =
        useCallback(
            async (
                input: RegisterInput
            ): Promise<boolean> => {
                try {
                    const response =
                        await fetch(
                            "/api/auth/register",
                            {
                                method:
                                    "POST",

                                credentials:
                                    "include",

                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },

                                body:
                                    JSON.stringify(
                                        input
                                    ),
                            }
                        );

                    const data =
                        await readResponse(
                            response
                        );

                    if (
                        !response.ok ||
                        !data.success
                    ) {
                        toast.error(
                            getErrorMessage(
                                data
                            )
                        );

                        return false;
                    }

                    /*
                     * নতুন OTP registration response।
                     */
                    if (
                        data.verificationRequired
                    ) {
                        toast.success(
                            data.message
                        );

                        /*
                         * Masked email browser session-এ
                         * fallback হিসেবে রাখা হচ্ছে।
                         *
                         * OTP page মূল status backend cookie
                         * থেকে নেবে।
                         */
                        if (
                            data.maskedEmail
                        ) {
                            sessionStorage.setItem(
                                "thumblify_pending_masked_email",
                                data.maskedEmail
                            );
                        }

                        const redirectTo =
                            data.redirectTo ||
                            "/verify-email";

                        /*
                         * Current LoginForm success=true হলে
                         * homepage-এ redirect করে।
                         *
                         * তাই এখানে সরাসরি OTP page-এ navigate
                         * করে false return করা হচ্ছে।
                         */
                        window.location.assign(
                            redirectTo
                        );

                        return false;
                    }

                    /*
                     * পুরোনো API behaviour থাকলে fallback।
                     * নতুন OTP flow-এ সাধারণত এই অংশ চলবে না।
                     */
                    if (data.user) {
                        setUser(
                            data.user
                        );

                        toast.success(
                            data.message
                        );

                        return true;
                    }

                    toast.error(
                        "Unable to continue registration"
                    );

                    return false;
                } catch (error) {
                    console.error(
                        "Registration failed:",
                        error
                    );

                    toast.error(
                        "Unable to start your registration"
                    );

                    return false;
                }
            },
            []
        );

    /*
     * Verified user-এর login flow।
     *
     * rememberMe value-সহ input API-তে পাঠানো হবে।
     */
    const login =
        useCallback(
            async (
                input: LoginInput
            ): Promise<boolean> => {
                try {
                    const response =
                        await fetch(
                            "/api/auth/login",
                            {
                                method:
                                    "POST",

                                credentials:
                                    "include",

                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },

                                body:
                                    JSON.stringify(
                                        input
                                    ),
                            }
                        );

                    const data =
                        await readResponse(
                            response
                        );

                    if (
                        !response.ok ||
                        !data.user
                    ) {
                        toast.error(
                            getErrorMessage(
                                data
                            )
                        );

                        return false;
                    }

                    setUser(
                        data.user
                    );

                    toast.success(
                        data.message
                    );

                    return true;
                } catch (error) {
                    console.error(
                        "Login failed:",
                        error
                    );

                    toast.error(
                        "Unable to log in"
                    );

                    return false;
                }
            },
            []
        );

    const logout =
        useCallback(
            async (): Promise<void> => {
                try {
                    const response =
                        await fetch(
                            "/api/auth/logout",
                            {
                                method:
                                    "POST",

                                credentials:
                                    "include",
                            }
                        );

                    const data =
                        await readResponse(
                            response
                        );

                    if (
                        !response.ok
                    ) {
                        toast.error(
                            getErrorMessage(
                                data
                            )
                        );

                        return;
                    }

                    setUser(null);

                    sessionStorage.removeItem(
                        "thumblify_pending_masked_email"
                    );

                    toast.success(
                        data.message
                    );
                } catch (error) {
                    console.error(
                        "Logout failed:",
                        error
                    );

                    toast.error(
                        "Unable to log out"
                    );
                }
            },
            []
        );

    useEffect(() => {
        let isActive =
            true;

        const initializeAuth =
            async () => {
                try {
                    await refreshUser();
                } finally {
                    if (
                        isActive
                    ) {
                        setIsAuthLoading(
                            false
                        );
                    }
                }
            };

        void initializeAuth();

        return () => {
            isActive =
                false;
        };
    }, [refreshUser]);

    const contextValue =
        useMemo<AuthContextValue>(
            () => ({
                user,

                isLoggedIn:
                    Boolean(user),

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
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context =
        useContext(
            AuthContext
        );

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
}