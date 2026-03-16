import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const MagicCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;

        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: "power3.out",
            });

            // detect hover on cursor-pointer elements
            const pointerElement = e.target.closest(".cursor-pointer");

            if (pointerElement) {
                gsap.to(cursor, {
                    scale: 3,
                    duration: 0.25,
                });
            } else {
                gsap.to(cursor, {
                    scale: 1,
                    duration: 0.25,
                });
            }
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-6 h-6 border border-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        />
    );
};

export default MagicCursor;