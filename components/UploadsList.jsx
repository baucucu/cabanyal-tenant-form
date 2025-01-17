"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function UploadsList({ uploads, handleUploadDelete }) {
  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
      <ul className="bg-white shadow rounded-lg overflow-hidden">
        {uploads.map((file) => (
          <li
            key={file.id || file.handle}
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div className="flex items-center space-x-3">
              <div
                className="file-icon h-8 flex items-center justify-center rounded-full"
                data-file={file.filename.split(".").pop() || ""}
              />
              {/* <FileIcon
                 fileType={file.filename.split(".").pop() || ""}
                 className="w-10 h-10"
               /> */}
              <span className="text-sm font-medium truncate max-w-[200px]">
                {file.filename}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleUploadDelete(file.handle)}
              aria-label={`Delete ${file.filename}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
