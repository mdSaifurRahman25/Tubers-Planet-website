import "server-only";

import connectDB from "@/lib/db/connect-db";
import { getCurrentSession } from "@/lib/auth/session";
import type { PublicUser } from "@/lib/services/auth.service";
import User from "@/models/User";

export const getCurrentUser =
    async (): Promise<PublicUser | null> => {
        const session = await getCurrentSession();

        if (!session) {
            return null;
        }

        await connectDB();

        const user = await User.findById(
            session.userId
        )
            .select("_id name email")
            .lean();

        if (!user) {
            return null;
        }

        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    };