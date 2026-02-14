"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Feed from "./components/Feed";


export default function Home() {
  return (
    <div style={{ 
        maxWidth: "600px", 
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center",
      }}>
      <h1>Welcome to the Newsfeed App</h1>
      <p>This is the home page. Navigate to the feed to see posts.</p>
      <Feed />
    </div>
  );
}
  