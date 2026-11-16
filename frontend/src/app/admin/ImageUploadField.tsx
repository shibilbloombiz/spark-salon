'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import UniversalVideo from '@/components/video/UniversalVideo';
import { parseVideoUrl } from '@/lib/videoUtils';

interface SingleImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  category?: string;
  csrfToken?: string;
  acceptVideo?: boolean;
  videoOnly?: boolean;
  thumbnailUrl?: string;
}

interface MultiImageUploadProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  category?: string;
  csrfToken?: string;
}

/**
 * Client-side magic byte inspection for immediate feedback before uploading
 */
async function checkClientMagicBytes(file: File): Promise<{ ok: boolean; type?: 'image' | 'video'; error?: string }> {
  const slice = file.slice(0, 32);
  const buffer = new Uint8Array(await slice.arrayBuffer());

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ok: true, type: 'image' };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { ok: true, type: 'image' };
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { ok: true, type: 'image' };
  }

  // Check ftyp brand for MP4 / MOV / AVIF
  let brand = '';
  for (let i = 4; i < Math.min(16, buffer.length); i++) {
    brand += String.fromCharCode(buffer[i]);
  }
  if (brand.includes('ftyp')) {
    if (brand.includes('avif') || brand.includes('avis')) {
      return { ok: true, type: 'image' };
    }
    return { ok: true, type: 'video' };
  }

  // QuickTime MOV atoms (moov, mdat, wide, free, skip)
  let atom = '';
  for (let i = 4; i < Math.min(8, buffer.length); i++) {
    atom += String.fromCharCode(buffer[i]);
  }
  if (['moov', 'mdat', 'wide', 'free', 'skip'].includes(atom)) {
    return { ok: true, type: 'video' };
  }

  // WebM: 1A 45 DF A3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return { ok: true, type: 'video' };
  }

  return {
    ok: false,
    error: 'Invalid file format or corrupted header. Allowed formats: JPG, PNG, WebP, AVIF, MP4, WebM, MOV.',
  };
}

/**
 * Copies text to clipboard with fallback selection
 */
export async function copyToClipboard(text: string, onCopied?: () => void): Promise<void> {
  if (!text) return;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      if (onCopied) onCopied();
      return;
    }
  } catch (_) {
    // Fall back to hidden textarea selection
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    if (onCopied) onCopied();
  } catch (err) {
    prompt('Copy URL:', text);
  }
  document.body.removeChild(textArea);
}

/**
 * Single Image / Video Upload Field with preview, replace, remove, and safe disk deletion
 */
export function SingleImageUpload({
  label,
  value,
  onChange,
  required = false,
  error,
  hint,
  category = 'studios',
  csrfToken = '',
  acceptVideo = false,
  videoOnly = false,
  thumbnailUrl = '',
}: SingleImageUploadProps) {
  const initialParsed = parseVideoUrl(value);
  const [mode, setMode] = useState<'upload' | 'url'>(() =>
    value && !initialParsed.isDirect ? 'url' : 'upload'
  );
  const lastExternalValRef = useRef<string>(value);
  useEffect(() => {
    if (value !== lastExternalValRef.current) {
      lastExternalValRef.current = value;
      const p = parseVideoUrl(value);
      if (value && !p.isDirect) {
        setMode('url');
      } else if (value && value.startsWith('/uploads/')) {
        setMode('upload');
      }
    }
  }, [value]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [clientError, setClientError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedVideo = parseVideoUrl(value);
  const isDirectVideoValue =
    /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i.test(value) ||
    (videoOnly && Boolean(value) && parsedVideo.isDirect);
  const isExternalVideoValue =
    Boolean(value) &&
    (videoOnly || (acceptVideo && ['youtube', 'instagram', 'vimeo'].includes(parsedVideo.platform)));

  const handleFile = useCallback(
    async (file: File) => {
      setClientError(null);
      setStatusMsg(null);
      setCopied(false);

      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const isVideo = file.type.startsWith('video/') || ['mp4', 'webm', 'mov'].includes(ext);

      // Separate maximum file sizes for images (15MB) and videos (250MB)
      const maxSize = isVideo ? 250 * 1024 * 1024 : 15 * 1024 * 1024;
      if (file.size > maxSize) {
        setClientError(
          `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum limit of ${
            isVideo ? '250 MB for videos' : '15 MB for images'
          }.`
        );
        return;
      }

      // Check magic bytes by inspecting binary header
      const check = await checkClientMagicBytes(file);
      if (!check.ok) {
        setClientError(check.error || 'Invalid file format.');
        return;
      }

      if (videoOnly && check.type !== 'video') {
        setClientError('Please upload a direct video file (MP4, WebM, MOV) or switch to "Video Platform Link".');
        return;
      }

      if (!acceptVideo && !videoOnly && check.type === 'video') {
        setClientError('Video files are not permitted for this field. Please upload an image (JPG, PNG, WebP, AVIF).');
        return;
      }

      // Upload via XMLHttpRequest to capture real progress
      setUploading(true);
      setProgress(5);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/admin/uploads');
      if (csrfToken) {
        xhr.setRequestHeader('x-csrf-token', csrfToken);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 98);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        setProgress(100);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.url) {
              onChange(res.url);
              setStatusMsg('File uploaded and saved to local server.');
              setTimeout(() => setStatusMsg(null), 3000);
            }
          } catch (e) {
            setClientError('Upload succeeded but server response was invalid.');
          }
        } else {
          try {
            const res = JSON.parse(xhr.responseText);
            setClientError(res.error || 'Upload failed.');
          } catch (_) {
            setClientError(`Upload failed with status code ${xhr.status}.`);
          }
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setClientError('Network error occurred during file upload.');
      };

      xhr.send(formData);
    },
    [acceptVideo, videoOnly, category, csrfToken, onChange]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleCopy = () => {
    copyToClipboard(value, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Safe server deletion check
  const handleDeleteFromDisk = async () => {
    if (!value) return;
    if (!value.startsWith('/uploads/') && !value.includes('/uploads/')) {
      onChange('');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this file from the local server disk?'
    );
    if (!confirmed) return;

    setDeleting(true);
    setClientError(null);

    try {
      const res = await fetch('/api/admin/uploads', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({ url: value, force: false }),
      });

      const data = await res.json();
      setDeleting(false);

      if (res.status === 409 && data.inUse) {
        const refList = (data.references || [])
          .map((r: any) => `• ${r.collection.toUpperCase()}: "${r.name}" (${r.field})`)
          .join('\n');
        alert(
          `Cannot delete file from disk. It is currently referenced in:\n\n${refList}\n\nPlease remove or replace the file in those records first.`
        );
        return;
      }

      if (!res.ok) {
        setClientError(data.error || 'Failed to delete file from disk.');
        return;
      }

      onChange('');
      setStatusMsg('File permanently deleted from disk storage.');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setDeleting(false);
      setClientError(err.message || 'Error deleting file.');
    }
  };

  return (
    <div className="field wide img-upload-widget">
      <div className="img-upload-header">
        <label>
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
        <div className="tab-pill-row" role="tablist">
          <button
            type="button"
            role="tab"
            className={`tab-btn ${mode === 'upload' ? 'active' : ''}`}
            aria-selected={mode === 'upload'}
            onClick={() => {
              setClientError(null);
              setMode('upload');
            }}
          >
            {videoOnly ? '1. Upload Direct Video' : `Upload ${acceptVideo ? 'file' : 'image'}`}
          </button>
          <button
            type="button"
            role="tab"
            className={`tab-btn ${mode === 'url' ? 'active' : ''}`}
            aria-selected={mode === 'url'}
            onClick={() => {
              setClientError(null);
              setMode('url');
            }}
          >
            {videoOnly ? '2. Video Platform Link' : 'Paste URL'}
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <div
            className={`drop-zone ${isDragOver ? 'is-dragover' : ''}`}
            data-dragover={isDragOver ? 'true' : undefined}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept={
                videoOnly
                  ? 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov'
                  : acceptVideo
                  ? 'image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime,.jpg,.jpeg,.png,.webp,.avif,.mp4,.webm,.mov'
                  : 'image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif'
              }
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              className="drop-zone-text"
              onClick={() => fileInputRef.current?.click()}
            >
              {videoOnly ? 'Choose video file or drag and drop here' : 'Choose file or drag and drop here'}
            </button>
            <p className="drop-zone-sub">
              {videoOnly
                ? 'Accepts MP4, WebM, MOV direct video up to 250 MB'
                : `Accepts JPG, PNG, WebP, AVIF up to 15 MB ${acceptVideo ? '(or MP4, WebM, MOV up to 250 MB)' : ''}`}
            </p>
          </div>

          {uploading && (
            <div className="upload-progress-wrap">
              <div className="upload-progress-bar">
                <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="hint">Uploading {progress}%</span>
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={value || ''}
            placeholder={
              videoOnly
                ? 'https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/...'
                : 'https://... or /uploads/...'
            }
            onChange={(e) => {
              setClientError(null);
              onChange(e.target.value.trim());
            }}
          />
          {videoOnly && (
            <p className="hint" style={{ marginTop: 6 }}>
              Paste a video link from <strong>YouTube</strong>, <strong>YouTube Shorts</strong>,{' '}
              <strong>Instagram Reels / Posts</strong>, <strong>Vimeo</strong>, or a direct <code>.mp4</code> URL.
              {value ? ` Detected: ${parsedVideo.platformLabel}.` : ''}
            </p>
          )}
        </div>
      )}

      {/* Preview Card with image, direct HTML5 video player, or platform video badge */}
      {value && (
        <div className="img-preview-card">
          {isDirectVideoValue || parsedVideo.platform === 'youtube' ? (
            <div className="img-preview-thumb" style={{ position: 'relative', overflow: 'hidden' }}>
              <UniversalVideo
                videoUrl={value}
                poster={thumbnailUrl || undefined}
                objectFit="cover"
                showMuteToggle={false}
              />
            </div>
          ) : isExternalVideoValue ? (
            <div className="video-link-preview-box">
              {(thumbnailUrl || parsedVideo.autoThumbnailUrl) && (
                <img
                  src={thumbnailUrl || parsedVideo.autoThumbnailUrl}
                  alt={parsedVideo.platformLabel}
                  className="video-link-thumb-img"
                />
              )}
              <span className="video-platform-pill">{parsedVideo.platformLabel}</span>
            </div>
          ) : (
            <img
              className="img-preview-thumb"
              src={value}
              alt="Preview"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}

          <div className="img-preview-details">
            <p className="img-preview-url" title={value}>{value}</p>
            <div className="img-preview-actions">
              <button type="button" className="btn ghost sm" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
              {isExternalVideoValue && (
                <a
                  href={parsedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn ghost sm"
                >
                  Open Link &#8599;
                </a>
              )}
              {mode === 'upload' && (
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => {
                    setMode('upload');
                    setTimeout(() => fileInputRef.current?.click(), 50);
                  }}
                >
                  Replace
                </button>
              )}
              <button type="button" className="btn ghost sm" onClick={() => onChange('')}>
                Remove
              </button>
              {(value.startsWith('/uploads/') || value.includes('/uploads/')) && (
                <button
                  type="button"
                  className="danger-text-btn"
                  disabled={deleting}
                  onClick={handleDeleteFromDisk}
                >
                  {deleting ? 'Deleting...' : 'Delete from disk'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {statusMsg && <p className="status-ok" role="status">{statusMsg}</p>}
      {hint && <p className="hint">{hint}</p>}
      {(clientError || error) && <p className="err" role="alert">{clientError || error}</p>}
    </div>
  );
}

/**
 * Multiple Images Upload & Ordering Field with batch upload support
 */
export function MultiImageUpload({
  label,
  values = [],
  onChange,
  required = false,
  error,
  hint,
  category = 'services',
  csrfToken = '',
}: MultiImageUploadProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const multiInputRef = useRef<HTMLInputElement>(null);

  const addImage = (url: string) => {
    if (!url) return;
    onChange([...values, url]);
  };

  const removeImage = (index: number) => {
    const next = [...values];
    next.splice(index, 1);
    onChange(next);
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...values];
    const item = next[index];
    next[index] = next[index - 1];
    next[index - 1] = item;
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index >= values.length - 1) return;
    const next = [...values];
    const item = next[index];
    next[index] = next[index + 1];
    next[index + 1] = item;
    onChange(next);
  };

  const handleCopy = (url: string, index: number) => {
    copyToClipboard(url, () => {
      setCopiedIdx(index);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  // Batch upload handler for multiple files at once
  const handleBatchUpload = async (fileList: FileList) => {
    setBatchError(null);
    setBatchUploading(true);

    const formData = new FormData();
    formData.append('category', category);

    const filesToUpload: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 15 * 1024 * 1024) {
        setBatchError(`File ${file.name} exceeds maximum 15 MB image limit.`);
        setBatchUploading(false);
        return;
      }
      filesToUpload.push(file);
      formData.append('files', file);
    }

    try {
      const res = await fetch('/api/admin/uploads/multi', {
        method: 'POST',
        headers: csrfToken ? { 'x-csrf-token': csrfToken } : {},
        body: formData,
      });

      const data = await res.json();
      setBatchUploading(false);

      if (!res.ok) {
        setBatchError(data.error || 'Failed to upload batch files.');
        return;
      }

      if (data.files && Array.isArray(data.files)) {
        const newUrls = data.files.map((f: any) => f.url);
        onChange([...values, ...newUrls]);
      }
    } catch (err: any) {
      setBatchUploading(false);
      setBatchError(err.message || 'Network error during batch upload.');
    }
  };

  return (
    <div className="field wide img-upload-widget">
      <div className="img-upload-header">
        <label>
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
        <div>
          <input
            type="file"
            ref={multiInputRef}
            multiple
            hidden
            accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleBatchUpload(e.target.files);
              }
            }}
          />
          <button
            type="button"
            className="btn ghost sm"
            disabled={batchUploading}
            onClick={() => multiInputRef.current?.click()}
          >
            {batchUploading ? 'Uploading batch...' : '+ Upload multiple files'}
          </button>
        </div>
      </div>

      {batchError && <p className="err" role="alert">{batchError}</p>}

      {/* Add Single Image/URL to collection */}
      <SingleImageUpload
        label="Add image to collection"
        value=""
        onChange={addImage}
        category={category}
        csrfToken={csrfToken}
        hint="Upload an image or paste a URL to add it to the image gallery."
      />

      {/* List of currently attached images with Move Up / Move Down / Remove */}
      {values.length > 0 && (
        <div className="multi-img-list">
          <p className="hint">
            {values.length} item{values.length > 1 ? 's' : ''} in gallery (order saved as shown):
          </p>
          {values.map((url, idx) => {
            const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
            return (
              <div className="multi-img-item" key={`${url}-${idx}`}>
                <span className="multi-img-order">{idx + 1}.</span>
                {isVideo ? (
                  <div className="multi-img-thumb" style={{ position: 'relative', overflow: 'hidden' }}>
                    <UniversalVideo
                      videoUrl={url}
                      objectFit="cover"
                      showMuteToggle={false}
                    />
                  </div>
                ) : (
                  <img
                    className="multi-img-thumb"
                    src={url}
                    alt={`Gallery item ${idx + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="img-preview-details">
                  <span className="img-preview-url" title={url}>{url}</span>
                  <div className="img-preview-actions">
                    <button type="button" className="btn ghost sm" onClick={() => handleCopy(url, idx)}>
                      {copiedIdx === idx ? 'Copied!' : 'Copy URL'}
                    </button>
                    <button type="button" className="btn ghost sm" onClick={() => moveUp(idx)} disabled={idx === 0}>
                      Move up
                    </button>
                    <button type="button" className="btn ghost sm" onClick={() => moveDown(idx)} disabled={idx === values.length - 1}>
                      Move down
                    </button>
                    <button type="button" className="btn ghost sm" onClick={() => removeImage(idx)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hint && <p className="hint">{hint}</p>}
      {error && <p className="err" role="alert">{error}</p>}
    </div>
  );
}
