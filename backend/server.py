import os
import shutil
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import time

app = FastAPI()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount the uploads directory to serve static files
app.mount("/storage", StaticFiles(directory=UPLOAD_DIR), name="storage")

@app.post("/upload/{bucket}")
async def upload_file(bucket: str, file: UploadFile = File(...)):
    bucket_dir = os.path.join(UPLOAD_DIR, bucket)
    os.makedirs(bucket_dir, exist_ok=True)
    
    # Sanitize filename
    safe_filename = "".join([c for c in file.filename if c.isalpha() or c.isdigit() or c in (' ', '.', '_', '-')]).rstrip()
    unique_filename = f"{int(time.time())}-{safe_filename}"
    file_path = os.path.join(bucket_dir, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {
        "name": unique_filename,
        "url": f"http://localhost:8000/storage/{bucket}/{unique_filename}",
        "bucket": bucket
    }

@app.get("/list/{bucket}")
async def list_files(bucket: str):
    bucket_dir = os.path.join(UPLOAD_DIR, bucket)
    if not os.path.exists(bucket_dir):
        return []
    
    files = []
    for filename in os.listdir(bucket_dir):
        file_path = os.path.join(bucket_dir, filename)
        if os.path.isfile(file_path):
            stat = os.stat(file_path)
            files.append({
                "name": filename,
                "url": f"http://localhost:8000/storage/{bucket}/{filename}",
                "bucket": bucket,
                "created_at": stat.st_ctime
            })
            
    # Sort files by created_at (ascending, as original code requested)
    files.sort(key=lambda x: x["created_at"])
    return files

@app.delete("/delete/{bucket}/{filename}")
async def delete_file(bucket: str, filename: str):
    file_path = os.path.join(UPLOAD_DIR, bucket, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"success": True}
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)

