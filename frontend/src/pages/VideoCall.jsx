import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";
import "../styles/VideoCall.css";

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

async function requestMedia() {
  if (!navigator.mediaDevices?.getUserMedia) {
    const err = new Error("Media devices not supported in this browser.");
    err.name = "NotSupportedError";
    throw err;
  }

  const attempts = [
    { video: { facingMode: "user" }, audio: { echoCancellation: true, noiseSuppression: true } },
    { video: true, audio: true },
    { video: false, audio: true },
  ];

  let lastError;
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

function mediaErrorMessage(err) {
  if (err?.name === "NotAllowedError") {
    return "Camera/microphone access was denied. Tap “Enable camera & mic” and allow permissions in your browser.";
  }
  if (err?.name === "NotFoundError") {
    return "No camera or microphone found on this device.";
  }
  if (err?.name === "NotReadableError") {
    return "Camera or microphone is in use by another app. Close it and try again.";
  }
  if (err?.name === "NotSupportedError") {
    return "This browser does not support video calls. Try Chrome or Safari.";
  }
  return "Couldn't access camera/microphone. Tap “Enable camera & mic” to try again.";
}

export default function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("idle");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [fatalError, setFatalError] = useState("");
  const [mediaWarning, setMediaWarning] = useState("");
  const [joining, setJoining] = useState(true);
  const [enablingMedia, setEnablingMedia] = useState(false);
  const [hasLocalMedia, setHasLocalMedia] = useState(false);

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
    setMicOn(stream.getAudioTracks().some((t) => t.enabled));
    setCamOn(stream.getVideoTracks().some((t) => t.enabled));
  }, []);

  const cleanup = useCallback(() => {
    peerRef.current?.destroy();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    socketRef.current?.disconnect();
    socketRef.current = null;
    startedRef.current = false;
  }, []);

  const createPeer = useCallback((initiator, remoteSocketId, socket, stream) => {
    const opts = {
      initiator,
      trickle: true,
      config: { iceServers: getIceServers() },
    };
    if (stream) opts.stream = stream;

    const peer = new Peer(opts);

    peer.on("signal", (data) => {
      socket.emit("signal", { to: remoteSocketId, data });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      setStatus("connected");
      setMediaWarning("");
    });

    peer.on("close", () => setStatus("waiting"));
    peer.on("error", (err) => {
      console.error("Peer error:", err);
      setMediaWarning("Connection interrupted. Waiting for the other person…");
    });

    peerRef.current = peer;
    return peer;
  }, []);

  const tryAcquireMedia = useCallback(async () => {
    try {
      const stream = await requestMedia();
      attachLocalStream(stream);
      setMediaWarning("");

      if (peerRef.current && !peerRef.current.destroyed) {
        try {
          peerRef.current.addStream(stream);
        } catch {
          // Peer may already have a stream attached
        }
      }
      return true;
    } catch (err) {
      console.error(err);
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
    if (!roomId?.trim() || startedRef.current) return;

    startedRef.current = true;
    setJoining(true);
    setFatalError("");
    setMediaWarning("");

    // Join the signaling room immediately so the other person is not left waiting.
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect_error", () => {
      setFatalError("Could not connect to the call server. Please check your connection and try again.");
      setJoining(false);
      cleanup();
    });

    socket.on("connect", () => {
      socket.emit("join-room", roomId.trim());
      setStatus("waiting");
      setJoining(false);

      // Request media in parallel — fall back to receive-only if it fails.
      tryAcquireMedia().then((ok) => {
        if (!ok) {
          setMediaWarning(
            (prev) =>
              prev ||
              "Joined in listen-only mode. Tap “Enable camera & mic” so the other person can see and hear you."
          );
        }
      });
    });

    socket.on("room-full", () => {
      setFatalError("This call room is full. Only two participants are allowed.");
      cleanup();
      setStatus("ended");
      setJoining(false);
    });

    socket.on("peer-joined", ({ peerId }) => {
      setStatus("connecting");
      createPeer(true, peerId, socket, localStreamRef.current);
    });

    socket.on("signal", ({ from, data }) => {
      if (!peerRef.current) {
        setStatus("connecting");
        const peer = createPeer(false, from, socket, localStreamRef.current);
        peer.signal(data);
      } else {
        peerRef.current.signal(data);
      }
    });

    socket.on("peer-left", () => {
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

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
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
        <video ref={localVideoRef} className="vc-local-video" autoPlay playsInline muted />
        {!hasLocalVideo && (
          <div className="vc-local-video vc-local-placeholder">
            <span>No camera</span>
          </div>
        )}
      </div>

      <div className="vc-controls">
        <button
          className={`vc-icon-btn ${micOn && hasLocalMedia ? "" : "vc-icon-btn-off"}`}
          onClick={toggleMic}
          disabled={!hasLocalMedia || !localStreamRef.current?.getAudioTracks().length}
          title={micOn ? "Mute mic" : "Unmute mic"}
          aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
        >
          {micOn ? "🎤" : "🔇"}
        </button>
        <button
          className={`vc-icon-btn ${camOn && hasLocalVideo ? "" : "vc-icon-btn-off"}`}
          onClick={toggleCam}
          disabled={!hasLocalVideo}
          title={camOn ? "Turn off camera" : "Turn on camera"}
          aria-label={camOn ? "Turn off camera" : "Turn on camera"}
        >
          {camOn ? "📷" : "🚫"}
        </button>
        <button className="vc-icon-btn vc-icon-btn-end" onClick={endCall} title="End call" aria-label="End call">
          📞
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
