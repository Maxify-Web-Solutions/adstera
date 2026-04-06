import React, { useState, useEffect } from "react";

const EditSmartlinkModal = ({ link, onClose, onSubmit }) => {
  const [name, setName] = useState("");

  // jab link change ho → input update
  useEffect(() => {
    if (link) {
      setName(link.name || "");
    }
  }, [link]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit(name);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Edit Smartlink Name
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input */}
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
              Smartlink Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new name"
              className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              SAVE CHANGES
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSmartlinkModal;