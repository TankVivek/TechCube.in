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

export default function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("idle");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const startedRef = useRef(false);

  const cleanup = useCallback(() => {
    peerRef.current?.destroy();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    socketRef.current?.disconnect();
    socketRef.current = null;
    startedRef.current = false;
  }, []);

  const wirePeerEvents = useCallback((peer, remoteSocketId, socket) => {
    peer.on("signal", (data) => {
      socket.emit("signal", { to: remoteSocketId, data });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      setStatus("connected");
    });

    peer.on("close", () => setStatus("waiting"));
    peer.on("error", (err) => {
      console.error("Peer error:", err);
      setError("Connection lost. Waiting for the other person to rejoin…");
    });
  }, []);

  const startCall = useCallback(async () => {
    if (!roomId?.trim() || startedRef.current) return;

    startedRef.current = true;
    setJoining(true);
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
      socketRef.current = socket;

      socket.on("connect_error", () => {
        setError("Could not connect to the call server. Please try again.");
        setJoining(false);
        cleanup();
      });

      socket.on("connect", () => {
        socket.emit("join-room", roomId.trim());
        setStatus("waiting");
        setJoining(false);
      });

      socket.on("room-full", () => {
        setError("This call room is full. Only two participants are allowed.");
        cleanup();
        setStatus("ended");
        setJoining(false);
      });

      socket.on("peer-joined", ({ peerId }) => {
        setStatus("connecting");
        const peer = new Peer({
          initiator: true,
          trickle: true,
          stream,
          config: { iceServers: getIceServers() },
        });
        wirePeerEvents(peer, peerId, socket);
        peerRef.current = peer;
      });

      socket.on("signal", ({ from, data }) => {
        if (!peerRef.current) {
          setStatus("connecting");
          const peer = new Peer({
            initiator: false,
            trickle: true,
            stream,
            config: { iceServers: getIceServers() },
          });
          wirePeerEvents(peer, from, socket);
          peerRef.current = peer;
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
    } catch (err) {
      console.error(err);
      setError(
        err.name === "NotAllowedError"
          ? "Camera/microphone access was denied. Please allow permissions and refresh."
          : "Couldn't access camera/microphone. Check permissions and try again."
      );
      setJoining(false);
      startedRef.current = false;
    }
  }, [roomId, cleanup, wirePeerEvents]);

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

  const statusLabel = {
    idle: "",
    waiting: "Waiting for the other person to join…",
    connecting: "Connecting…",
    connected: "Connected",
    ended: "Call ended",
  }[status];

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

  if (joining || (status === "idle" && !error)) {
    return (
      <div className="vc-lobby">
        <div className="vc-lobby-card">
          <div className="vc-spinner" style={{ margin: "0 auto 16px" }} />
          <h2>Joining call…</h2>
          <p className="vc-subtext">Setting up camera and microphone</p>
        </div>
      </div>
    );
  }

  if (status === "ended" && error) {
    return (
      <div className="vc-lobby">
        <div className="vc-lobby-card">
          <h2>Unable to join</h2>
          <p className="vc-error">{error}</p>
          <button className="vc-btn vc-btn-primary" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vc-room">
      <div className={`vc-status vc-status-${status}`}>{statusLabel}</div>
      {error && status !== "ended" && (
        <div className="vc-status" style={{ top: 48, color: "#ffb4b4" }}>
          {error}
        </div>
      )}

      <div className="vc-stage">
        <video ref={remoteVideoRef} className="vc-remote-video" autoPlay playsInline />
        {status !== "connected" && (
          <div className="vc-placeholder">
            <div className="vc-spinner" />
          </div>
        )}
        <video ref={localVideoRef} className="vc-local-video" autoPlay playsInline muted />
      </div>

      <div className="vc-controls">
        <button
          className={`vc-icon-btn ${micOn ? "" : "vc-icon-btn-off"}`}
          onClick={toggleMic}
          title={micOn ? "Mute mic" : "Unmute mic"}
          aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
        >
          {micOn ? "🎤" : "🔇"}
        </button>
        <button
          className={`vc-icon-btn ${camOn ? "" : "vc-icon-btn-off"}`}
          onClick={toggleCam}
          title={camOn ? "Turn off camera" : "Turn on camera"}
          aria-label={camOn ? "Turn off camera" : "Turn on camera"}
        >
          {camOn ? "📷" : "🚫"}
        </button>
        <button
          className="vc-icon-btn vc-icon-btn-end"
          onClick={endCall}
          title="End call"
          aria-label="End call"
        >
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
