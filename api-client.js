const BACKEND_URL = "http://localhost:8000";

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
    const response = await fetch(`${BACKEND_URL}/list/${bucketName}`);
    if (!response.ok) throw new Error("Failed to fetch images");
    const data = await response.json();
    return data.filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name));
  } catch (err) {
    console.error("Error in getImagesFromBucket:", err);
    return [];
  }
}

// Get videos from bucket
async function getVideosFromBucket(bucketName) {
  try {
    const response = await fetch(`${BACKEND_URL}/list/${bucketName}`);
    if (!response.ok) throw new Error("Failed to fetch videos");
    const data = await response.json();
    return data.filter((file) => /\.(mp4|webm|mov)$/i.test(file.name));
  } catch (err) {
    console.error("Error in getVideosFromBucket:", err);
    return [];
  }
}

// Upload file to Backend
async function uploadFile(file, bucketName) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BACKEND_URL}/upload/${bucketName}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.detail || "Upload failed" };
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

// Delete file from Backend
async function deleteImage(bucketName, fileName) {
  try {
    const response = await fetch(`${BACKEND_URL}/delete/${bucketName}/${fileName}`, {
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

