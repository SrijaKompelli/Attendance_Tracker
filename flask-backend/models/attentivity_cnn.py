import cv2
import numpy as np
import mediapipe as mp
from scipy.spatial import distance as dist

class AttentivityCNN:
    def __init__(self):
        self.mp_pose = mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        self.mp_face_mesh = mp.solutions.face_mesh.FaceMesh(max_num_faces=1, min_detection_confidence=0.5)

    def eye_aspect_ratio(self, eye):
        A = dist.euclidean(eye[1], eye[5])
        B = dist.euclidean(eye[2], eye[4])
        C = dist.euclidean(eye[0], eye[3])
        ear = (A + B) / (2.0 * C)
        return ear

    def analyze_frame(self, frame, bbox):
        x, y, w, h = bbox
        face_img = frame[max(0, y):y+h, max(0, x):x+w]
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        head_score = 0.8
        eye_score = 0.8
        posture_score = 0.8

        face_results = self.mp_face_mesh.process(rgb_frame)
        if face_results.multi_face_landmarks:
            for face_landmarks in face_results.multi_face_landmarks:
                left_eye = [(face_landmarks.landmark[i].x * w + x, face_landmarks.landmark[i].y * h + y) for i in [33, 160, 158, 133, 153, 144]]
                right_eye = [(face_landmarks.landmark[i].x * w + x, face_landmarks.landmark[i].y * h + y) for i in [362, 385, 387, 263, 373, 380]]
                left_ear = self.eye_aspect_ratio(left_eye)
                right_ear = self.eye_aspect_ratio(right_eye)
                ear = (left_ear + right_ear) / 2.0
                eye_score = min(1.0, ear / 0.3)

                nose = face_landmarks.landmark[1]
                head_score = 1.0 if abs(nose.x - 0.5) < 0.2 else 0.4

        pose_results = self.mp_pose.process(rgb_frame)
        if pose_results.pose_landmarks:
            shoulder_diff = abs(pose_results.pose_landmarks.landmark[11].y - pose_results.pose_landmarks.landmark[12].y)
            posture_score = 1.0 if shoulder_diff < 0.05 else 0.5

        score = 0.4 * head_score + 0.3 * eye_score + 0.3 * posture_score
        return score

    def close(self):
        self.mp_pose.close()
        self.mp_face_mesh.close()