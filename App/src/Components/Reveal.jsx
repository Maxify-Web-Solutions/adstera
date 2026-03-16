import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const Reveal = ({ children, delay = 0 }) => {

    const controls = useAnimation();

    const [ref, inView] = useInView({
        threshold: 0.2
    });

    useEffect(() => {
        if (inView) {
            controls.start({
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.6,
                    delay
                }
            });
        } else {
            controls.start({
                opacity: 0,
                y: 60
            });
        }
    }, [controls, inView, delay]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={controls}
        >
            {children}
        </motion.div>
    );
};

export default Reveal;