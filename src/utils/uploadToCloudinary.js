// const uploadToCloudinary = async (file, folder) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", import.meta.env.VITE_Cloudinary_Preset);
//   formData.append("folder", folder || "teachers");
//   formData.append("resource_type", "auto"); // Auto-detect file type
//   formData.append("flags", "attachment"); // Fixes PDF delivery
//   formData.append("content_type", file.type); // Preserve original MIME type

//   try {
//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${
//         import.meta.env.VITE_Cloudinary_Name
//       }/auto/upload`,
//       { method: "POST", body: formData }
//     );
//     const data = await res.json();
//     return data.secure_url;
//   } catch (err) {
//     console.error("Upload failed:", err);
//     throw err;
//   }
// };

// export default uploadToCloudinary;

const uploadToCloudinary = async (file, folder) => {
  const isPdf = file.type === "application/pdf";
  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");

  let resourceType = "image"; // default
  if (isPdf) resourceType = "raw";
  else if (isVideo) resourceType = "video";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_Cloudinary_Preset);
  formData.append("folder", folder);
  formData.append("content_type", file.type);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_Cloudinary_Name
    }/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url;
};

export default uploadToCloudinary;
