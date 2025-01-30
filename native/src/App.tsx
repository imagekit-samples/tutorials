import {
  File as FileIcon,
  Trash as TrashIcon,
  Upload as UploadIcon,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";
import styles from "./styles";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "pending" | "uploading" | "success" | "error"
  >("pending");
  const [progress, setProgress] = useState(0);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setProgress(0);
    setStatus("pending");
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file!);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://72mpc8-3000.csb.app/upload");

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      }
    };

    xhr.send(formData);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUpload();
      }}
      onReset={() => {
        setProgress(0);
        setStatus("pending");
        setFile(null);
      }}
    >
      <h1 style={styles.heading}>Upload Files</h1>

      <div
        style={styles.uploadBox}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div style={styles.content}>
          <div style={styles.circle}>
            <UploadIcon size={32} />
          </div>

          <h2 style={styles.uploadText}>
            Drop your files here,
            <br /> or browse
          </h2>
        </div>
      </div>
      <input
        type="file"
        onChange={(e) => {
          setProgress(0);
          setStatus("pending");
          setFile(e.target.files?.[0] || null);
        }}
        hidden
        ref={inputRef}
      />

      {file && (
        <>
          <div style={styles.fileList}>
            <div style={styles.fileElement}>
              <div style={styles.fileIcon}>
                <FileIcon size={32} />
              </div>
              <div style={styles.fileDetails}>
                <p style={styles.fileName}>{file.name}</p>
                <p style={styles.fileSize}>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>

              <div style={styles.filler} />

              {status === "pending" && (
                <button
                  style={styles.trash}
                  onClick={(e) => {
                    e.preventDefault();
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                    setFile(null);
                  }}
                >
                  <TrashIcon size={32} />
                </button>
              )}
              {status === "uploading" && (
                <div style={styles.uploadingProgress}>
                  <div
                    style={{
                      ...styles.uploadingBar,
                      width: `${progress}%`,
                    }}
                  />
                  <p style={styles.uploadPercent}>{progress}%</p>
                </div>
              )}
              {status === "success" && (
                <p style={styles.successText}>File uploaded successfully!</p>
              )}
              {status === "error" && (
                <p style={styles.errorText}>File upload failed!</p>
              )}
            </div>
          </div>
          <div style={styles.uploadButtonContainer}>
            {status === "success" ? (
              <button style={styles.uploadButton} type="reset">
                Reset
              </button>
            ) : (
              <button
                style={styles.uploadButton}
                type="submit"
                disabled={status === "uploading"}
              >
                Upload Files
              </button>
            )}
          </div>
        </>
      )}
    </form>
  );
}

export default App;
