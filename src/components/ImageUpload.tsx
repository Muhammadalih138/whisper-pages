"use client";

type ImageUploadProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  function handleChange(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange?.(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="image-upload">
      <span>Cover image</span>
      <label className="upload-dropzone">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Selected cover preview" />
        ) : (
          <strong>Choose image</strong>
        )}
        <input
          accept="image/*"
          name="image"
          type="file"
          onChange={(event) => handleChange(event.target.files?.[0])}
        />
      </label>
    </div>
  );
}
