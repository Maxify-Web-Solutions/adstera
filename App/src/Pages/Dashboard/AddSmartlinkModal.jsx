import { useState } from "react";

function AddSmartlinkModal({ onClose, onSubmit }) {
    const [trafficType, setTrafficType] = useState("adult");

    const options = [
        { label: "Adult", value: "adult" },
        { label: "Mainstream", value: "mainstream" },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose} // ✅ outside click close
        >
            <div
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 relative"
                onClick={(e) => e.stopPropagation()} // ✅ IMPORTANT FIX
            >
                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                    Add new Smartlink
                </h2>

                {/* Traffic Type */}
                <div className="space-y-4">
                    <h3 className="text-gray-700 dark:text-gray-300 font-medium">
                        Traffic type
                    </h3>

                    {options.map((item) => (
                        <div
                            key={item.value}
                            onClick={() => setTrafficType(item.value)}
                            className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition
                ${trafficType === item.value
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-gray-300 dark:border-slate-700 hover:border-green-400"
                                }`}
                        >
                            {/* Radio */}
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${trafficType === item.value
                                        ? "border-green-500"
                                        : "border-gray-400"
                                    }`}
                            >
                                {trafficType === item.value && (
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                                )}
                            </div>

                            <span className="text-gray-800 dark:text-white">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                        CANCEL
                    </button>

                    <button
                        type="button"
                        onClick={() => onSubmit(trafficType)}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                    >
                        ADD
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddSmartlinkModal;