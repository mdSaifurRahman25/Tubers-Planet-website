import "server-only";

import connectDB from "@/lib/db/connect-db";
import { getCurrentSession } from "@/lib/auth/session";
import type { PublicUser } from "@/lib/services/auth.service";
import User from "@/models/User";

interface CurrentUserRecord {
    _id: {
        toString: () => string;
    };
    name: string;
    email: string;
    whatsappNumber?: string;
    isEmailVerified?: boolean;
}

/*
 * বর্তমান session থেকে authenticated user-এর
 * নিরাপদ public information return করবে।
 */
export const getCurrentUser =
    async (): Promise<PublicUser | null> => {
        const session =
            await getCurrentSession();

        if (!session) {
            return null;
        }

        await connectDB();

        const user =
            await User.findById(
                session.userId
            )
                .select(
                    "_id name email whatsappNumber isEmailVerified"
                )
                .lean<CurrentUserRecord>();

        if (!user) {
            return null;
        }

        /*
         * পুরোনো user document-এ field না থাকলে
         * তাকে legacy verified user হিসেবে ধরা হবে।
         */
        const isEmailVerified =
            user.isEmailVerified ??
            true;

        /*
         * Explicitly unverified user authenticated
         * user হিসেবে return হবে না।
         */
        if (!isEmailVerified) {
            return null;
        }

        return {
            _id:
                user._id.toString(),

            name:
                user.name,

            email:
                user.email,

            whatsappNumber:
                user.whatsappNumber,

            isEmailVerified,
        };
    };