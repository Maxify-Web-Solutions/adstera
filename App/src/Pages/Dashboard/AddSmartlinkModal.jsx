import { useState } from "react";

function AddSmartlinkModal({ onClose, onSubmit }) {
    const [trafficType, setTrafficType] = useState("adult");

    const options = [
        { label: "Adult Traffic", value: "adult" },
        { label: "Maisteram Traffic", value: "maisteram" }, // ✅ FIXED
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-6">
                    Add new Smartlink
                </h2>

                <div className="space-y-4">
                    <h3 className="font-medium">Traffic type</h3>

                    {options.map((item) => (
                        <div
                            key={item.value}
                            onClick={() => setTrafficType(item.value)}
                            className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border
                            ${trafficType === item.value
                                    ? "border-green-500 "
                                    : "border-gray-300"
                                }`}
                        >
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

                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-2">
                        CANCEL
                    </button>

                    <button
                        onClick={() => onSubmit(trafficType)} // ✅ correct value
                        className="px-5 py-2 bg-green-600 text-white rounded-lg"
                    >
                        ADD
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddSmartlinkModal;