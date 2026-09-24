// Navkar Photography API Client
// Connected to live Vercel Backend: https://navkar-photography.vercel.app

const LIVE_VERCEL_URL = "https://navkar-photography.vercel.app";

// Auto-detect environment: if running on local file / dev server, use live Vercel endpoint
const isLocal = !window.location.hostname || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BACKEND_URL = isLocal ? LIVE_VERCEL_URL : "";

// Gallery bucket mapping
const GALLERY_BUCKETS = {
  "wedding-jheel-neeraj": "Jheel & Neeraj",
  "wedding-mauli-pankil": "Mauli & Pankil",
  "wedding-mihir-maitry": "Mihir & Maitry",
  "religious-aarohan-updhyan": "Aarohan Updhyan Tap",
  "religious-mahapuja": "Mahapuja",
  "religious-shakrastav-aabhishek": "Shakrastav Maha Aabhishek",
};

// Function to get all images from a bucket
async function getImagesFromBucket(bucketName) {
  try {
    const url = `${BACKEND_URL}/api/list?bucket=${encodeURIComponent(bucketName)}`;
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.filter((file) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name || file.url));
  } catch (err) {
    console.error("Error in getImagesFromBucket:", err);
    return [];
  }
}

// Get videos from bucket
async function getVideosFromBucket(bucketName) {
  try {
    const url = `${BACKEND_URL}/api/list?bucket=${encodeURIComponent(bucketName)}`;
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.filter((file) => /\.(mp4|webm|mov)$/i.test(file.name || file.url));
  } catch (err) {
    console.error("Error in getVideosFromBucket:", err);
    return [];
  }
}

// Upload file to Backend (Vercel Serverless /api/upload with Neon + Vercel Blob)
async function uploadFile(file, bucketName) {
  try {
    const uploadUrl = `${BACKEND_URL}/api/upload?bucket=${encodeURIComponent(bucketName)}&filename=${encodeURIComponent(file.name)}`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "x-filename": file.name,
      },
      body: file,
    });

    if (!response.ok) {
      let errMsg = `Upload failed (${response.status})`;
      try {
        const errorData = await response.json();
        errMsg = errorData.error || errorData.detail || errMsg;
      } catch (e) {}
      return { error: errMsg };
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error uploading file:", err);
    return { error: err.message };
  }
}

async function uploadVideo(file, bucketName) {
  return uploadFile(file, bucketName);
}

async function uploadImage(file, bucketName) {
  return uploadFile(file, bucketName);
}

function getPublicImageUrl(bucketName, fileName) {
  return `${BACKEND_URL}/storage/${bucketName}/${fileName}`;
}

// Delete file
async function deleteImage(bucketName, fileName) {
  try {
    const deleteUrl = `${BACKEND_URL}/api/delete?bucket=${encodeURIComponent(bucketName)}&name=${encodeURIComponent(fileName)}`;
    const response = await fetch(deleteUrl, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Delete error");
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting image:", err);
    return false;
  }
}

// Export functions for use in other files
window.BackendAPI = {
  getImagesFromBucket,
  getVideosFromBucket,
  uploadFile,
  uploadImage,
  uploadVideo,
  deleteImage,
  getPublicImageUrl,
  GALLERY_BUCKETS,
};

window.GalleryAPI = window.BackendAPI;
