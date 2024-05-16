"use client";

interface PhotoUploadProps {
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PhotoUpload({ onPhotoChange }: PhotoUploadProps) {
  return (
    <div className="max-w-sm">
      <form>
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400"
          />
        </label>
      </form>
    </div>
  );
}
