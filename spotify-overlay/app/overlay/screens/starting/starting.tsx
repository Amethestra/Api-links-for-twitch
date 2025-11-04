"use client";
import AnimatedBackground from "@/overlay/components/AnimatedBackground";

export default function StartingSoon() {
    return (
        <div>
            <AnimatedBackground />

            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                color: "#C0C2C5",
                fontFamily: "'Cinzel', serif",
                textShadow: "0 0 10px #4c2d6f",
            }}>
                <h1 style={{ fontSize: "4rem", marginBottom: "1rem"}}>
                    Starting Soon...
                </h1>
            </div>
        </div>
    );
}