import React, { useState, useEffect } from "react";
import { FaFileWord } from "react-icons/fa6";
import axios from "axios";
import { ProgressBar } from 'react-bootstrap';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convert, setConvert] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);
  const [fileHistory, setFileHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("fileHistory")) || [];
    setFileHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadProgress(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setConvert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsLoading(true);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/convertFile",
        formData,
        {
          responseType: "blob",
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentage = Math.floor((loaded * 100) / total);
            setUploadProgress(percentage);
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf";
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setSelectedFile(null);
      setDownloadError("");
      setConvert("File Converted Successfully");

      const newFile = { name: fileName, url };
      const updatedHistory = [...fileHistory, newFile];
      setFileHistory(updatedHistory);
      localStorage.setItem("fileHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDownloadError("Error occurred: " + error.response.data.message);
      } else {
        setConvert("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleReDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleDelete = (index) => {
    const updatedHistory = fileHistory.filter((_, i) => i !== index);
    setFileHistory(updatedHistory);
    localStorage.setItem("fileHistory", JSON.stringify(updatedHistory));
  };

  return (
    <div className={`max-w-screen-xl mx-auto container px-6 py-5 md:px-40 ${isDarkMode ? 'dark bg-slate-800' : 'light'}`}>
      <div className={`flex h-screen items-center justify-center ${isDarkMode ? 'dark-body' : 'light-body'}`}>
        <div className={`border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg ${isDarkMode ? 'dark-border border-blue-600' : 'light-border'}`}>
          <h1 className={`text-3xl font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Convert Word to PDF Online
          </h1>
          <p className={`text-sm text-center mb-5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Convert any Word documents to PDF format online in just one click!
          </p>

          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept=".doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="FileInput"
            />
            <label
              htmlFor="FileInput"
              className={`w-full flex items-center justify-center px-4 py-6 bg-blue-100 text-gray-700 rounded-lg shadow-lg cursor-pointer hover:bg-blue-700 hover:text-white border-slate-900 duration-300 ${isDarkMode ? 'dark-label bg-blue-400' : 'light-label'}`}
            >
              <FaFileWord className="text-3xl mr-3" />
              <span className={`text-2xl mr-2 mb-2 font-bold`}>
                {selectedFile ? selectedFile.name : "CHOOSE A FILE"}
              </span>
            </label>
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className={`text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none duration-300 font-bold px-4 py-2 rounded-lg ${isDarkMode ? 'dark-button' : 'light-button'}`}
            >
              {isLoading ? "Converting..." : "Convert File"}
            </button>
            {isLoading && (
              <ProgressBar
                animated
                now={uploadProgress}
                label={`${uploadProgress}%`}
                className="w-full mt-2"
              />
            )}
            {convert && (
              <div className={`text-green-500 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>{convert}</div>
            )}
            {downloadError && (
              <div className={`text-red-500 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>{downloadError}</div>
            )}

            <button
              onClick={toggleDarkMode}
              className={`text-white bg-gray-700 hover:bg-gray-900 duration-300 font-bold px-4 py-2 mb-2 rounded-lg mt-4 ${isDarkMode ? 'dark-button' : 'light-button'}`}
            >
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
          
          <div className="mt-8 w-full">
            <h2 className={`text-xl font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              File History
            </h2>
            <ul className={`flex flex-col items-center space-y-2 text-blue-900`}>
              {fileHistory.length > 0 ? fileHistory.map((file, index) => (
                <li key={index} className="flex justify-between w-full px-4 py-2 bg-gray-100 rounded-lg shadow-lg">
                  <span>{file.name}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReDownload(file)}
                      className={`text-white bg-blue-500 hover:bg-blue-700 duration-300 font-bold px-2 ml-4 py-2 rounded-lg ${isDarkMode ? 'dark-button' : 'light-button'}`}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className={`text-white bg-red-500 hover:bg-red-700 duration-300 font-bold px-2 py-2 rounded-lg ${isDarkMode ? 'dark-button' : 'light-button'}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )) : (
                <li className="text-center">No files converted yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
