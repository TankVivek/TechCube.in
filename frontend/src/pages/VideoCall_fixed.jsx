import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";
import "../styles/VideoCall.css";

// SVG Icon Components
const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const MicOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const CameraOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M21 21l-4.19-4.19" />
    <path d="M16.91 16.91A6.97 6.97 0 0 1 12 19c-3.87 0-7-3.13-7-7 0-1.93.78-3.68 2.05-4.95" />
    <path d="M12 5V2" />
    <path d="M8 2h8" />
  </svg>
);

const PhoneHangupIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);

const ScreenShareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-7" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
);

const ScreenShareOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-7" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

function getIceServers() {
  try {
    const raw = import.meta.env.VITE_ICE_SERVERS;
    if (raw) return JSON.parse(raw);
  } catch {
    console.warn("Invalid VITE_ICE_SERVERS — using default STUN servers.");
  }
  return [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];
}

function getVideoConstraints(isMobile = false, qualityLevel = 'high') {
  const isHighEnd = !isMobile && navigator.hardwareConcurrency && navigator.hardwareConcurrency > 4;
  
  // Adaptive quality based on network conditions
  const qualitySettings = {
    low: {
      width: { ideal: 480, max: 640 },
      height: { ideal: 360, max: 480 },
      frameRate: { ideal: 15, max: 15 }
    },
    medium: {
      width: { ideal: 640, max: 1280 },
      height: { ideal: 480, max: 720 },
      frameRate: { ideal: 24, max: 30 }
    },
    high: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 30 }
    },
    ultra: {
      width: { ideal: 1920, max: 2560 },
      height: { ideal: 1080, max: 1440 },
      frameRate: { ideal: 30, max: 60 }
    }
  };
  
  let quality = qualitySettings[qualityLevel] || qualitySettings.high;
  
  if (isMobile) {
    quality = qualitySettings.medium;
  }
  
  if (isHighEnd && qualityLevel === 'ultra') {
    quality = qualitySettings.ultra;
  }
  
  return {
    ...quality,
    facingMode: "user"
  };
}

async function checkPermissions() {
  if (!navigator.permissions) {
    return { video: 'prompt', audio: 'prompt' };
  }
  
  try {
    const videoStatus = await navigator.permissions.query({ name: 'camera' });
    const audioStatus = await navigator.permissions.query({ name: 'microphone' });
    return {
      video: videoStatus.state,
      audio: audioStatus.state
    };
  } catch (e) {
    return { video: 'prompt', audio: 'prompt' };
  }
}

async function enumerateDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return { video: [], audio: [] };
  }
  
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      video: devices.filter(d => d.kind === 'videoinput'),
      audio: devices.filter(d => d.kind === 'audioinput')
    };
  } catch (e) {
    console.warn('Could not enumerate devices:', e);
    return { video: [], audio: [] };
  }
}

async function requestMedia() {
  // Check if we're on HTTPS (required for media devices)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    const err = new Error("Camera and microphone access requires HTTPS.");
    err.name = "SecurityError";
    throw err;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    const err = new Error("Media devices not supported in this browser.");
    err.name = "NotSupportedError";
    throw err;
  }

  // Check permissions first - if denied, return null for receive-only mode
  const permissions = await checkPermissions();
  if (permissions.video === 'denied' && permissions.audio === 'denied') {
    console.warn('Both camera and microphone permissions denied - enabling receive-only mode');
    return null;
  }

  // Check if devices are available
  const devices = await enumerateDevices();
  if (devices.video.length === 0 && devices.audio.length === 0) {
    console.warn('No camera or microphone devices found - enabling receive-only mode');
    return null;
  }
  if (devices.video.length === 0) {
    console.warn('No camera devices found, will try audio only');
  }
  if (devices.audio.length === 0) {
    console.warn('No microphone devices found, will try video only');
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const videoConstraints = getVideoConstraints(isMobile);
  
  const audioConstraints = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: { ideal: 48000 }
  };

  const attempts = [
    { video: videoConstraints, audio: audioConstraints },
    { video: { ...videoConstraints, width: { ideal: 640 }, height: { ideal: 480 } }, audio: audioConstraints },
    { video: true, audio: audioConstraints },
    { video: false, audio: audioConstraints },
    { video: videoConstraints, audio: false },
  ];

  let lastError;
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      lastError = err;
    }
  }
  // If all attempts fail, return null for receive-only mode instead of throwing
  console.warn('All media acquisition attempts failed - enabling receive-only mode');
  return null;
}

