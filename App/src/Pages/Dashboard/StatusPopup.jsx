import { motion, AnimatePresence } from "framer-motion";

const StatusPopup = ({ show, type, message, onClose }) => {
  const isSuccess = type === "success";

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 100 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.2, type: "spring", stiffness: 200, damping: 15 },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { delay: 0.4, duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-sm text-center relative overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon Container */}
            <div className="flex justify-center mb-6">
              {isSuccess ? (
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 bg-green-100 dark:bg-green-500/20 rounded-full"
                    variants={circleVariants}
                  />
                  <svg
                    className="w-10 h-10 md:w-12 md:h-12 text-green-500 dark:text-green-400 relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={pathVariants}
                    />
                  </svg>
                </div>
              ) : (
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 bg-red-100 dark:bg-red-500/20 rounded-full"
                    variants={circleVariants}
                  />
                  <svg
                    className="w-10 h-10 md:w-12 md:h-12 text-red-500 dark:text-red-400 relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <motion.path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={pathVariants}
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isSuccess ? "Success!" : "Error!"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                {message}
              </p>

              <button
                onClick={onClose}
                className={`w-full py-2.5 md:py-3 px-6 rounded-xl text-white font-semibold shadow-lg transition-transform transform active:scale-95 text-sm md:text-base ${
                  isSuccess
                    ? "bg-green-600 hover:bg-green-700 shadow-green-500/30"
                    : "bg-red-600 hover:bg-red-700 shadow-red-500/30"
                }`}
              >
                {isSuccess ? "Continue" : "Try Again"}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusPopup;