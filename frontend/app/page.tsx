"use client";

import axios from "axios";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) setFile(event.target.files[0]);
  };

  const uploadFile = () => {
    const formData = new FormData();

    if (file !== null) formData.append("file", file);
    axios
      .post("http://localhost:8000/upload", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent?.bytes)
            setProgress(() => {
              if (progressEvent.total)
                return Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
              return 0;
            });
        },
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <h1 className="text-3xl font-medium">Stashio</h1>
      <p className="text-lg"> A Minimalist Cloud Storage App</p>
      <div>
        {progress === 0 ? (
          <>
            <input
              type="file"
              name="file"
              onChange={(e) => handleFileChange(e)}
            />
            <button
              onClick={() => uploadFile()}
              className="border rounded-md border-gray-500 py-1 px-2"
            >
              Upload
            </button>
          </>
        ) : (
          <div className="flex gap-2 items-center">
            <p className="text-xs">
              {progress}
              {"%"}
            </p>
            <div className="w-[350px] bg-gray-200 rounded-full">
              <div
                className="bg-blue p-0.5 font-medium leading-none rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
