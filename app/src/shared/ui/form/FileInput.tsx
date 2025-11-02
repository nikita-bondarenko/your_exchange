import { createRef, useEffect, useState } from "react";
import { DownloadIcon } from "../icon";
import { FilePreview } from "./FilePreview";

type Props = {
  onChange: (file: File) => void;
  value: File | null;
};

export const FileInput = ({ onChange, value }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [fileType, setFileType] = useState<string>();
  const fileInputElement = createRef<HTMLInputElement>();

  useEffect(() => {
    console.log(value);
    if (!value?.type) return;
    console.log(value.type);
    const imageUrl = URL?.createObjectURL(value);
    setPreviewUrl(imageUrl);
    setFileType(value.type);
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    onChange(selectedFile);
  };

  const onClick = () => {
    if (fileInputElement.current) {
      fileInputElement.current.click();
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden w-85 h-85 rounded-6 border border-[var(--border-placeholder)] bg-[var(--background-secondary)]"
    >
      <DownloadIcon
        className="center z-10"
        color="var(--main-color)"
      ></DownloadIcon>
      <input
        accept="application/pdf,image/*"
        ref={fileInputElement}
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />
      <FilePreview
        fileType={fileType}
        fileUrl={previewUrl}
        className="center w-full h-full z-0 opacity-70"
      ></FilePreview>
    </div>
  );
};
