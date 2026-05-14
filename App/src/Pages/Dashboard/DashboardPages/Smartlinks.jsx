import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useSortableData } from "../../../Components/useSortableData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    createSmartLink,
    updateSmartLink,
    getSmartLinksByUser,
} from "../../../redux/slice/smartLinkSlice";

import AddSmartlinkModal from "../AddSmartlinkModal";
import EditSmartlinkModal from "../EditSmartlinkModal";

const Smartlinks = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showTips, setShowTips] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);

    const { smartLinks, createdLink } = useSelector(
        (state) => state.smartlink
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewlyCreated, setIsNewlyCreated] = useState(false);

    useEffect(() => {
        dispatch(getSmartLinksByUser());
    }, [dispatch]);

    const {
        items: sortedLinks,
        requestSort,
        sortConfig,
    } = useSortableData(smartLinks || [], {
        key: "name",
        direction: "ascending",
    });

    const getSortIcon = (name) => {
        if (!sortConfig || sortConfig.key !== name) return null;

        return sortConfig.direction === "ascending" ? (
            <FaArrowUp className="opacity-50" size={12} />
        ) : (
            <FaArrowDown className="opacity-50" size={12} />
        );
    };

    useEffect(() => {
        if (isNewlyCreated && createdLink?.finalUrl) {
            navigator.clipboard.writeText(createdLink.finalUrl);
            toast.success("Smartlink created & copied!");
            setIsNewlyCreated(false);
        }
    }, [createdLink, isNewlyCreated]);

    const handleCopy = (link) => {
        if (link?.finalUrl) {
            navigator.clipboard.writeText(link.finalUrl);
            toast.success("Link copied!");
        } else {
            toast.error("Failed to copy link");
        }
    };

    const handleReactivate = async (link) => {
        try {
            await dispatch(
                updateSmartLink({ id: link._id, status: "Active" })
            ).unwrap();

            toast.success("Smartlink reactivated!");
        } catch (error) {
            toast.error("Failed to reactivate link");
        }
    };

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();

        switch (s) {
            case "active":
            case "approved":
                return "bg-green-600/20 text-green-400";

            case "pending":
                return "bg-yellow-600/20 text-yellow-400";

            case "rejected":
            case "declined":
                return "bg-red-600/20 text-red-400";

            default:
                return "bg-gray-600/20 text-gray-400";
        }
    };

    return (
        <div className="space-y-8">

            {/* Guide Section */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-gray-900 dark:text-white font-semibold text-lg">
                        Monetize any traffic with a Smartlink
                    </h2>
                    <button
                        onClick={() => setShowTips(!showTips)}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0 transition-colors"
                    >
                        {showTips ? "HIDE TIPS" : "SHOW TIPS"}
                    </button>
                </div>

                {/* Animated content wrapper */}
                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden`}
                    style={{
                        maxHeight: showTips ? "500px" : "0px",
                        opacity: showTips ? 1 : 0,
                    }}
                >
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-3xl">
                        Whether you manage a social media group, YouTube channel, or mobile app,
                        our Smartlink is your tool for monetization.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                                1 Create Smartlink
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Click ADD SMARTLINK button below.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                                2 Add Link
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Paste it anywhere.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                                3 Track Results
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Monitor performance easily.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">

                <button className="border border-gray-300 dark:border-slate-700 px-6 py-2.5 rounded-xl text-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 w-full sm:w-auto font-medium transition-colors">
                    EXPORT LINKS
                </button>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-xl text-white w-full sm:w-auto font-medium shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]"
                >
                    ADD SMARTLINK
                </button>

            </div>

            {/* MODALS */}
            {isModalOpen && (
                <AddSmartlinkModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(trafficType) => {
                        dispatch(createSmartLink({ trafficType }));
                        setIsModalOpen(false);
                        setIsNewlyCreated(true);
                    }}
                />
            )}

            {isEditModalOpen && (
                <EditSmartlinkModal
                    link={editingLink}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={async (newName) => {
                        await dispatch(
                            updateSmartLink({
                                id: editingLink._id,
                                name: newName,
                            })
                        ).unwrap();

                        setIsEditModalOpen(false);
                        toast.success("Smartlink name updated!");
                    }}
                />
            )}

            {/* TABLE */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

    {/* Responsive Wrapper */}
    <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                <tr>
                    <th className="px-4 py-3">
                        <button
                            onClick={() => requestSort("name")}
                            className="flex items-center gap-2"
                        >
                            Name {getSortIcon("name")}
                        </button>
                    </th>

                    <th className="px-4 py-3">
                        ID
                    </th>

                    <th className="px-4 py-3">
                        Status
                    </th>

                    <th className="px-4 py-3 text-right">
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
                            <td className="px-4 py-3 whitespace-nowrap">
                                {link.name}
                            </td>

                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {link.linkId}
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                    className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                                        link.status
                                    )}`}
                                >
                                    {link.status || "Inactive"}
                                </span>
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex justify-end flex-wrap gap-3 text-sm whitespace-nowrap">

                                    <button
                                        onClick={() =>
                                            navigate("/dashboard/statistics", {
                                                state: {
                                                    placementId: link.placementId,
                                                    domain: link.smartCode,
                                                    linkId: link.linkId,
                                                },
                                            })
                                        }
                                        className="hover:text-blue-500 transition"
                                    >
                                        STATISTICS
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditingLink(link);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="hover:text-blue-500 transition"
                                    >
                                        EDIT
                                    </button>

                                    <button
                                        onClick={() => handleCopy(link)}
                                        className="hover:text-blue-500 transition"
                                    >
                                        COPY LINK
                                    </button>

                                    {link.status !== "Active" && (
                                        <button
                                            onClick={() => handleReactivate(link)}
                                            className="hover:text-green-500 transition"
                                        >
                                            REACTIVATE
                                        </button>
                                    )}

                                </div>
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

</div>

        </div >
    );
};

export default Smartlinks;