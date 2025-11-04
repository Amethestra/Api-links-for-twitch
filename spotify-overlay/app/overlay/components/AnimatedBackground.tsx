"use client";
import React from "react";
import styles from "../styles/overlay.module.css";

export default function AnimatedBackground() {
    return (
        <div className = {styles.background}>
            <div className = {styles.particles}></div>
        </div>
    );
}