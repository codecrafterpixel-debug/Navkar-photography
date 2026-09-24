// Navkar Photography API Client
// Automatically supports Vercel Serverless Functions + Neon Postgres or Local Python Backend

const IS_LOCAL_PYTHON = window.location.port === "8000";
const BACKEND_URL = IS_LOCAL_PYTHON ? "http://localhost:8000" : "";

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
    // 1. Try Vercel Serverless /api/list route
    let response = await fetch(`${BACKEND_URL}/api/list?bucket=${encodeURIComponent(bucketName)}`);
    
    // If not found (e.g. running local FastAPI backend), fallback to /list/
    if (response.status === 404) {
      response = await fetch(`http://localhost:8000/list/${bucketName}`);
    }

    if (!response.ok) throw new Error("Failed to fetch images");
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
    let response = await fetch(`${BACKEND_URL}/api/list?bucket=${encodeURIComponent(bucketName)}`);
    if (response.status === 404) {
      response = await fetch(`http://localhost:8000/list/${bucketName}`);
    }
    if (!response.ok) throw new Error("Failed to fetch videos");
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
    // Send binary directly to /api/upload
    let response = await fetch(
      `${BACKEND_URL}/api/upload?bucket=${encodeURIComponent(bucketName)}&filename=${encodeURIComponent(file.name)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "x-filename": file.name,
        },
        body: file,
      }
    );

    // Fallback to local python multipart backend if 404
    if (response.status === 404) {
      const formData = new FormData();
      formData.append("file", file);
      response = await fetch(`http://localhost:8000/upload/${bucketName}`, {
        method: "POST",
        body: formData,
      });
    }

    if (!response.ok) {
      let errMsg = "Upload failed";
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
    let response = await fetch(
      `${BACKEND_URL}/api/delete?bucket=${encodeURIComponent(bucketName)}&name=${encodeURIComponent(fileName)}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 404) {
      response = await fetch(`http://localhost:8000/delete/${bucketName}/${fileName}`, {
        method: "DELETE",
      });
    }

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
