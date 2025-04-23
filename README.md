# Smart Attendance Tracker

A MERN stack application for attendance management with a Student Attentivity feature using YOLOv8 and Flask.

## Prerequisites

- Node.js v22.11.0
- Python 3.10+
- MongoDB
- Git

## Setup

1. **Clone the Repository**:
   ```bash
   git clone <repo-url>
   cd smart-attendance-tracker


# .........................................................................
 # 🖥️ How to Run the Attendance Tracker Application 

# ✅ 1. Start the Backend Server
Open PowerShell and navigate to the backend directory:

cd C:\Users\vamsh\Source\ps-2\Attendance_tracker\server

npm start

Expected Output:

Server running on port 5000
MongoDB connected

 # 🌐 2. Start the Frontend Client
In a new PowerShell window, navigate to the client directory:

cd C:\Users\vamsh\Source\ps-2\Attendance_tracker\client

npm start

Expected Output:

Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.3.36:3000

Note: The development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully

 # 🧠 3. Run the Python Model (Flask API)
Open another PowerShell window and navigate to the Flask backend directory:

cd C:\Users\vamsh\Source\ps-2\Attendance_tracker\flask-backend
<!-- 
.\venv\Scripts\Activate.ps1 -->
# Optional: pip install -r requirements.txt
$env:FLASK_APP = "app.py"
flask run --host=0.0.0.0 --port=5001

Expected Output:

* Serving Flask app 'app.py'
 * Debug mode: off
2025-04-13 17:29:19,572 - werkzeug - INFO - WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5001
 * Running on http://192.168.3.36:5001
2025-04-13 17:29:19,573 - werkzeug - INFO - Press CTRL+C to quit
# This is a test edit to confirm sync