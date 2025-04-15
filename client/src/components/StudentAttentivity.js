import React, { useState } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { showToast } from './Toast';
import AttentivityResults from './AttentivityResults';
import '../styles/StudentAttentivity.css';

const StudentAttentivity = () => {
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    section: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      showToast('Video selected successfully', 'success');
    } else {
      showToast('Please select a valid video file', 'error');
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !filters.department || !filters.year || !filters.section) {
      showToast('Please select a video and all filters', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('department', filters.department);
    formData.append('year', filters.year);
    formData.append('section', filters.section);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/api/faculty/upload-attentivity-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setVideoUrl(res.data.videoUrl);
      showToast(res.data.message, 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!videoUrl) {
      showToast('No video to analyze', 'error');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await axios.post(
        'http://localhost:5000/api/faculty/analyze-attentivity',
        { videoUrl, department: filters.department, year: filters.year, section: filters.section },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAnalysisResults(res.data);
      showToast('Analysis complete', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoUrl('');
    setAnalysisResults(null);
    showToast('Video removed', 'success');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="attentivity-section animate-attentivity">
            <h2 className="attentivity-title">Student Attentivity</h2>
            <div className="attentivity-filters animate-filters">
              <select name="department" value={filters.department} onChange={handleFilterChange}>
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="CSM">CSM</option>
                <option value="CSD">CSD</option>
                <option value="IT">IT</option>
              </select>
              <select name="year" value={filters.year} onChange={handleFilterChange}>
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              <select name="section" value={filters.section} onChange={handleFilterChange}>
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="video-upload animate-attentivity">
              {!videoUrl ? (
                <label className="upload-area">
                  <input type="file" accept="video/*" onChange={handleFileChange} hidden />
                  <span>Click to Upload Video</span>
                </label>
              ) : (
                <div className="video-preview">
                  <video controls src={videoUrl} className="video-player" />
                  <div className="video-controls">
                    <button onClick={handleRemoveVideo} className="remove-button">
                      Remove Video
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="action-buttons animate-attentivity">
              <button onClick={handleUpload} disabled={uploading || !videoFile} className="upload-button">
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
              <button onClick={handleAnalyze} disabled={analyzing || !videoUrl} className="analyze-button">
                {analyzing ? 'Analyzing...' : 'Analyze Attentivity'}
              </button>
            </div>
            {analysisResults && <AttentivityResults results={analysisResults} />}
          </div>
        }
      />
    </Routes>
  );
};

export default StudentAttentivity;