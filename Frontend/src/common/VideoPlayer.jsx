import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { API_ENDPOINT } from "../appConfig";
import { refreshToken } from "../auth/authService";

const VideoPlayer = ({ videoId, width = "full", height = "60" }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // always get fresh token
  const getToken = () => localStorage.getItem("access_token");

  const buildHlsUrl = () => {
    return `${API_ENDPOINT}/api/video/hls/${videoId}/manifest.m3u8?token=${getToken()}`;
  };

  const setupHls = () => {
    const video = videoRef.current;
    if (!video) return;

    setLoading(true);
    setError(null);

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      maxBufferLength: 30
    });

    hlsRef.current = hls;

    hls.loadSource(buildHlsUrl());
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setLoading(false);
      video.play().catch(() => {});
    });

    // Auto refresh token on 401
    hls.on(Hls.Events.ERROR, async (event, data) => {
      if (data.response && data.response.code === 401) {
        console.log("🔁 Token expired → refreshing...");

        try {
          const refresh = localStorage.getItem("refresh_token");
          const payload = { refreshToken: refresh };
          const res = await refreshToken(payload);

          const newToken = res.data?.data?.accessToken;
          const newRefresh = res.data?.data?.refreshToken;

          if (newToken) {
            localStorage.setItem("access_token", newToken);
            localStorage.setItem("refresh_token", newRefresh);

            console.log("✔ Token refreshed → reload HLS");
            hls.stopLoad();
            hls.loadSource(buildHlsUrl());
            hls.startLoad();
          }
        } catch (err) {
          console.error("Refresh token failed → redirect login");
          localStorage.clear();
          window.location.href = "/login";
        }
      }

      // Các lỗi fatal khác của HLS.js
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
            break;
        }
      }
    });
  };

  useEffect(() => {
    setupHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoId]);

  const widthClass = width === "full" ? "w-full" : width === "96" ? "w-96" : "w-full";
  const heightClass = height === "60" ? "h-60" : height === "96" ? "h-96" : "h-60";

  return (
      <div className={`relative ${widthClass} ${heightClass} bg-black rounded-lg overflow-hidden`}>
        <video ref={videoRef} controls className="w-full h-full" />
        {loading && <p className="absolute inset-0 flex items-center justify-center text-white">Loading...</p>}
        {error && <p className="absolute inset-0 flex items-center justify-center text-red-500">{error}</p>}
      </div>
  );
};

export default VideoPlayer;
