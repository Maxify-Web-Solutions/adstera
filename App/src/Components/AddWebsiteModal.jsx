import React, { useEffect, useState } from "react";
import { X, Maximize2, Monitor, Smartphone, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createWebsite } from "../redux/slice/websiteSlice";

const websiteCategories = [
    "Blog",
    "Movies",
    "Gaming",
    "Education",
    "Finance",
    "News",
    "Adult",
    "Tools",
    "Entertainment",
];

const adFormats = [
    { value: "Popunder", label: "Popunder" },
    { value: "Smartlink", label: "Smartlink" },
    { value: "Native Banner", label: "Native Banner" },
    { value: "Social Bar", label: "Social Bar" },
    { value: "Banner", label: "Banner" },
];

// Available banner sizes
const availableBannerSizes = [
    { id: "468x60", name: "468x60", icon: <Maximize2 className="w-6 h-6 mx-auto text-black" />, description: "Full Banner" },
    { id: "160x300", name: "160x300", icon: <Maximize2 className="w-6 h-6 mx-auto text-black" />, description: "Half Page" },
    { id: "320x50", name: "320x50", icon: <Smartphone className="w-6 h-6 mx-auto text-black" />, description: "Mobile Banner" },
    { id: "300x250", name: "300x250", icon: <Monitor className="w-6 h-6 mx-auto text-black" />, description: "Medium Rectangle" },
    { id: "160x600", name: "160x600", icon: <Maximize2 className="w-6 h-6 mx-auto text-black" />, description: "Skyscraper" },
    { id: "728x90", name: "728x90", icon: <Monitor className="w-6 h-6 mx-auto text-black" />, description: "Leaderboard" },
];

const AddWebsiteModal = ({ isOpen, setIsOpen }) => {

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.website);

    const [formData, setFormData] = useState({
        website: "",
        websiteCategory: "",
        showAdultAds: false,
        adFormat: [],
        bannerSizes: [],
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                website: "",
                websiteCategory: "",
                showAdultAds: false,
                adFormat: ["Popunder"],
                bannerSizes: [],
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAdFormatChange = (formatValue, isChecked) => {
        let newAdFormat;
        if (isChecked) {
            newAdFormat = [...(formData.adFormat || []), formatValue];
        } else {
            newAdFormat = formData.adFormat.filter((item) => item !== formatValue);
            if (formatValue === "Banner") {
                setFormData((prev) => ({
                    ...prev,
                    bannerSizes: [],
                }));
            }
        }
        
        setFormData((prev) => ({
            ...prev,
            adFormat: newAdFormat,
        }));
    };

    const handleBannerSizeToggle = (sizeId) => {
        setFormData((prev) => ({
            ...prev,
            bannerSizes: prev.bannerSizes.includes(sizeId)
                ? prev.bannerSizes.filter(s => s !== sizeId)
                : [...prev.bannerSizes, sizeId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.website || !formData.websiteCategory) return;

        const submitData = {
            ...formData,
            bannerSizes: formData.adFormat.includes("Banner") ? formData.bannerSizes : []
        };

        const res = await dispatch(createWebsite(submitData));

        if (res?.meta?.requestStatus === "fulfilled") {
            setIsOpen(false);
            setFormData({
                website: "",
                websiteCategory: "",
                showAdultAds: false,
                adFormat: ["Popunder"],
                bannerSizes: [],
            });
        }
    };

    if (!isOpen) return null;

    const isBannerSelected = formData.adFormat?.includes("Banner");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-black">
                            Add new Website
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                        >
                            <X className="w-5 h-5 text-black" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Website URL */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Website
                        </label>
                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="Enter website URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder-gray-500"
                        />
                    </div>

                    {/* Website Category */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Website category
                        </label>
                        <select
                            name="websiteCategory"
                            value={formData.websiteCategory}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                        >
                            <option value="" className="text-black">Select category</option>
                            {websiteCategories.map((cat) => (
                                <option key={cat} value={cat} className="text-black">
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Adult Ads */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="showAdultAds"
                                id="showAdultAds"
                                checked={formData.showAdultAds}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="showAdultAds"
                                className="text-sm font-medium text-black"
                            >
                                Show adult ads
                            </label>
                        </div>
                        {formData.showAdultAds && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-blue-600 font-bold text-sm">⚡</span>
                                    <span className="text-sm font-semibold text-black">
                                        BOOST YOUR CPM
                                    </span>
                                </div>
                                <p className="text-xs text-black">
                                    Adult ads typically help to increase CPM and revenue.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Ad Format */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-3">
                            Choose Ad Unit format
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {adFormats.map((format) => (
                                <label
                                    key={format.value}
                                    className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all"
                                >
                                    <input
                                        type="checkbox"
                                        value={format.value}
                                        checked={formData.adFormat?.includes(format.value)}
                                        onChange={(e) => handleAdFormatChange(format.value, e.target.checked)}
                                        className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 rounded"
                                    />
                                    <span className="text-sm text-black">
                                        {format.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Banner Size Selection - Clean Grid Layout */}
                    {isBannerSelected && (
                        <div className="border-t border-gray-200 pt-4 mt-2">
                            <div className="mb-4">
                                <label className="text-sm font-semibold text-black block mb-1">
                                    Select Banner Sizes
                                </label>
                                <p className="text-xs text-black/70">
                                    Choose the banner sizes you want to display
                                </p>
                            </div>

                            {/* Clean Grid Layout for Banner Sizes */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {availableBannerSizes.map((size) => (
                                    <label
                                        key={size.id}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                                            formData.bannerSizes?.includes(size.id)
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-200 hover:border-indigo-300"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.bannerSizes?.includes(size.id)}
                                            onChange={() => handleBannerSizeToggle(size.id)}
                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                        />
                                        <div className="text-center">
                                            <div className="text-2xl mb-1">
                                                {size.icon}
                                            </div>
                                            <p className="text-sm font-semibold text-black">
                                                {size.name}
                                            </p>
                                            <p className="text-xs text-black/70 mt-1">
                                                {size.description}
                                            </p>
                                        </div>
                                        {formData.bannerSizes?.includes(size.id) && (
                                            <CheckCircle className="w-4 h-4 text-indigo-500 mt-1" />
                                        )}
                                    </label>
                                ))}
                            </div>

                            {/* Selected Sizes Summary */}
                            {formData.bannerSizes && formData.bannerSizes.length > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-semibold text-black mb-2">
                                        Selected Sizes ({formData.bannerSizes.length}):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.bannerSizes.map(size => (
                                            <span key={size} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !formData.website ||
                                !formData.websiteCategory
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : "ADD"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWebsiteModal;