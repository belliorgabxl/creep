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

      <div className="content">{children}</div>

      <style jsx>{`
        .wrap {
          position: relative;
          min-height: 60vh;
          overflow: hidden;
          background: #f9fafb; /* พื้นหลังขาวนวล */
          color: #0f172a;
        }

        .gridOverlay {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: repeating-linear-gradient(
              60deg,
              rgba(168, 85, 247, 0.13) 0px,
              /* purple-500 เข้มขึ้น */ rgba(168, 85, 247, 0.13) 1px,
              transparent 1px,
              transparent 80px
            ),
            repeating-linear-gradient(
              -60deg,
              rgba(147, 51, 234, 0.1) 0px,
              /* purple-600 อ่อนลง */ rgba(147, 51, 234, 0.1) 1px,
              transparent 1px,
              transparent 80px
            );
        }

        /* สามเหลี่ยมโปร่งฟ้า */
        .tri {
          position: absolute;
          width: 300px;
          height: 300px;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.12),
            rgba(99, 102, 241, 0.08),
            rgba(168, 85, 247, 0.05)
          );
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          filter: blur(0.5px);
          z-index: 1;
        }
        .triA {
          top: 12%;
          left: -6%;
          transform: rotate(-18deg);
          animation: floaty 8s ease-in-out infinite;
        }
        .triB {
          right: -8%;
          bottom: 15%;
          width: 400px;
          height: 400px;
          opacity: 0.8;
          transform: rotate(26deg);
        }
        .triC {
          top: 40%;
          left: 10%;
          width: 240px;
          height: 240px;
          opacity: 0.6;
          transform: rotate(10deg);
        }
        .triD {
          top: 70%;
          right: 15%;
          width: 280px;
          height: 280px;
          opacity: 0.5;
          transform: rotate(-12deg);
        }
        .triE {
          bottom: 5%;
          left: 8%;
          width: 220px;
          height: 220px;
          opacity: 0.7;
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

        .content {
          position: relative;
          z-index: 2;
          padding: 10px 10px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @keyframes floaty {
          0% {
            transform: translateY(0) rotate(-18deg);
          }
          50% {
            transform: translateY(-6px) rotate(-16deg);
          }
          100% {
            transform: translateY(0) rotate(-18deg);
          }
        }

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
