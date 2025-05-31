import React from "react";
import { RingLoader } from "react-spinners";

export default function LoadingSpinnerDash() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height to center it vertically
      }}
    >
      <RingLoader size={80} color="var(--border2)" />
    </div>
  );
}
