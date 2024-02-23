export type Recording = {
  id: string;
  camera: string;
  start_time: number;
  end_time: number;
  path: string;
  segment_size: number;
  duration: number;
  motion: number;
  objects: number;
  dBFS: number;
};

export type RecordingSegment = {
  id: string;
  start_time: number;
  end_time: number;
  motion: number;
  objects: number;
  segment_size: number;
  duration: number;
};

export type RecordingActivity = {
  [hour: number]: RecordingSegmentActivity[];
};

export type RecordingSegmentActivity = {
  date: number;
  count: number;
  hasObjects: boolean;
};

export interface RecordSummary {
  day: string
  events: number
  hours: RecordHour[]
}

export interface RecordHour {
  duration: number
  events: number
  hour: string
  motion: number
  objects: number
}