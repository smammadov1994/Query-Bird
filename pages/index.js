import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const MyDropzone = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    onUpload(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {isDragActive
        ? "Drop the files here ..."
        : "Drag and drop voice recordings here or click to select files"}
    </div>
  );
};

const IndexPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [fact, setFact] = useState("");

  const handleUpload = async (files) => {
    setRecordings(files);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    recordings.forEach((file) => formData.append("recordings", file));
    await axios.post("/api/generate", formData);
  };

  async function fetchFact(limit) {
    try {
      const response = await fetch(
        "https://api.api-ninjas.com/v1/facts?limit=" + limit,
        {
          method: "GET",
          headers: {
            "X-Api-Key": process.env.NEXT_PUBLIC_FACTS_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setFact(result[0].fact);
    } catch (error) {
      console.error("Error: ", error.message);
    }
  }

  React.useEffect(() => {
    fetchFact(1);
  }, []);

  return (
    <div className="container">
      <div className="left-panel">
        <MyDropzone onUpload={handleUpload} />
        {recordings.length > 0 && (
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        )}
      </div>
      <div className="right-panel">
        {fact ? (
          <div className="fact-container">
            <p
              style={{
                fontSize: "1.5rem",
                fontFamily: "sans-serif",
              }}
            >
              {fact}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default IndexPage;
