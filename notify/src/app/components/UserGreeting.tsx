// components/UserGreeting.tsx
import { StaticImageData } from "next/image";
import React from "react";

interface UserGreetingProps {
  username: string;
  avatar: string | StaticImageData;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ username, avatar }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "fixed",
        top: "10px",
        right: "10px", // Positioned at the top right
        zIndex: 1,
        backgroundColor: "white",
        padding: "5px",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={typeof avatar === "string" ? avatar : avatar.src}
        alt={`${username}'s avatar`}
        style={{
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          marginRight: "10px",
        }}
      />
      <span>Hello, {username}</span>
    </div>
  );
};

export default UserGreeting;