function mediaErrorMessage(err) {
  if (err?.name === "SecurityError") {
    return "Camera/microphone access requires HTTPS. Please use a secure connection.";
  }
  if (err?.name === "NotAllowedError") {
    return "Camera/microphone permission was denied. Click the camera/mic icon in your browser address bar (top right) and allow access, then tap \"Enable camera & mic\" below.";
  }
  if (err?.name === "NotFoundError") {
    const hasVideo = err?.devices?.video?.length > 0;
    const hasAudio = err?.devices?.audio?.length > 0;
    if (!hasVideo && !hasAudio) {
      return "No camera or microphone found. Check if your devices are connected and not in use by another app.";
    }
    if (!hasVideo) {
      return "No camera found. You can join with audio only, or connect a camera and try again.";
    }
    if (!hasAudio) {
      return "No microphone found. You can join with video only, or connect a microphone and try again.";
    }
    return "No camera or microphone found on this device. Please ensure your devices are connected and working.";
  }
  if (err?.name === "NotReadableError") {
    return "Camera or microphone is in use by another app. Close other apps (Zoom, Teams, etc.) and try again.";
  }
  if (err?.name === "NotSupportedError") {
    return "This browser does not support video calls. Try Chrome, Firefox, or Safari.";
  }
  if (err?.name === "OverconstrainedError") {
    return "Your camera doesn't support the requested settings. Trying with lower quality...";
  }
  return "Couldn't access camera/microphone. Check your browser permissions and device settings, then tap \"Enable camera & mic\" to try again.";
}

