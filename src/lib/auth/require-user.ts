import "server-only";

import { getCurrentUser } from "@/lib/auth/get-current-user";

export class UnauthorizedError extends Error {
    constructor(message = "You are not logged in") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export const requireUser = async () => {
    const user = await getCurrentUser();

    if (!user) {
        throw new UnauthorizedError();
    }

    return user;
};