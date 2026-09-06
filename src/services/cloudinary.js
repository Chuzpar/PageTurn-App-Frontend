import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  isCloudinaryConfigured,
} from "../config/cloudinary";

const mimeTypes = {
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
};

export async function uploadImageToCloudinary(localUri, fileName, mimeType) {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Cloudinary isn't configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const extension =
    fileName?.split(".").pop()?.toLowerCase() ||
    localUri.split("?")[0].split(".").pop()?.toLowerCase() ||
    "jpg";

  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    type: mimeType || mimeTypes[extension] || "image/jpeg",
    name: fileName || `image.${extension}`,
  });
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();
  if (!response.ok) {
    if (data?.error?.message?.toLowerCase().includes("whitelisted for unsigned")) {
      throw new Error(
        "Upload preset must be set to Unsigned in Cloudinary (Settings → Upload → Upload presets)."
      );
    }
    throw new Error(data?.error?.message || "Image upload failed");
  }
  return data.secure_url;
}