export default function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("idle");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [fatalError, setFatalError] = useState("");
  const [mediaWarning, setMediaWarning] = useState("");
  const [joining, setJoining] = useState(true);
  const [enablingMedia, setEnablingMedia] = useState(false);
  const [hasLocalMedia, setHasLocalMedia] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("unknown");
  const [bitrate, setBitrate] = useState(0);
  const [isInBackground, setIsInBackground] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [videoQuality, setVideoQuality] = useState('high');

  const screenStreamRef = useRef(null);
  const originalVideoTrackRef = useRef(null);
  const statsIntervalRef = useRef(null);
  const previousBytesRef = useRef(0);
  const visibilityHandlerRef = useRef(null);
  const pinchRef = useRef({ initialDistance: 0, initialZoom: 1 });

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const startedRef = useRef(false);

  const attachLocalStream = useCallback((stream) => {
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    setHasLocalMedia(true);
    const audioTracks = stream.getAudioTracks();
    const videoTracks = stream.getVideoTracks();
    setMicOn(audioTracks.length > 0 && audioTracks[0].enabled);
    setCamOn(videoTracks.length > 0 && videoTracks[0].enabled);
  }, []);

  const cleanup = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
    if (visibilityHandlerRef.current) {
      document.removeEventListener("visibilitychange", visibilityHandlerRef.current);
      visibilityHandlerRef.current = null;
    }
    peerRef.current?.destroy();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current = null;
    originalVideoTrackRef.current = null;
    socketRef.current?.disconnect();
    socketRef.current = null;
    startedRef.current = false;
    setConnectionQuality("unknown");
    setBitrate(0);
    previousBytesRef.current = 0;
    setIsInBackground(false);
  }, []);

  const createPeer = useCallback((initiator, remoteSocketId, socket, stream) => {
    const opts = {
      initiator,
      trickle: true,
      config: { iceServers: getIceServers() },
      stream: stream || undefined,
    };

    const peer = new Peer(opts);

    peer.on("signal", (data) => {
      console.log('[VideoCall] Sending signal to:', remoteSocketId, 'type:', data.type);
      socket.emit("signal", { to: remoteSocketId, data });
    });

    peer.on("stream", (remoteStream) => {
      console.log('[VideoCall] Received remote stream');
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      setStatus("connected");
      setMediaWarning("");
      
      // Start monitoring connection quality
      startStatsMonitoring(peer);
    });

    peer.on("close", () => setStatus("waiting"));
    peer.on("error", (err) => {
      console.error("Peer error:", err);
      if (err.code === 'ERR_WEBRTC') {
        setMediaWarning("WebRTC connection failed. Please check if your browser supports WebRTC.");
      } else if (err.code === 'ERR_PEER_CONNECTION_FAILED') {
        setMediaWarning("Could not establish peer connection. The other person may have left.");
      } else {
        setMediaWarning("Connection interrupted. Waiting for the other person…");
      }
    });

    peerRef.current = peer;
    return peer;
  }, []);

  const startStatsMonitoring = useCallback((peer) => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
    }

    statsIntervalRef.current = setInterval(async () => {
      try {
        if (peer._pc) {
          const stats = await peer._pc.getStats();
          let currentBytes = 0;
          let packetsLost = 0;
          let packetsReceived = 0;
          let rtt = 0;

          stats.forEach(report => {
            if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
              currentBytes += report.bytesReceived || 0;
              packetsLost += report.packetsLost || 0;
              packetsReceived += report.packetsReceived || 0;
            }
            if (report.type === 'remote-inbound-rtp' && report.mediaType === 'video') {
              rtt = report.roundTripTime || 0;
            }
          });

          // Calculate bitrate
          const bytesDiff = currentBytes - previousBytesRef.current;
          const bitrateKbps = (bytesDiff * 8 / 1000).toFixed(1);
          setBitrate(parseFloat(bitrateKbps));
          previousBytesRef.current = currentBytes;

          // Determine connection quality and adjust video quality
          const lossRate = packetsReceived > 0 ? (packetsLost / packetsReceived) * 100 : 0;
          
          if (lossRate < 1 && rtt < 100) {
            setConnectionQuality("excellent");
            setVideoQuality('ultra');
          } else if (lossRate < 3 && rtt < 200) {
            setConnectionQuality("good");
            setVideoQuality('high');
          } else if (lossRate < 5 && rtt < 300) {
            setConnectionQuality("fair");
            setVideoQuality('medium');
          } else {
            setConnectionQuality("poor");
            setVideoQuality('low');
          }
        }
      } catch (e) {
        console.warn("Could not get stats:", e);
      }
    }, 2000);
  }, []);

  const tryAcquireMedia = useCallback(async () => {
    try {
      const stream = await requestMedia();
      if (stream) {
        attachLocalStream(stream);
        setMediaWarning("");
      } else {
        // Receive-only mode - no local stream
        setMediaWarning("You're in receive-only mode. You can see and hear the other person, but they can't see or hear you. Enable camera & mic to share your video/audio.");
      }

      // If peer exists and doesn't have a stream, we need to recreate it with the new stream
      if (peerRef.current && !peerRef.current.destroyed && !peerRef.current.stream) {
        // Destroy current peer and recreate with stream
        const currentPeer = peerRef.current;
        peerRef.current = null;
        currentPeer.destroy();
        
        // Recreate peer with stream
        const socket = socketRef.current;
        if (socket && socket.connected) {
          // This will trigger a reconnection with the new stream
          socket.emit("request-reconnect");
        }
      }
      return true;
    } catch (err) {
      console.error("Media acquisition error:", err);
      setMediaWarning(mediaErrorMessage(err));
      return false;
    }
  }, [attachLocalStream]);

  const enableMedia = async () => {
    setEnablingMedia(true);
    await tryAcquireMedia();
    setEnablingMedia(false);
  };

  const startCall = useCallback(() => {
    console.log('[VideoCall] Starting call for room:', roomId);
    if (!roomId?.trim() || startedRef.current) {
      console.log('[VideoCall] Call already started or invalid room ID');
      return;
    }

    startedRef.current = true;
    setJoining(true);
    setFatalError("");
    setMediaWarning("");

    console.log('[VideoCall] Connecting to socket server:', SOCKET_URL);
    // Join the signaling room immediately so the other person is not left waiting.
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      console.error('[VideoCall] Socket connection error:', err);
      setFatalError("Could not connect to the call server. Please check your internet connection and try again.");
      setJoining(false);
      cleanup();
    });

    socket.on("connect", () => {
      console.log('[VideoCall] Socket connected, socket ID:', socket.id);
      console.log('[VideoCall] Joining room:', roomId.trim());
      socket.emit("join-room", roomId.trim());
      setStatus("waiting");
      setJoining(false);

      // Request media in parallel — fall back to receive-only if it fails.
      tryAcquireMedia().then((ok) => {
        console.log('[VideoCall] Media acquisition result:', ok);
        if (!ok) {
          setMediaWarning(
            (prev) =>
              prev ||
              "Joined in listen-only mode. Tap \"Enable camera & mic\" so the other person can see and hear you."
          );
        }
      });
    });

    socket.on("room-full", () => {
      console.log('[VideoCall] Room is full');
      setFatalError("This call room is full. Only two participants are allowed per room.");
      cleanup();
      setStatus("ended");
      setJoining(false);
    });

    socket.on("peer-joined", ({ peerId }) => {
      console.log('[VideoCall] Peer joined:', peerId);
      console.log('[VideoCall] Local stream:', localStreamRef.current);
      setStatus("connecting");
      createPeer(true, peerId, socket, localStreamRef.current);
    });

    socket.on("signal", ({ from, data }) => {
      console.log('[VideoCall] Signal received from:', from, 'data type:', data.type);
      if (!peerRef.current) {
        console.log('[VideoCall] Creating peer as receiver');
        setStatus("connecting");
        const peer = createPeer(false, from, socket, localStreamRef.current);
        peer.signal(data);
      } else {
        console.log('[VideoCall] Signaling existing peer');
        peerRef.current.signal(data);
      }
    });

    socket.on("peer-left", () => {
      console.log('[VideoCall] Peer left');
      setStatus("waiting");
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      peerRef.current?.destroy();
      peerRef.current = null;
    });
  }, [roomId, cleanup, createPeer, tryAcquireMedia]);

  useEffect(() => {
    if (roomId?.trim()) startCall();
    return cleanup;
  }, [roomId, startCall, cleanup]);

  // Handle page visibility for mobile/background scenarios
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsInBackground(true);
        // Pause video when in background to save resources
        if (localVideoRef.current) {
          localVideoRef.current.pause();
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.pause();
        }
        // Lower video quality when in background
        if (localStreamRef.current) {
          const videoTracks = localStreamRef.current.getVideoTracks();
          videoTracks.forEach(track => {
            if (track.enabled) {
              const settings = track.getSettings();
              if (settings.width && settings.width > 640) {
                track.applyConstraints({
                  width: { ideal: 640, max: 640 },
                  height: { ideal: 480, max: 480 },
                  frameRate: { ideal: 15, max: 15 }
                }).catch(() => {});
              }
            }
          });
        }
      } else {
        setIsInBackground(false);
        // Resume video when coming back to foreground
        if (localVideoRef.current) {
          localVideoRef.current.play().catch(() => {});
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.play().catch(() => {});
        }
        // Restore video quality when back in foreground
        if (localStreamRef.current && !isInBackground) {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          const videoConstraints = getVideoConstraints(isMobile);
          const videoTracks = localStreamRef.current.getVideoTracks();
          videoTracks.forEach(track => {
            if (track.enabled) {
              track.applyConstraints(videoConstraints).catch(() => {});
            }
          });
        }
      }
    };

    visibilityHandlerRef.current = handleVisibilityChange;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleMic = () => {
    const audioTracks = localStreamRef.current?.getAudioTracks();
    if (audioTracks && audioTracks.length > 0) {
      const track = audioTracks[0];
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
      
      // Notify peer about audio state change
      if (peerRef.current && !peerRef.current.destroyed) {
        try {
          const audioTrack = localStreamRef.current.getAudioTracks()[0];
          if (peerRef.current._pc) {
            const senders = peerRef.current._pc.getSenders();
            const audioSender = senders.find(s => s.track?.kind === 'audio');
            if (audioSender) {
              audioSender.track.enabled = track.enabled;
            }
          }
        } catch (e) {
          console.warn("Could not update audio track state:", e);
        }
      }
    }
  };

  const toggleCam = () => {
    const videoTracks = localStreamRef.current?.getVideoTracks();
    if (videoTracks && videoTracks.length > 0) {
      const track = videoTracks[0];
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
      
      // Notify peer about video state change
      if (peerRef.current && !peerRef.current.destroyed) {
        try {
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          if (peerRef.current._pc) {
            const senders = peerRef.current._pc.getSenders();
            const videoSender = senders.find(s => s.track?.kind === 'video');
            if (videoSender) {
              videoSender.track.enabled = track.enabled;
            }
          }
        } catch (e) {
          console.warn("Could not update video track state:", e);
        }
      }
    }
  };

  const adjustZoom = (delta) => {
    setZoomLevel(prev => {
      const newZoom = Math.max(1, Math.min(3, prev + delta));
      console.log('[VideoCall] Zoom adjusted to:', newZoom);
      return newZoom;
    });
  };

  // Touch gesture handlers for pinch-to-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      pinchRef.current = { initialDistance: distance, initialZoom: zoomLevel };
      console.log('[VideoCall] Pinch started, distance:', distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const { initialDistance, initialZoom } = pinchRef.current;
      const scale = distance / initialDistance;
      const newZoom = Math.max(1, Math.min(3, initialZoom * scale));
      setZoomLevel(newZoom);
      console.log('[VideoCall] Pinch zoom:', newZoom);
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current = { initialDistance: 0, initialZoom: 1 };
    console.log('[VideoCall] Pinch ended');
  };

  const toggleScreenShare = async () => {
    if (screenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      
      // Restore original video track
      if (originalVideoTrackRef.current && peerRef.current && !peerRef.current.destroyed) {
        try {
          const senders = peerRef.current._pc.getSenders();
          const videoSender = senders.find(s => s.track?.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(originalVideoTrackRef.current);
          }
        } catch (e) {
          console.warn("Could not restore video track:", e);
          setMediaWarning("Could not restore camera. Please try toggling your camera.");
        }
      }
      
      setScreenSharing(false);
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" },
          audio: false
        });
        
        screenStreamRef.current = screenStream;
        
        // Store original video track
        const videoTracks = localStreamRef.current?.getVideoTracks();
        if (videoTracks && videoTracks.length > 0) {
          originalVideoTrackRef.current = videoTracks[0];
        }
        
        // Replace video track with screen share track
        if (peerRef.current && !peerRef.current.destroyed) {
          try {
            const senders = peerRef.current._pc.getSenders();
            const videoSender = senders.find(s => s.track?.kind === 'video');
            const screenTrack = screenStream.getVideoTracks()[0];
            if (videoSender && screenTrack) {
              videoSender.replaceTrack(screenTrack);
            }
          } catch (e) {
            console.warn("Could not replace video track with screen share:", e);
            setMediaWarning("Screen sharing started but may not be visible to the other person.");
          }
        }
        
        // Handle user stopping screen share via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
        
        setScreenSharing(true);
      } catch (err) {
        console.error("Screen share error:", err);
        if (err.name === 'NotAllowedError') {
          setMediaWarning("Screen sharing was denied. Please allow screen sharing permissions.");
        } else {
          setMediaWarning("Could not start screen sharing. Please try again.");
        }
      }
    }
  };

  const endCall = () => {
    socketRef.current?.emit("call-ended");
    cleanup();
    setStatus("ended");
  };

  const retryJoin = () => {
    cleanup();
    setStatus("idle");
    setFatalError("");
    setMediaWarning("");
    setJoining(true);
    startCall();
  };

  const statusLabel = {
    idle: "",
    waiting: "Waiting for the other person to join…",
    connecting: "Connecting…",
    connected: "Connected",
    ended: "Call ended",
  }[status];

  const hasLocalVideo = hasLocalMedia && !!localStreamRef.current?.getVideoTracks().length;

  if (!roomId?.trim()) {
    return (
      <div className="vc-lobby">
        <div className="vc-lobby-card">
          <h2>Invalid call link</h2>
          <p className="vc-subtext">This video call link is missing a room ID.</p>
          <button className="vc-btn vc-btn-primary" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (fatalError) {
    return (
      <div className="vc-lobby">
        <div className="vc-lobby-card">
          <h2>Unable to join</h2>
          <p className="vc-error">{fatalError}</p>
          <button className="vc-btn vc-btn-primary" onClick={retryJoin} style={{ marginBottom: 8 }}>
            Try Again
          </button>
          <button className="vc-btn" onClick={() => navigate("/")} style={{ background: "#2a2e37", color: "#f2f3f5" }}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (joining) {
    return (
      <div className="vc-lobby">
        <div className="vc-lobby-card">
          <div className="vc-spinner" style={{ margin: "0 auto 16px" }} />
          <h2>Joining call…</h2>
          <p className="vc-subtext">Connecting to the call room</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vc-room">
      <div className={`vc-status vc-status-${status}`}>{statusLabel}</div>
      {status === "connected" && (
        <div className="vc-connection-indicator">
          <span className={`vc-quality-dot vc-quality-${connectionQuality}`} />
          <span className="vc-quality-text">
            {connectionQuality === "excellent" && "Excellent"}
            {connectionQuality === "good" && "Good"}
            {connectionQuality === "fair" && "Fair"}
            {connectionQuality === "poor" && "Poor"}
            {connectionQuality === "unknown" && "Checking..."}
          </span>
          <span className="vc-bitrate">{bitrate > 0 ? `${bitrate} kbps` : ""}</span>
        </div>
      )}

      {mediaWarning && (
        <div className="vc-media-banner">
          <p>{mediaWarning}</p>
          {!hasLocalMedia && (
            <button className="vc-btn vc-btn-primary vc-enable-btn" onClick={enableMedia} disabled={enablingMedia}>
              {enablingMedia ? "Enabling…" : "Enable camera & mic"}
            </button>
          )}
        </div>
      )}

      <div className="vc-stage">
        <video ref={remoteVideoRef} className="vc-remote-video" autoPlay playsInline />
        {status !== "connected" && (
          <div className="vc-placeholder">
            <div className="vc-spinner" />
            <p className="vc-placeholder-text">
              {status === "waiting" ? "Waiting for the other person…" : "Connecting…"}
            </p>
          </div>
        )}
        {hasLocalVideo ? (
          <video 
            ref={localVideoRef} 
            className="vc-local-video" 
            autoPlay 
            playsInline 
            muted 
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        ) : (
          <div className="vc-local-placeholder">
            <span>No camera</span>
          </div>
        )}
      </div>

      <div className="vc-controls">
        <button
          className={`vc-icon-btn ${micOn && hasLocalMedia && localStreamRef.current?.getAudioTracks().length > 0 ? "" : "vc-icon-btn-off"}`}
          onClick={toggleMic}
          disabled={!hasLocalMedia || !localStreamRef.current?.getAudioTracks()?.length}
          title={micOn ? "Mute mic" : "Unmute mic"}
          aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
        >
          {micOn ? <MicIcon /> : <MicOffIcon />}
        </button>
        <button
          className={`vc-icon-btn ${camOn && hasLocalVideo ? "" : "vc-icon-btn-off"}`}
          onClick={toggleCam}
          disabled={!hasLocalVideo}
          title={camOn ? "Turn off camera" : "Turn on camera"}
          aria-label={camOn ? "Turn off camera" : "Turn on camera"}
        >
          {camOn ? <CameraIcon /> : <CameraOffIcon />}
        </button>
        <button
          className={`vc-icon-btn ${screenSharing ? "vc-icon-btn-active" : ""}`}
          onClick={toggleScreenShare}
          disabled={!hasLocalMedia}
          title={screenSharing ? "Stop screen sharing" : "Share screen"}
          aria-label={screenSharing ? "Stop screen sharing" : "Share screen"}
        >
          {screenSharing ? <ScreenShareOffIcon /> : <ScreenShareIcon />}
        </button>
        <button className="vc-icon-btn vc-icon-btn-end" onClick={endCall} title="End call" aria-label="End call">
          <PhoneHangupIcon />
        </button>
      </div>

      {status === "ended" && (
        <div className="vc-ended-overlay">
          <p>Call ended</p>
          <button className="vc-btn vc-btn-primary" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      )}
    </div>
  );
}
