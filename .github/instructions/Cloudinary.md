# Cloudinary Image Upload - Vite + React (Client-Side Only)

**No Backend Required!** This guide shows how to upload images directly from your Vite + React app to Cloudinary using unsigned upload presets.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Cloudinary Setup](#cloudinary-setup)
- [Client-Side Upload Implementation](#client-side-upload-implementation)
- [Component Examples](#component-examples)
- [PDF Support](#pdf-support)
- [Testing](#testing)
- [Deployment](#deployment)

## Prerequisites

### 1. Cloudinary Account Setup

1. **Create Account**: Go to [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. **Get Credentials**: After signup, go to Dashboard → Account Details
3. **Note your Cloud Name** (you'll need this)

**Free Tier Limits:**
- 25 GB storage
- 25 GB monthly bandwidth
- Unlimited transformations
- No credit card required

## Cloudinary Setup

### Create Upload Preset

1. Go to **Cloudinary Dashboard → Upload → Upload presets**
2. Click **"Add upload preset"**
3. Configure:
   - **Name**: `vite-client-uploads`
   - **Mode**: `Unsigned` ⭐ (key for client-side uploads)
   - **Folder**: `vite-app/uploads`
   - **Allowed formats**: `jpg,png,webp,gif` (or add `pdf` for PDFs)
   - **Max file size**: `5242880` (5MB)
   - **Max image width/height**: Set as needed

4. **Save** the preset

## Vite Project Setup

### 2. Install Dependencies

```bash
pnpm install react-dropzone
pnpm install --save-dev @types/react-dropzone
```

### 3. Environment Variables

Create `.env.local`:

```env
# Cloudinary Configuration (Client-side accessible)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=vite-client-uploads
```

## Client-Side Upload Implementation

### Upload Hook (No Backend!)

Create `src/hooks/useImageUpload.ts`:

```typescript
import { useState } from 'react';

interface UploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  pages?: number; // For PDFs
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadToCloudinary = async (file: File): Promise<UploadResult> => {
    const { VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET } = import.meta.env;

    if (!VITE_CLOUDINARY_CLOUD_NAME || !VITE_CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary configuration missing');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'vite-app/uploads');

    // Optional: Add transformations
    if (file.type.startsWith('image/')) {
      formData.append('transformation', JSON.stringify([
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]));
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    return response.json();
  };

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      // Client-side validation
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        throw new Error('Please select an image or PDF file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File too large (max 5MB)');
      }

      setProgress(30);

      const result = await uploadToCloudinary(file);

      setProgress(100);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        bytes: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
        pages: result.pages // For PDFs
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const uploadMultiple = async (files: File[]) => {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const result = await uploadFile(files[i]);
      results.push(result);
    }
    return results;
  };

  return {
    uploadFile,
    uploadMultiple,
    uploading,
    progress,
    error
  };
};
```

### Cloudinary Utilities

Create `src/lib/cloudinary.ts`:

```typescript
export const getCloudinaryUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
    page?: number; // For PDFs
  } = {}
) => {
  const { VITE_CLOUDINARY_CLOUD_NAME } = import.meta.env;

  if (!VITE_CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary cloud name not configured');
  }

  const transformations = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.page) transformations.push(`pg_${options.page}`); // PDF page

  const transformationString = transformations.length > 0
    ? transformations.join(',') + '/'
    : '';

  return `https://res.cloudinary.com/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}${publicId}`;
};

// For PDF thumbnails
export const getPDFThumbnail = (publicId: string, page: number = 1) => {
  return getCloudinaryUrl(publicId, {
    page,
    width: 300,
    height: 400,
    crop: 'fill',
    format: 'jpg'
  });
};
```

## Component Examples

### 📱 Mobile-Responsive Design

All components are built with **mobile-first responsive design**:

- **Upload Zone**: Adapts padding and text size for mobile (`p-4 sm:p-6`, `text-sm sm:text-base`)
- **Image Gallery**: Uses responsive grid (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`)
- **PDF Gallery**: Stacks vertically on mobile, side-by-side on larger screens (`grid-cols-1 sm:grid-cols-2`)
- **Buttons & Controls**: Touch-friendly sizing with proper spacing
- **Typography**: Scales appropriately across screen sizes

### Unified File Upload Component (Mobile Responsive)

Create `src/components/FileUpload.tsx`:

```tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImageUpload } from '../hooks/useImageUpload';

interface FileUploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  pages?: number;
}

interface FileUploadProps {
  onUpload: (result: FileUploadResult) => void;
  acceptImages?: boolean;
  acceptPDFs?: boolean;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  acceptImages = true,
  acceptPDFs = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  className = ''
}) => {
  const { uploadFile, uploadMultiple, uploading, progress, error } = useImageUpload();

  const acceptedTypes: Record<string, string[]> = {};
  if (acceptImages) {
    acceptedTypes['image/*'] = ['.jpeg', '.jpg', '.png', '.webp', '.gif'];
  }
  if (acceptPDFs) {
    acceptedTypes['application/pdf'] = ['.pdf'];
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      if (acceptedFiles.length === 1) {
        const result = await uploadFile(acceptedFiles[0]);
        onUpload(result);
      } else {
        const results = await uploadMultiple(acceptedFiles);
        results.forEach(result => onUpload(result));
      }
    } catch (err) {
      // Error handled by hook
    }
  }, [uploadFile, uploadMultiple, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles,
    disabled: uploading,
    multiple: maxFiles > 1
  });

  const getSupportedFormats = () => {
    const formats = [];
    if (acceptImages) formats.push('JPG, PNG, WebP, GIF');
    if (acceptPDFs) formats.push('PDF');
    return formats.join(', ');
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Uploading...</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-600 text-sm sm:text-base">Drop files here...</p>
        ) : (
          <div>
            <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Supports: {getSupportedFormats()} (max {maxSize / 1024 / 1024}MB each)
              {maxFiles > 1 && `, up to ${maxFiles} files`}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-red-600 text-xs sm:text-sm">{error}</div>
      )}
    </div>
  );
};
```

### File Gallery Component (Images vs PDFs)

Create `src/components/FileGallery.tsx`:

```tsx
import React from 'react';
import { getPDFThumbnail } from '../lib/cloudinary';

interface FileItem {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  pages?: number;
}

interface FileGalleryProps {
  files: FileItem[];
  onRemove: (index: number) => void;
  className?: string;
}

export const FileGallery: React.FC<FileGalleryProps> = ({
  files,
  onRemove,
  className = ''
}) => {
  if (files.length === 0) return null;

  const images = files.filter(file => file.format !== 'pdf');
  const pdfs = files.filter(file => file.format === 'pdf');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Images Gallery */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Images ({images.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {images.map((file, index) => {
              const actualIndex = files.indexOf(file);
              return (
                <div key={file.publicId} className="relative group">
                  <img
                    src={file.url}
                    alt={`Uploaded ${file.format}`}
                    className="w-full h-20 sm:h-24 md:h-28 lg:h-32 object-cover rounded-lg border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(actualIndex)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                    title="Remove image"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                    {file.format.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PDFs Gallery */}
      {pdfs.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Documents ({pdfs.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {pdfs.map((file, index) => {
              const actualIndex = files.indexOf(file);
              return (
                <div key={file.publicId} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={getPDFThumbnail(file.publicId)}
                        alt={`PDF ${index + 1} thumbnail`}
                        className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded border shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 truncate">
                            Document {index + 1}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1">
                            {file.pages || 1} page{(file.pages || 1) !== 1 ? 's' : ''} • {(file.bytes / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(actualIndex)}
                          className="flex-shrink-0 ml-2 text-red-600 hover:text-red-800 p-1"
                          title="Remove document"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          View PDF
                        </a>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-gray-500 uppercase">{file.format}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
```

### Example Usage Component

Create `src/components/MediaManager.tsx`:

```tsx
import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { FileGallery } from './FileGallery';

interface MediaFile {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  pages?: number;
}

export const MediaManager: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);

  const handleUpload = (result: MediaFile) => {
    setFiles(prev => [...prev, result]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const imageCount = files.filter(f => f.format !== 'pdf').length;
  const pdfCount = files.filter(f => f.format === 'pdf').length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Media Manager</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Upload images and PDF documents
        </p>
        {(imageCount > 0 || pdfCount > 0) && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {imageCount > 0 && `${imageCount} image${imageCount !== 1 ? 's' : ''}`}
            {imageCount > 0 && pdfCount > 0 && ', '}
            {pdfCount > 0 && `${pdfCount} document${pdfCount !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      <FileUpload
        onUpload={handleUpload}
        acceptImages={true}
        acceptPDFs={true}
        maxFiles={10}
        className="bg-white rounded-lg shadow-sm border"
      />

      <FileGallery
        files={files}
        onRemove={removeFile}
      />
    </div>
  );
};
```

## PDF Support

**Yes! Cloudinary fully supports PDFs** 📄

### PDF Features

- ✅ **Upload PDFs** as raw files
- ✅ **Generate thumbnails** from PDF pages
- ✅ **Extract text** (with add-ons)
- ✅ **Convert to images** (page by page)
- ✅ **Apply transformations** (resize, crop, etc.)

### PDF Upload Setup

1. **Update Upload Preset**:
   - Add `pdf` to allowed formats
   - Set resource type to `auto`

2. **PDF-Specific Code**:

```typescript
// Upload PDF
const uploadPDF = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'vite-client-uploads');
  formData.append('resource_type', 'auto'); // Important for PDFs

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: 'POST', body: formData }
  );

  const result = await response.json();
  return {
    url: result.secure_url,
    publicId: result.public_id,
    pages: result.pages, // Number of pages in PDF
    format: 'pdf'
  };
};

// Generate thumbnail from page 1
const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/pg_1,w_300,h_400,c_fill/${publicId}.jpg`;

// Convert entire PDF to images
const pageImages = [];
for (let page = 1; page <= totalPages; page++) {
  const pageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/pg_${page}/${publicId}.jpg`;
  pageImages.push(pageUrl);
}
```

### PDF Response Example

```json
{
  "public_id": "sample_pdf",
  "format": "pdf",
  "version": 1699123456,
  "resource_type": "image",
  "type": "upload",
  "created_at": "2023-11-04T12:30:56Z",
  "bytes": 245760,
  "width": 0,
  "height": 0,
  "pages": 3,
  "url": "http://res.cloudinary.com/demo/image/upload/v1699123456/sample_pdf.pdf",
  "secure_url": "https://res.cloudinary.com/demo/image/upload/v1699123456/sample_pdf.pdf"
}
```

### Environment Variables for Production

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=vite-client-uploads
```

