import cv2
import numpy as np
from ultralytics import YOLO
import mediapipe as mp
import os
import time
import logging
from scipy.spatial import distance as dist

logger = logging.getLogger(__name__)

# 3D model points for head pose estimation
model_points = np.array([
    [0.0, 0.0, 0.0],        # Nose tip
    [0.0, -330.0, -65.0],   # Chin
    [-225.0, 170.0, -135.0], # Left eye left corner
    [225.0, 170.0, -135.0],  # Right eye right corner
    [-150.0, -150.0, -125.0],# Left mouth corner
    [150.0, -150.0, -125.0]  # Right mouth corner
], dtype='double')

# Corresponding MediaPipe Face Mesh landmark indices
landmark_indices = [1, 152, 33, 263, 61, 291]

# Eye landmark indices for EAR
left_eye_indices = [33, 160, 158, 133, 153, 144]
right_eye_indices = [362, 385, 387, 263, 373, 380]

def rotationMatrixToEulerAngles(R):
    """Convert rotation matrix to Euler angles (roll, pitch, yaw) in radians."""
    sy = np.sqrt(R[0,0] * R[0,0] + R[1,0] * R[1,0])
    singular = sy < 1e-6
    if not singular:
        x = np.arctan2(R[2,1], R[2,2])  # roll
        y = np.arctan2(-R[2,0], sy)     # pitch
        z = np.arctan2(R[1,0], R[0,0])  # yaw
    else:
        x = np.arctan2(-R[1,2], R[1,1])
        y = np.arctan2(-R[2,0], sy)
        z = 0
    return x, y, z  # roll, pitch, yaw

def eye_aspect_ratio(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

def process_video(video_path):
    """Process video to detect, track, and analyze student attentiveness efficiently."""
    os.makedirs('../snapshots', exist_ok=True)
    model = YOLO('yolov8n.pt')  # Lightweight model
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, min_detection_confidence=0.5)
    mp_pose = mp.solutions.pose.Pose(static_image_mode=False, min_detection_confidence=0.5)

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    target_fps = 10  # Aim for 10 FPS for better accuracy
    frame_skip = max(1, int(fps / target_fps))

    tracks = {}  # {track_id: {'scores': [], 'snapshots': [(score, path, frame_idx)]}}
    frame_count = 0
    start_time = time.time()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_skip == 0:
            logger.debug(f"Processing frame {frame_count}")
            # Resize frame for faster processing
            frame = cv2.resize(frame, (640, 480))
            results = model.track(frame, persist=True, classes=[0], conf=0.3, iou=0.7)  # Fine-tuned parameters
            for box in results[0].boxes:
                if box.id is not None:
                    track_id = int(box.id)
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    w, h = x2 - x1, y2 - y1
                    crop = frame[max(0, y1):y2, max(0, x1):x2]
                    rgb_crop = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)

                    face_results = face_mesh.process(rgb_crop)
                    pose_results = mp_pose.process(rgb_crop)

                    head_score = 0
                    eye_score = 0
                    posture_score = 0

                    if face_results.multi_face_landmarks:
                        landmarks = face_results.multi_face_landmarks[0]
                        image_points = np.array([
                            [landmarks.landmark[i].x * w, landmarks.landmark[i].y * h]
                            for i in landmark_indices
                        ], dtype='double')
                        camera_matrix = np.array([[w, 0, w/2], [0, w, h/2], [0, 0, 1]], dtype='double')
                        dist_coeffs = np.zeros((4,1))
                        success, rvec, tvec = cv2.solvePnP(model_points, image_points, camera_matrix, dist_coeffs)
                        if success:
                            rotation_matrix, _ = cv2.Rodrigues(rvec)
                            pitch, yaw, _ = rotationMatrixToEulerAngles(rotation_matrix)
                            yaw_deg = np.degrees(yaw)
                            pitch_deg = np.degrees(pitch)
                            yaw_score = 1 - min(1, max(0, (abs(yaw_deg) - 15) / 15))
                            pitch_score = 1 - min(1, max(0, (abs(pitch_deg) - 10) / 10))
                            head_score = min(yaw_score, pitch_score)

                        left_eye = [(landmarks.landmark[i].x * w, landmarks.landmark[i].y * h) for i in left_eye_indices]
                        right_eye = [(landmarks.landmark[i].x * w, landmarks.landmark[i].y * h) for i in right_eye_indices]
                        left_ear = eye_aspect_ratio(left_eye)
                        right_ear = eye_aspect_ratio(right_eye)
                        eye_score = min(1, (left_ear + right_ear) / 2 / 0.3)

                    if pose_results.pose_landmarks:
                        left_shoulder = pose_results.pose_landmarks.landmark[11].y
                        right_shoulder = pose_results.pose_landmarks.landmark[12].y
                        shoulder_diff = abs(left_shoulder - right_shoulder)
                        posture_score = 1 if shoulder_diff < 0.05 else 0.5

                    score = 0.4 * head_score + 0.3 * eye_score + 0.3 * posture_score

                    if track_id not in tracks:
                        tracks[track_id] = {'scores': [], 'snapshots': []}
                    snapshot_filename = f"snapshot_{track_id}_{frame_count}.jpg"
                    snapshot_path = os.path.join('../snapshots', snapshot_filename)
                    if face_results.multi_face_landmarks or not tracks[track_id]['snapshots']:
                        if cv2.imwrite(snapshot_path, crop):
                            logger.info(f"Saved snapshot: {snapshot_path}")
                            tracks[track_id]['snapshots'].append((score, snapshot_filename, frame_count))
                        else:
                            logger.error(f"Failed to save snapshot: {snapshot_path}")
                    tracks[track_id]['scores'].append(score)

        frame_count += 1

    cap.release()
    face_mesh.close()
    mp_pose.close()

    students = []
    for track_id, data in tracks.items():
        if len(data['scores']) >= 10:  # Filter short tracks
            avg_score = np.mean(data['scores'])
            snapshot = None
            if data['snapshots']:
                # Select snapshot closest to average score
                snapshot = min(data['snapshots'], key=lambda x: abs(x[0] - avg_score))[1]
                # Clean up other snapshots
                for _, path, _ in data['snapshots']:
                    if path != snapshot:
                        try:
                            os.remove(os.path.join('../snapshots', path))
                            logger.info(f"Deleted snapshot: {path}")
                        except OSError as e:
                            logger.error(f"Failed to delete snapshot {path}: {e}")
            students.append({
                'track_id': track_id,
                'average_score': float(avg_score),
                'classification': 'active' if avg_score >= 0.5 else 'inactive',
                'snapshot': snapshot
            })

    active_count = sum(1 for s in students if s['classification'] == 'active')
    inactive_count = len(students) - active_count

    elapsed_time = time.time() - start_time
    logger.info(f"Processed {frame_count} frames in {elapsed_time:.2f}s, FPS: {frame_count/elapsed_time:.2f}")

    return {
        'students': students,
        'active_count': active_count,
        'inactive_count': inactive_count,
        'total_students': len(students)
    }
