import "@/overlay/styles/overlay.css"

import React from 'react';

export default function OverlayLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    background: 'transparent',
                    fontFamily: 'Segoe UI, sans-serif',
                    color: 'white',
                }}
            >
                {children}
            </body>
        </html>
    );
}