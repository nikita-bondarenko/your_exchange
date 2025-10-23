import { createRef, useEffect, useState } from "react";
import { DownloadIcon } from "../icon";
import { FilePreview } from "./FilePreview";

type Props = {
  onChange: (file: File | undefined) => void;
};

export const FileInput = ({ onChange }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [fileType, setFileType] = useState<string>();
  const fileInputElement = createRef<HTMLInputElement>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    onChange(selectedFile);
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(imageUrl);
      setFileType(selectedFile.type);
    }
  };

  const onClick = () => {
    if (fileInputElement.current) {
      fileInputElement.current.click();
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
