import { useState } from "react";
import { FaFire } from "react-icons/fa";

function AddWebsiteModal({ onClose }) {
    const [adultAds, setAdultAds] = useState(false);
    const [selectedAd, setSelectedAd] = useState("");
    const [bannerSize, setBannerSize] = useState("");

    const adFormats = [
        { name: "Popunder", best: true },
        { name: "Smartlink" },
        { name: "Native Banner" },
        { name: "Social Bar" },
        { name: "Banner" },
    ];

    const bannerSizes = [
        "Banner 300x250",
        "Banner 728x90",
        "Banner 160x600",
        "Banner 300x600",
        "Banner 320x50",
        "Banner 970x250",
    ];

    const categories = [
  { label: "Social", value: "social" },
  { label: "Adult Social", value: "adultSocial" },
  { label: "Movies", value: "movies" },
  { label: "News", value: "news" },
  { label: "Blog", value: "blog" },
  { label: "URLShortner", value: "urlShortner" },
  { label: "MP3", value: "mp3" },
  { label: "Sport Streaming", value: "sportStreaming" },
  { label: "Video Hosts", value: "videoHosts" },
  { label: "Converter", value: "converter" },
  { label: "Filehosts", value: "filehosts" },
  { label: "Torrents", value: "Torrents" },
  { label: "Anime", value: "anime" },
  { label: "Downloads", value: "downloads" },
  { label: "Faucet", value: "faucet" },
  { label: "Books", value: "books" },
  { label: "Other", value: "other" },
];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                    Add new Website
                </h2>

                {/* Website Input */}
                <input
                    type="text"
                    placeholder="Website URL (https://example.com)"
                    className="w-full mb-5 px-5 py-3.5 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />

                {/* Category */}
                <select className="w-full mb-6 px-5 py-3.5 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all">
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>

                {/* Adult Ads */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg text-gray-800 dark:text-white font-medium">
                            Show adult ads
                        </h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            BOOST YOUR CPM
                        </span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Increase revenue with adult ads.
                    </p>

                    {/* Toggle */}
                    <button
                        onClick={() => setAdultAds(!adultAds)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${adultAds ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${adultAds ? "translate-x-6" : ""
                                }`}
                        />
                    </button>
                </div>

                {/* Ad Formats */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                        Choose Ad Unit format
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {adFormats.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => setSelectedAd(item.name)}
                                className={`cursor-pointer rounded-2xl p-4 border flex justify-between items-center transition-all
      ${selectedAd === item.name
                                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md ring-1 ring-green-500"
                                        : "border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{item.name}</span>

                                    {/* BEST badge */}
                                    {item.best && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded flex gap-2 justify-center items-center">
                                            Best <FaFire />
                                        </span>
                                    )}
                                </div>

                                {/* Radio */}
                                <div className="w-4 h-4 rounded-full border flex items-center justify-center">
                                    {selectedAd === item.name && (
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Banner Sizes */}
                {selectedAd === "Banner" && (
                    <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3">
                            Select Banner Size
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {bannerSizes.map((size) => (
                                <div
                                    key={size}
                                    onClick={() => setBannerSize(size)}
                                    className={`cursor-pointer rounded-xl p-3 border transition-all flex items-center justify-between
                    ${bannerSize === size
                                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                            : "border-gray-300 dark:border-slate-700 hover:border-green-400"
                                        }`}
                                >
                                    <span className="text-sm text-gray-800 dark:text-white">
                                        {size}
                                    </span>

                                    {/* Radio */}
                                    <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center
                      ${bannerSize === size
                                                ? "border-green-500"
                                                : "border-gray-400"
                                            }`}
                                    >
                                        {bannerSize === size && (
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors font-medium"
                    >
                        CANCEL
                    </button>

                    <button className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]">
                        ADD WEBSITE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddWebsiteModal;