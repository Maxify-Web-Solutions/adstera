import { useRef } from "react";
import { gsap } from "gsap";

const MagneticButton = ({ children }) => {
    const ref = useRef(null);

    const handleMove = (e) => {
        const rect = ref.current.getBoundingClientRect();

        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        const moveX = (relX - rect.width / 2) * 0.4;
        const moveY = (relY - rect.height / 2) * 0.4;

        gsap.to(ref.current, {
            x: moveX,
            y: moveY,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    const handleLeave = () => {
        gsap.to(ref.current, {
            x: 0,
            y: 0,
            duration: 0.4,
        });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="magnetic inline-flex items-center justify-center cursor-pointer"
        >
            {children}
        </div>
    );
};

export default MagneticButton;