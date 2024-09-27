"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import "../styles/Hero.css";
import { Floating } from "./FloatingComponent";
import Tiles from "./Tiles";

export default function Hero() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const handleMouseEnter = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.currentTarget.play();
    setIsHovered(true);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.currentTarget.pause();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div id="container">
        <Tiles />
        <h1 className="Heading">
          <span className="N">N</span>
          <span className="O">O</span>
          <span className="T">T</span>
          <span className="I">I</span>
          <span className="F">F</span>
          <span className="Y">Y</span>
        </h1>
      </div>
      <style jsx>{`
        .video,
        .book,
        .video1 {
          transition: filter 0.5s ease;
          filter: grayscale(100%);
        }

        .video:hover,
        .book:hover,
        .video1:hover {
          filter: grayscale(0%);
        }
      `}</style>
      <video
        className="video1"
        src={`https://raipur.s3.ap-south-1.amazonaws.com/Graphic.mp4`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        loop
      />
      <video
        className="video"
        src={`https://raipur.s3.ap-south-1.amazonaws.com/Question.mp4`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        loop
      />
      <video
        className="book"
        src={`https://raipur.s3.ap-south-1.amazonaws.com/page_flip.mp4`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        loop
      />
    </div>
  );
}