### Cloudinary Production Setup

1. Create a **production upload preset**:
   - Name: `vite-prod-uploads`
   - Folder: `vite-app/production`
   - Configure limits and transformations

2. Update environment variables for production

## Key Differences from Backend Approach

| Aspect | Client-Side Only | With Backend |
|--------|------------------|--------------|
| **Security** | Upload preset visible in client | More secure with signatures |
| **Setup Complexity** | ⭐ Very simple | More complex |
| **Customization** | Limited by preset | Full control |
| **File Validation** | Client-side only | Server + client validation |
| **Cost** | No backend server costs | Backend hosting costs |
| **Scalability** | Direct to Cloudinary CDN | Depends on backend |

## Troubleshooting

### Common Issues

#### 1. "Upload preset not found"

- Check preset name in environment variables
- Ensure preset exists and is set to "Unsigned" mode

#### 2. "File too large"

- Check upload preset max file size settings
- Verify client-side size validation

#### 3. CORS errors

- Shouldn't happen with direct Cloudinary uploads
- If using custom domain, check Cloudinary settings

#### 4. Environment variables not working

- Must use `VITE_` prefix
- Restart dev server after adding variables

---

**🎉 You're all set!** This client-side only approach is perfect for simple applications and works great with static hosting platforms like Vercel, Netlify, or GitHub Pages.
</content>
</parameter>