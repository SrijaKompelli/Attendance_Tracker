import React, { useContext, useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { AttentivenessContext } from '../context/AttentivenessContext';
import '../styles/AttentivenessDashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const AttentivenessDashboard = () => {
    const { results } = useContext(AttentivenessContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay (replace with actual data fetch if needed)
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!results) {
        return <div>No attentiveness results to display.</div>;
    }

    const { students, active_count, inactive_count, total_students } = results;
    const activeStudents = students.filter(s => s.classification === 'active');
    const inactiveStudents = students.filter(s => s.classification === 'inactive');

    const pieData = {
        labels: ['Active', 'Inactive'],
        datasets: [{
            data: [active_count, inactive_count],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#6ab0f3', '#ff8c9d'],
            borderWidth: 1,
            borderColor: '#fff',
            hoverOffset: 8
        }]
    };

    const pieOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14
                    },
                    padding: 20
                }
            }
        }
    };

    return (
        <div className="dashboard-container">
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading results...</p>
                </div>
            ) : (
                <>
                    <h2 className="dashboard-title">Student Attentiveness Results</h2>
                    <div className="dashboard-stats">
                        <p><strong>Total Students:</strong> {total_students}</p>
                        <p>
                            <strong>Summary:</strong> {active_count} of {total_students} students were active (
                            {total_students > 0 ? ((active_count / total_students) * 100).toFixed(0) : 0}%)
                        </p>
                    </div>
                    <div className="pie-chart-container">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                    <div className="section attentive-section">
                        <h3 className="section-title attentive-title">Active Students ({active_count})</h3>
                        <div className="student-grid">
                            {activeStudents.map(student => (
                                <div key={student.track_id} className="student-card">
                                    <img
                                        className="student-image"
                                        src={student.snapshot ? `http://localhost:5000/snapshots/${student.snapshot}` : '/placeholder.jpg'}
                                        alt={`Student ${student.track_id}`}
                                        onError={(e) => {
                                            console.warn(`Failed to load image for student ${student.track_id}: ${student.snapshot}`);
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                    <p className="student-info">ID: {student.track_id}</p>
                                    <div className={`score-indicator ${student.average_score < 0.6 ? 'low-score' : ''}`}>
                                        Score: {student.average_score.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="section inattentive-section">
                        <h3 className="section-title inattentive-title">Inactive Students ({inactive_count})</h3>
                        <div className="student-grid">
                            {inactiveStudents.map(student => (
                                <div key={student.track_id} className="student-card">
                                    <img
                                        className="student-image"
                                        src={student.snapshot ? `http://localhost:5000/snapshots/${student.snapshot}` : '/placeholder.jpg'}
                                        alt={`Student ${student.track_id}`}
                                        onError={(e) => {
                                            console.warn(`Failed to load image for student ${student.track_id}: ${student.snapshot}`);
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                    <p className="student-info">ID: {student.track_id}</p>
                                    <div className={`score-indicator ${student.average_score < 0.4 ? 'low-score' : ''}`}>
                                        Score: {student.average_score.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttentivenessDashboard;