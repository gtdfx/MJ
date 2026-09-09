import { useState, useRef } from 'react';
import { Upload, Link2, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const MAX_SOURCE_MB = 10;
const MAX_DIMENSION = 1200;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

// Resize + compress an image file to a data URL that fits comfortably in localStorage.
const fileToCompressedDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image.'));
      img.onload = () => {
        // Scale down to fit MAX_DIMENSION on the longest side
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        // Compress, stepping quality down if still too large
        let quality = 0.82;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > 900_000 && quality > 0.4) {
          quality -= 0.15;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

export default function ImageUpload({ value, onChange, label = 'Product Image' }) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setError('');
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_SOURCE_MB * 1024 * 1024) {
      setError(`Image is too large (max ${MAX_SOURCE_MB} MB).`);
      return;
    }
    setProcessing(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      onChange(dataUrl);
    } catch (e) {
      setError(e.message || 'Something went wrong processing that image.');
    } finally {
      setProcessing(false);
    }
  };

  const clear = () => {
    onChange('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {/* Mode Tabs */}
      <div className="flex gap-1 mb-2 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Upload size={12} /> Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Link2 size={12} /> Image URL
        </button>
      </div>

      {mode === 'upload' ? (
        value ? (
          /* Preview with remove */
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <img src={value} alt="Product preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Image ready</p>
              <p className="text-xs text-gray-400">{Math.round(value.length * 0.75 / 1024)} KB · auto-compressed</p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Replace</button>
              <button type="button" onClick={clear} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Remove image">
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Drop zone */
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              dragOver ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold/50 hover:bg-gray-50'
            }`}
          >
            {processing ? (
              <Loader2 size={24} className="text-gold animate-spin mb-2" />
            ) : (
              <ImageIcon size={24} className="text-gray-300 mb-2" />
            )}
            <p className="text-sm text-gray-600 font-medium">
              {processing ? 'Processing image…' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP · up to {MAX_SOURCE_MB} MB · auto-resized & compressed</p>
          </div>
        )
      ) : (
        /* URL input */
        <div className="flex gap-2">
          <input
            type="text"
            value={value && !value.startsWith('data:') ? value : ''}
            onChange={e => onChange(e.target.value)}
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
            placeholder="/images/opal-rough.jpg or https://..."
          />
          {value && (
            <button type="button" onClick={clear} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Remove image">
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* URL mode preview */}
      {mode === 'url' && value && !value.startsWith('data:') && (
        <div className="mt-2 flex items-center gap-3">
          <img src={value} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-gray-200" onError={e => { e.target.style.opacity = 0.3; }} />
          <span className="text-xs text-gray-400">Image preview</span>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
