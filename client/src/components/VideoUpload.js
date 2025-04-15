import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AttentivenessContext } from '../context/AttentivenessContext';
import '../styles/VideoUpload.css';

const VideoUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);
    const { setResults } = useContext(AttentivenessContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setError(null);
        } else if (selectedFile) {
            setError('Please select a valid video file.');
            setFile(null);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith('video/')) {
                setFile(droppedFile);
                setError(null);
            } else {
                setError('Please drop a valid video file.');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('video', file);
        
        try {
            const response = await axios.post('http://localhost:5000/api/upload-video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResults(response.data);
            setUploading(false);
            navigate('/faculty/attentiveness-results');
        } catch (error) {
            console.error('Upload error:', error);
            setError('Failed to upload video. Please try again.');
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="upload-container">
            <h2 className="upload-title">Upload Video for Attentiveness Analysis</h2>
            
            {error && <p className="upload-error">{error}</p>}
            
            <div className="upload-form">
                <div 
                    className={`drop-area ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                >
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="video/*" 
                        onChange={handleFileChange} 
                        disabled={uploading}
                        className="file-input"
                    />
                    
                    <div className="drop-content">
                        <div className="upload-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        
                        {file ? (
                            <div className="file-info">
                                <p className="file-name">{file.name}</p>
                                <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <p className="drop-text">
                                {dragActive ? 'Drop your video here' : 'Drag & drop video or click to browse'}
                            </p>
                        )}
                    </div>
                </div>
                
                <button 
                    className={`upload-button ${uploading ? 'uploading' : ''}`}
                    onClick={handleUpload} 
                    disabled={uploading || !file}
                >
                    {uploading ? (
                        <>
                            <span className="spinner"></span>
                            <span>Processing...</span>
                        </>
                    ) : 'Analyze Video'}
                </button>
                
                {uploading && (
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress-indicator"></div>
                        </div>
                        <p className="progress-text">Analyzing student attentiveness...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoUpload;