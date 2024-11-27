export interface GetHostStorage {
  [cameraName: string]: CameraStorage
}

export interface CameraStorage {
  bandwidth?: number // MiB/hr
  usage?: number // MB
  usage_percent?: number // Usage / 1024 / Total storage size * 100
}

export interface GetVaInfo {
  return_code: number
  stderr: string
  stdout: string
}

export interface GetFfprobe {
  return_code: number
  stderr: string
  stdout: Stdout
}

export interface Stdout {
  programs: any[]
  streams: Stream[]
}

export interface Stream {
  avg_frame_rate: string // FPS
  codec_long_name: string // Codec
  height: number
  width: number
}

export interface FrigateStats {
  cameras: {
    [cameraName: string]: CameraStat
  } | undefined
  cpu_usages: {
    [processId: string]: ProcessStat
  } | undefined
  detection_fps: number
  detectors: {
    [detectorName: string]: DetectorStat
  } | undefined
  gpu_usages: {
    [gpuName: string]: GpuStat
  } | undefined
  processes: Processes
  service: Service
}

export interface CameraStat {
  audio_dBFS: number
  audio_rms: number
  camera_fps: number // Ffmpeg
  capture_pid: number // Capture PID
  detection_enabled: number // Detect
  detection_fps: number // Detect
  ffmpeg_pid: number // Ffmpeg PID
  pid: number // Detect PID
  process_fps: number // Capture
  skipped_fps: number // Detect
}

export interface ProcessStat {
  cmdline: string
  cpu: string
  cpu_average: string
  mem: string
}

export interface DetectorStat {
  detection_start: number
  inference_speed: number
  pid: number
}

export interface GpuStat {
  dec: string
  enc: string
  gpu: string
  mem: string
}

export interface Processes {
  go2rtc: Go2rtc
  logger: Logger
  recording: Recording
}

export interface Go2rtc {
  pid: number
}

export interface Logger {
  pid: number
}

export interface Recording {
  pid: number
}

export interface Service {
  last_updated: number
  latest_version: string
  storage: {
    [storagePath: string]: StorageStat
  }
  temperatures: Temperatures
  uptime: number
  version: string
}

export interface StorageStat {
  free: number
  mount_type: string
  total: number
  used: number
}

export interface Temperatures { }
