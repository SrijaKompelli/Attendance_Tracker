import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/AttentivityResults.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const AttentivityResults = ({ results }) => {
  const { inattentiveStudents, attentiveCount, inattentiveCount } = results;

  const handleExportCSV = () => {
    const csvContent = [
      'Name,Attentiveness Score',
      ...inattentiveStudents.map((student) => `${student.name},${student.score}`),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'attentivity_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pieData = {
    labels: ['Attentive', 'Inattentive'],
    datasets: [
      {
        data: [attentiveCount, inattentiveCount],
        backgroundColor: ['#10b981', '#ef4444'],
        borderColor: ['#059669', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="attentivity-results animate-attentivity">
      <h3 className="results-title">Attentivity Analysis Results</h3>
      <div className="row">
        <div className="col-md-6 snapshots-section">
          <h4>Snapshots of Inattentive Students</h4>
          {inattentiveStudents.length === 0 ? (
            <p>No inattentive students detected.</p>
          ) : (
            <div className="snapshots-grid">
              {inattentiveStudents.map((student, index) => (
                student.snapshotPath && (
                  <div key={index} className="snapshot-card">
                    <img src={`http://localhost:5000${student.snapshotPath}`} alt={`Snapshot ${student.name}`} className="snapshot-img" />
                    <p>{student.name}</p>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
        <div className="col-md-6 scores-section">
          <h4>Attentiveness Scores</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {inattentiveStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{(student.score * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pie-chart-section">
        <h4>Attentivity Distribution</h4>
        <div className="pie-chart-container">
          <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="export-section">
        <button className="export-button" onClick={handleExportCSV}>
          Export as CSV
        </button>
      </div>
    </div>
  );
};

export default AttentivityResults;