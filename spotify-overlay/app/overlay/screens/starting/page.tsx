"use client";

import "./styles/overlay.module.css";

export default function StartingScreen() {
    return (
        <div className = "starting-wrapper">
            <div className="background-layers" />
            <div className="pillars" >
                <div className="pillar left" />
                <div className="pillar right" />
            </div>

            <div className="throne" />
            <div className="sigil" />

            <div className = "particles">
                {Array.from({ length: 20 }).map((_, i) => (
                    <span
                        key={i}
                        className="particle"
                        style={{
                        "--x": Math.random(),
                        "--d": Math.random() * 10,
                        } as React.CSSProperties}
                    />
                    ))}

            </div>

            <div className="fog" />

            <div className="text">
                <h1>Starting Soon...</h1>
            </div>
        </div>
    );
}