# Supabase Gallery Setup Guide

This guide will help you set up Supabase for your Navkar Photography website to store and manage images directly from a cloud database instead of local folders.

## Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click **Sign Up** and create an account
3. Create a new project:
   - Choose a **Project Name** (e.g., "navkar-photography")
   - Create a **Password** (save this securely)
   - Choose **Region** (closest to your location for better performance)
   - Click **Create new project** and wait for initialization (5-10 minutes)

## Step 2: Get Your Supabase Credentials

Once your project is created:

1. Go to **Settings** (bottom left) → **API**
2. Copy these values:
   - **Project URL** - looks like `https://xxxxx.supabase.co`
   - **anon public** - your public API key
3. Keep these safe! You'll need them in the next step.

## Step 3: Create Storage Buckets

1. In your Supabase dashboard, go to **Storage** (left sidebar)
2. Click **Create new bucket** and create these buckets (one for each gallery):
   - `wedding-jheel-neeraj`
   - `wedding-mauli-pankil`
   - `wedding-mihir-maitry`
   - `religious`

**Important:** For each bucket:

- Make it **Public** (so images are accessible on your website)
- Click the bucket settings ⚙️ and toggle **Public bucket** to ON

## Step 4: Update Configuration File

1. Open `supabase-config.js` in your project folder
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = "https://YOUR_SUPABASE_URL.supabase.co";
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   const ADMIN_PASSWORD = "your-secure-password-here"; // Change this!
   ```

Example:

```javascript
const SUPABASE_URL = "https://myproject123.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const ADMIN_PASSWORD = "MySecurePassword123!"; // Change to something secure
```

## Step 5: Use the Admin Panel

1. **Open the admin panel:**
   - Open `admin.html` in your browser
   - Use the password you set in step 4

2. **Upload images:**
   - Select a gallery from the dropdown
   - Click the upload area or drag & drop images
   - Wait for upload to complete
   - All images will appear in the preview section

3. **Delete images:**
   - Hover over an image in the preview section
   - Click the 🗑️ button to delete

## Step 6: View Your Gallery

Your website is now fully integrated with Supabase:

- **Wedding page:** `wedding.html` - shows couple album cards
- **Couple albums:**
  - `jheel-neeraj.html`
  - `mauli-pankil.html`
  - `mihir-maitry.html`
- **Religious page:** `religious.html`

All images load automatically from Supabase!

## Features

### Admin Panel (`admin.html`)

- 🔐 Secure login with admin password
- 📸 Drag & drop file uploads
- 📋 Multiple file selection
- 📊 Upload progress bar
- 👁️ Gallery preview with delete functionality
- 📱 Mobile-friendly interface

### Gallery Pages

- ⚡ Dynamic image loading from Supabase
- 🖼️ Lightbox viewer for full-screen viewing
- ⌨️ Keyboard navigation (arrow keys, ESC)
- 📱 Responsive design
- 🔄 Automatic sorting by upload date

## File Structure

```
project-root/
├── admin.html                 # Admin panel for uploading
├── supabase-config.js        # Configuration file (UPDATE THIS)
├── script.js                 # Gallery loading scripts
├── wedding.html              # Wedding page (updated)
├── religious.html            # Religious page (updated)
├── jheel-neeraj.html        # Album page (updated)
├── mauli-pankil.html        # Album page (updated)
├── mihir-maitry.html        # Album page (updated)
└── styles.css               # Styling (unchanged)
```

## How It Works

1. **Image Upload:** Admin uploads images via `admin.html` → Stored in Supabase Storage
2. **Image Display:** Gallery pages fetch images from Supabase using `supabase-config.js`
3. **Dynamic Loading:** `script.js` automatically populates gallery sections with images
4. **Viewer:** Built-in lightbox for viewing full-size images

## Security Notes

⚠️ **Important:**

- Your `SUPABASE_ANON_KEY` is public (safe for front-end use)
- Your project URL is also public (that's intended)
- Only the admin password protects image uploads
- **Change the default admin password** to something secure!

## Troubleshooting

### Images not showing up?

1. Check browser console (F12) for errors
2. Verify bucket names match exactly (case-sensitive)
3. Ensure buckets are set to **Public**
4. Check that images uploaded successfully in admin panel

### Upload fails?

1. Make sure `supabase-config.js` has correct credentials
2. Check network connection
3. Verify file size (Supabase has size limits)
4. Try different file format (JPG, PNG, WebP)

### Admin panel won't load?

1. Open `admin.html` in a modern browser (Chrome, Firefox, Safari, Edge)
2. Check that `supabase-config.js` is in the same folder
3. Check browser console for JavaScript errors

### Images are slow to load?

1. Optimize images before uploading (compress using online tools)
2. Use WebP format when possible (smaller file size)
3. Verify internet connection

## API Functions

The `supabase-config.js` file provides these functions:

```javascript
// Get all images from a bucket
await SupabaseAPI.getImagesFromBucket(bucketName);

// Upload a single image
await SupabaseAPI.uploadImageToSupabase(file, bucketName);

// Delete an image
await SupabaseAPI.deleteImageFromSupabase(bucketName, fileName);

// Get public URL for an image
SupabaseAPI.getPublicImageUrl(bucketName, fileName);
```

## GitHub Deployment

To upload your site to GitHub with Supabase:

1. **Initialize Git:**

   ```bash
   git init
   git add .
   git commit -m "Add Supabase integration"
   git branch -M main
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

2. **No need to commit images!** They're stored in Supabase cloud, not in your repo.

## Next Steps

1. ✅ Set up Supabase account and project
2. ✅ Create storage buckets
3. ✅ Update `supabase-config.js` with your credentials
4. ✅ Test admin panel upload
5. ✅ Deploy to GitHub (images stay in Supabase)
6. ✅ Share your website!

## Support

For issues with Supabase, visit: [supabase.com/docs](https://supabase.com/docs)

For issues with this integration, check the browser console (F12) for error messages.

---

**Happy photography! 📸**
