import "server-only";

import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_URL) {
    throw new Error(
        "CLOUDINARY_URL is missing from environment variables"
    );
}

cloudinary.config({
    secure: true,
});

export default cloudinary;