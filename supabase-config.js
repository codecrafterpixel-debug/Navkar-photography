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

// Function to get public URL for an image
function getPublicImageUrl(bucketName, fileName) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${fileName}`;
}

// Function to upload image to Supabase
async function uploadImageToSupabase(file, bucketName) {
  try {
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    return {
      name: fileName,
      url: getPublicImageUrl(bucketName, fileName),
      bucket: bucketName,
    };
  } catch (err) {
    console.error("Error uploading image:", err);
    return null;
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
