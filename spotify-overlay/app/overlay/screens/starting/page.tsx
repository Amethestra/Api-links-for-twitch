"use client";

import styles from "./overlay.module.css";

export default function StartingScreen() {
    return (
        <div className={styles.startingWrapper}>
            <div className={styles.backgroundLayers} />

            <div className={styles.pillars}>
                <div className={`${styles.pillar} ${styles.left}`} />
                <div className={`${styles.pillar} ${styles.right}`} />
            </div>

            <div className={styles.throne} />
            <div className={styles.sigil} />

            <div className={styles.particles}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <span
                        key={i}
                        className={styles.particle}
                        style={{
                            "--x": Math.random(),
                            "--d": Math.random() * 10,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            <div className={styles.fog} />

            <div className={styles.text}>
                <h1>Starting Soon...</h1>
            </div>
        </div>
    );
}
