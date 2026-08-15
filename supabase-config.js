// Supabase Configuration
// Your actual Supabase credentials

const SUPABASE_URL = "https://qvmlxribtpxsbxdjhhoo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bWx4cmlidHB4c2J4ZGpoaG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODA3NDAsImV4cCI6MjEwMjI1Njc0MH0.dDoUlhXPrRcDopGLVVnh1PR0P3s3AyOpgPCtvhnBGvg";
const ADMIN_PASSWORD = "Karan2112";

// Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .list("", {
        limit: 1000,
        offset: 0,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (error) {
      console.error(`Error fetching images from ${bucketName}:`, error);
      return [];
    }

    return data
      .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name))
      .map((file) => ({
        name: file.name,
        url: getPublicImageUrl(bucketName, file.name),
        bucket: bucketName,
        created_at: file.created_at,
      }));
  } catch (err) {
    console.error("Error in getImagesFromBucket:", err);
    return [];
  }
}

// New: Get videos from bucket (supports mp4, webm, mov)
async function getVideosFromBucket(bucketName) {
  try {
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .list("", {
        limit: 1000,
        offset: 0,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (error) {
      console.error(`Error fetching videos from ${bucketName}:`, error);
      return [];
    }

    return data
      .filter((file) => /\.(mp4|webm|mov)$/i.test(file.name))
      .map((file) => ({
        name: file.name,
        url: getPublicImageUrl(bucketName, file.name),
        bucket: bucketName,
        created_at: file.created_at,
      }));
  } catch (err) {
    console.error("Error in getVideosFromBucket:", err);
    return [];
  }
}

// New: Upload video to Supabase (mirrors image upload)
async function uploadVideoToSupabase(file, bucketName) {
  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const fileName = `${Date.now()}-${sanitizedName}`;
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) {
      console.error("Upload video error:", error);
      return { error: error.message };
    }

    return {
      name: fileName,
      url: getPublicImageUrl(bucketName, fileName),
      bucket: bucketName,
    };
  } catch (err) {
    console.error("Error uploading video:", err);
    return { error: err.message };
  }
}

// Function to get public URL for an image
function getPublicImageUrl(bucketName, fileName) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${fileName}`;
}

// Function to upload image to Supabase
async function uploadImageToSupabase(file, bucketName) {
  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const fileName = `${Date.now()}-${sanitizedName}`;
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return { error: error.message };
    }

    return {
      name: fileName,
      url: getPublicImageUrl(bucketName, fileName),
      bucket: bucketName,
    };
  } catch (err) {
    console.error("Error uploading image:", err);
    return { error: err.message };
  }
}

// Function to delete image from Supabase
async function deleteImageFromSupabase(bucketName, fileName) {
  try {
    const { error } = await supabaseClient.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting image:", err);
    return false;
  }
}

// Export functions for use in other files
window.SupabaseAPI = {
  getImagesFromBucket,
  uploadImageToSupabase,
  deleteImageFromSupabase,
  getPublicImageUrl,
  GALLERY_BUCKETS,
};
