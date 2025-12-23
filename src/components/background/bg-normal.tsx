"use client";
import React from "react";

export default function SciFiBackgroundNormal({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="wrap">
      <div className="gridOverlay" />

      <div className="tri triA" />
      <div className="tri triB" />
      <div className="tri triC" />
      <div className="tri triD" />
      <div className="tri triE" />
      <div className="tri triF" />

      <div className="glowLayer" />
      <div className="content">{children}</div>

      <style jsx>{`
        /* ====== Base Layer ====== */
        .wrap {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: radial-gradient(
            circle at 50% 30%,
            #312e81 0%,    /* indigo-900 */
            #1e1b4b 40%,   /* indigo-950 */
            #0f172a 100%   /* slate-950 */
          );
          color: #f8fafc;
        }

        /* ====== Grid Overlay (เคลื่อนขึ้นเรื่อย ๆ + สีสว่างขึ้น) ====== */
        .gridOverlay {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: repeating-linear-gradient(
              60deg,
              rgba(165, 180, 252, 0.35) 0px,
              rgba(165, 180, 252, 0.35) 1px,
              transparent 1px,
              transparent 80px
            ),
            repeating-linear-gradient(
              -60deg,
              rgba(129, 140, 248, 0.25) 0px,
              rgba(129, 140, 248, 0.25) 1px,
              transparent 1px,
              transparent 80px
            );
          background-size: 160px 160px;
          animation: gridMove 20s linear infinite;
          filter: brightness(1.2);
        }

        /* เคลื่อนขึ้น */
        @keyframes gridMove {
          from {
            background-position: 0 0, 0 0;
          }
          to {
            background-position: 0 -160px, 0 -160px;
          }
        }
        /* ====== Triangles (สีสว่างขึ้น) ====== */
        .tri {
          position: absolute;
          width: 300px;
          height: 300px;
          background: linear-gradient(
            135deg,
            rgba(165, 180, 252, 0.4),
            rgba(199, 210, 254, 0.25),
            rgba(224, 231, 255, 0.15)
          );
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          filter: blur(0.5px);
          z-index: 0;
        }

        .triA {
          top: 12%;
          left: -6%;
          transform: rotate(-18deg);
          animation: floaty 8s ease-in-out infinite;
          opacity: 0.8;
        }
        .triB {
          right: -8%;
          bottom: 15%;
          width: 420px;
          height: 420px;
          opacity: 0.6;
          transform: rotate(26deg);
        }
        .triC {
          top: 40%;
          left: 10%;
          width: 240px;
          height: 240px;
          opacity: 0.5;
          transform: rotate(10deg);
        }
        .triD {
          top: 70%;
          right: 15%;
          width: 280px;
          height: 280px;
          opacity: 0.45;
          transform: rotate(-12deg);
        }
        .triE {
          bottom: 5%;
          left: 8%;
          width: 220px;
          height: 220px;
          opacity: 0.55;
          transform: rotate(20deg);
        }
        .triF {
          bottom: 25%;
          right: 40%;
          width: 260px;
          height: 260px;
          opacity: 0.4;
          transform: rotate(30deg);
        }

        /* ====== Soft Floating ====== */
        @keyframes floaty {
          0% {
            transform: translateY(0) rotate(-18deg);
          }
          50% {
            transform: translateY(-10px) rotate(-16deg);
          }
          100% {
            transform: translateY(0) rotate(-18deg);
          }
        }

        /* ====== Glow Layer (สว่างขึ้นตรงกลาง) ====== */
        .glowLayer {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: radial-gradient(
            circle at 50% 60%,
            rgba(165, 180, 252, 0.3) 0%,
            rgba(255, 255, 255, 0.15) 35%,
            transparent 80%
          );
          animation: glowPulse 6s ease-in-out infinite alternate;
          mix-blend-mode: screen;
        }

        @keyframes glowPulse {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 0.9;
          }
        }

        /* ====== Content ====== */
        .content {
          position: relative;
          z-index: 0;
          margin: 0 ;
        }

        /* ====== Responsive ====== */
        @media (max-width: 768px) {
          .tri {
            width: 200px;
            height: 200px;
          }
          .triB {
            width: 280px;
            height: 280px;
          }
        }
      `}</style>
    </div>
  );
}
