import time
import math
from typing import List, Tuple, Dict, Any
from collections import OrderedDict

class CentroidTracker:
    """
    Real-time Euclidean centroid tracker for YOLOv8 computer vision stream.
    Assigns persistent IDs and calculates entity dwell time across consecutive frames.
    """

    def __init__(self, max_disappeared: int = 30, max_distance: float = 80.0):
        self.next_object_id = 1
        self.objects = OrderedDict()          # object_id -> (cX, cY)
        self.disappeared = OrderedDict()      # object_id -> frame_count
        self.first_seen = OrderedDict()        # object_id -> start_timestamp
        self.max_disappeared = max_disappeared
        self.max_distance = max_distance

    def register(self, centroid: Tuple[int, int]) -> int:
        """Registers a newly detected entity with a persistent ID."""
        obj_id = self.next_object_id
        self.objects[obj_id] = centroid
        self.disappeared[obj_id] = 0
        self.first_seen[obj_id] = time.time()
        self.next_object_id += 1
        return obj_id

    def deregister(self, object_id: int):
        """Removes an entity after it has left the camera field of view."""
        self.objects.pop(object_id, None)
        self.disappeared.pop(object_id, None)
        self.first_seen.pop(object_id, None)

    def update(self, rects: List[Tuple[int, int, int, int]]) -> List[Dict[str, Any]]:
        """
        Updates tracked objects given bounding boxes (x1, y1, x2, y2).
        Returns tracked entities with ID, coordinates, centroid, and dwell time.
        """
        now = time.time()

        # If no bounding boxes in current frame
        if len(rects) == 0:
            for obj_id in list(self.disappeared.keys()):
                self.disappeared[obj_id] += 1
                if self.disappeared[obj_id] > self.max_disappeared:
                    self.deregister(obj_id)
            return []

        # Calculate centroids for input rects
        input_centroids = []
        for (x1, y1, x2, y2) in rects:
            cX = int((x1 + x2) / 2.0)
            cY = int((y1 + y2) / 2.0)
            input_centroids.append((cX, cY))

        # If we currently have no tracked objects, register all
        if len(self.objects) == 0:
            for i, centroid in enumerate(input_centroids):
                self.register(centroid)
        else:
            object_ids = list(self.objects.keys())
            object_centroids = list(self.objects.values())

            # Compute pairwise Euclidean distance matrix
            # shape: len(object_ids) x len(input_centroids)
            distances = []
            for obj_c in object_centroids:
                row = []
                for inp_c in input_centroids:
                    dist = math.hypot(obj_c[0] - inp_c[0], obj_c[1] - inp_c[1])
                    row.append(dist)
                distances.append(row)

            # Match objects greedily by smallest distance
            used_rows = set()
            used_cols = set()

            # Flatten and sort by distance
            matches = []
            for r_idx, row in enumerate(distances):
                for c_idx, d in enumerate(row):
                    matches.append((d, r_idx, c_idx))
            matches.sort(key=lambda x: x[0])

            for d, r_idx, c_idx in matches:
                if r_idx in used_rows or c_idx in used_cols:
                    continue
                if d > self.max_distance:
                    continue

                obj_id = object_ids[r_idx]
                self.objects[obj_id] = input_centroids[c_idx]
                self.disappeared[obj_id] = 0
                used_rows.add(r_idx)
                used_cols.add(c_idx)

            # Check rows not used (lost tracks)
            for r_idx in range(len(object_ids)):
                if r_idx not in used_rows:
                    obj_id = object_ids[r_idx]
                    self.disappeared[obj_id] += 1
                    if self.disappeared[obj_id] > self.max_disappeared:
                        self.deregister(obj_id)

            # Check cols not used (new tracks)
            for c_idx in range(len(input_centroids)):
                if c_idx not in used_cols:
                    self.register(input_centroids[c_idx])

        # Build output results for current active frame rects
        results = []
        for (x1, y1, x2, y2) in rects:
            cX = int((x1 + x2) / 2.0)
            cY = int((y1 + y2) / 2.0)

            # Find closest matching registered object
            best_id = None
            min_dist = float("inf")
            for obj_id, obj_c in self.objects.items():
                d = math.hypot(cX - obj_c[0], cY - obj_c[1])
                if d < min_dist and d <= self.max_distance:
                    min_dist = d
                    best_id = obj_id

            dwell = now - self.first_seen.get(best_id, now) if best_id else 0.0

            results.append({
                "id": best_id or 1,
                "bbox": (x1, y1, x2, y2),
                "centroid": (cX, cY),
                "dwell_time": dwell,
            })

        return results
