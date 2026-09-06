import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, isCloudinaryConfigured } from "../config/cloudinary";

export async function uploadImageToCloudinary(localUri) {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Cloudinary isn't configured yet — set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET " +
      "in frontend/src/config/cloudinary.js (see frontend/CLOUDINARY.md)."
    );
  }

  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    type: "image/jpeg",
    name: "cover.jpg",
  });
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Image upload failed");
  }
  return data.secure_url;
}
