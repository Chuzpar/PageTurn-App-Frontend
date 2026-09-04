import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, isCloudinaryConfigured } from "../config/cloudinary";


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
      "Cloudinary isn't configured yet. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in " +
      "src/config/cloudinary.js."
    );
  }

  const extension = fileName?.split(".").pop()?.toLowerCase() || localUri.split("?")[0].split(".").pop()?.toLowerCase() || "jpg";
  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    type: mimeType || mimeTypes[extension] || "image/*",
    name: fileName || `image.${extension}`,
  });
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    if (data?.error?.message?.toLowerCase().includes("whitelisted for unsigned uploads")) {
      throw new Error(
        "This Cloudinary upload preset is not enabled for unsigned uploads. " +
        "In Cloudinary, open Settings > Upload > Upload presets, select the preset, " +
        "set Signing Mode to Unsigned, and save it."
      );
    }
    throw new Error(data?.error?.message || "Image upload failed");
  }
  return data.secure_url;
}
