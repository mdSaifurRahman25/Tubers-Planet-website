import "server-only";

import type {
    UploadApiErrorResponse,
    UploadApiResponse,
} from "cloudinary";

import cloudinary from "./cloudinary";

export interface UploadedImage {
    secureUrl: string;
    publicId: string;
}

export const uploadImageBuffer = (
    buffer: Buffer,
    userId: string
): Promise<UploadedImage> => {
    return new Promise((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    folder: `thumblify/thumbnails/${userId}`,
                    format: "png",
                    use_filename: false,
                    unique_filename: true,
                    overwrite: false,
                },
                (
                    error:
                        | UploadApiErrorResponse
                        | undefined,
                    result:
                        | UploadApiResponse
                        | undefined
                ) => {
                    if (error) {
                        reject(
                            new Error(
                                error.message ||
                                "Cloudinary upload failed"
                            )
                        );
                        return;
                    }

                    if (
                        !result?.secure_url ||
                        !result.public_id
                    ) {
                        reject(
                            new Error(
                                "Cloudinary returned an invalid response"
                            )
                        );
                        return;
                    }

                    resolve({
                        secureUrl: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            );

        uploadStream.end(buffer);
    });
};