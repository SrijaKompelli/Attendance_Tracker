from flask import Flask, request, jsonify
import os
import logging
from utils.video_processor import process_video
from utils.logging import setup_logging

app = Flask(__name__)

setup_logging()
logger = logging.getLogger(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_video():
    try:
        data = request.get_json()
        video_path = data.get('videoPath')
        if not video_path or not os.path.exists(video_path):
            logger.error(f"Video not found: {video_path}")
            return jsonify({"error": "Video file not found"}), 400

        logger.info(f"Starting analysis for video: {video_path}")
        results = process_video(video_path)
        logger.info("Analysis complete")
        return jsonify(results)
    except Exception as e:
        logger.exception("Unhandled exception during video analysis")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    os.makedirs('static', exist_ok=True)  # Kept for compatibility
    app.run(host='0.0.0.0', port=5001)