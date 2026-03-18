import React, { useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useSortableData } from "../../../Components/useSortableData";
import { useDispatch, useSelector } from "react-redux";
import {
    createSmartLink,
    getSmartLinksByUser,
} from "../../../redux/slice/smartLinkSlice";

const Smartlinks = () => {
    const dispatch = useDispatch();

    const { smartLinks, loading, createdLink } = useSelector(
        (state) => state.smartlink
    );

    // ✅ Fetch links
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            dispatch(getSmartLinksByUser(userId));
        }
    }, [dispatch]);

    // ✅ Sorting
    const {
        items: sortedLinks,
        requestSort,
        sortConfig,
    } = useSortableData(smartLinks || [], {
        key: "name",
        direction: "ascending",
    });

    // ✅ Sort icon
    const getSortIcon = (name) => {
        if (!sortConfig || sortConfig.key !== name) return null;

        return sortConfig.direction === "ascending" ? (
            <FaArrowUp className="opacity-50" size={12} />
        ) : (
            <FaArrowDown className="opacity-50" size={12} />
        );
    };

    // ✅ Create Smartlink
    const handleCreate = () => {
        dispatch(createSmartLink());
    };

    // ✅ Auto copy
    useEffect(() => {
        if (createdLink?.finalUrl) {
            navigator.clipboard.writeText(createdLink.finalUrl);
            alert("Smartlink created & copied!");
        }
    }, [createdLink]);

    // ✅ Copy button
    const handleCopy = (link) => {
        if (link?.finalUrl) {
            navigator.clipboard.writeText(link.finalUrl);
            alert("Copied!");
        }
    };

    return (
        <div className="space-y-8">

            {/* Guide Section */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 md:p-8">

                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                    <h2 className="text-gray-900 dark:text-white font-semibold text-lg">
                        Monetize any traffic with a Smartlink
                    </h2>

                    <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        HIDE TIPS
                    </button>
                </div>

                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-3xl">
                    Whether you manage a social media group, YouTube channel, or mobile app,
                    our Smartlink is your tool for monetization. Simply guide your audience
                    to the URL, and our smart algorithms will connect them to the best
                    landing pages.
                </p>

                <div className="grid md:grid-cols-3 gap-8">

                    <div>
                        <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                            1 Create Smartlink
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Click green ADD SMARTLINK button below to start.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                            2 Add the Link anywhere
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Paste it in any social media post or website.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                            3 Track and make changes
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Track statistics and manage your link settings.
                        </p>
                    </div>

                </div>
            </div>

            {/* Anti Adblock */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                    Get Anti-Adblock to increase your revenue
                </span>

                <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    SHOW TIPS
                </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">

                <button className="border border-gray-300 dark:border-slate-700 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 w-full sm:w-auto">
                    EXPORT LINKS
                </button>

                <button
                    onClick={handleCreate}
                    className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
                >
                    {loading ? "Creating..." : "ADD SMARTLINK"}
                </button>

            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">

                <div className="overflow-x-auto">

                    <table className="w-full text-left min-w-[640px]">

                        {/* ✅ FIXED HEADER */}
                        <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm">
                            <tr>

                                <th className="px-4 py-3 font-medium">
                                    <button
                                        onClick={() => requestSort("name")}
                                        className="flex items-center gap-2 w-full"
                                    >
                                        Name {getSortIcon("name")}
                                    </button>
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    <button
                                        onClick={() => requestSort("_id")}
                                        className="flex items-center gap-2 w-full"
                                    >
                                        ID {getSortIcon("_id")}
                                    </button>
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    <button
                                        onClick={() => requestSort("status")}
                                        className="flex items-center gap-2 w-full"
                                    >
                                        Status {getSortIcon("status")}
                                    </button>
                                </th>

                                <th className="px-4 py-3 font-medium text-right">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {sortedLinks.length > 0 ? (
                                sortedLinks.map((link) => (
                                    <tr
                                        key={link._id}
                                        className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                                    >

                                        <td className="px-4 py-3">{link.name}</td>

                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                            {link.linkId}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full ${
                                                    link.status === "Active"
                                                        ? "bg-green-600/20 text-green-400"
                                                        : "bg-red-600/20 text-red-400"
                                                }`}
                                            >
                                                {link.status || "Inactive"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 flex gap-6 text-sm justify-end">

                                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                                STATISTICS
                                            </button>

                                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                                EDIT
                                            </button>

                                            <button
                                                onClick={() => handleCopy(link)}
                                                className="text-green-400 hover:text-green-300"
                                            >
                                                COPY LINK
                                            </button>

                                            {link.status !== "Active" && (
                                                <button className="text-red-400 hover:text-red-300">
                                                    REACTIVATE
                                                </button>
                                            )}

                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No Smartlinks Found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>

                <div className="flex justify-end items-center gap-6 p-4 border-t border-gray-200 dark:border-slate-700 text-sm text-gray-500 dark:text-gray-400">
                    <span>Rows per page: 10</span>
                    <span>
                        1–{sortedLinks.length} of {sortedLinks.length}
                    </span>
                </div>

            </div>

        </div>
    );
};

export default Smartlinks;