const DEFAULT_APP_URL =
    "http://localhost:3001";

const APP_URL = (
    process.env.NEXT_PUBLIC_APP_URL ||
    DEFAULT_APP_URL
).replace(/\/+$/, "");

export const getAppUrl = (
    pathname = "/"
): string => {
    const normalizedPath =
        pathname.startsWith("/")
            ? pathname
            : `/${pathname}`;

    return `${APP_URL}${normalizedPath}`;
};