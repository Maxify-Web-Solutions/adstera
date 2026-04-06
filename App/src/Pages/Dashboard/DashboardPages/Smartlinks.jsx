import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useSortableData } from "../../../Components/useSortableData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    createSmartLink,
    updateSmartLink,
    getSmartLinksByUser,
} from "../../../redux/slice/smartLinkSlice";
import AddSmartlinkModal from "../AddSmartlinkModal";
import StatusPopup from "../StatusPopup";
import EditSmartlinkModal from "../EditSmartlinkModal";

const Smartlinks = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);

    const { smartLinks, loading, createdLink } = useSelector(
        (state) => state.smartlink
    );

    useEffect(() => {
        dispatch(getSmartLinksByUser());
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewlyCreated, setIsNewlyCreated] = useState(false);

    const [popup, setPopup] = useState({
        show: false,
        type: "success",
        message: "",
    });

    const showPopup = (type, message) => {
        setPopup({ show: true, type, message });
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            dispatch(getSmartLinksByUser(userId));
        }
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

            showPopup("success", "Smartlink created & copied!");
            setIsNewlyCreated(false);
        }
    }, [createdLink, isNewlyCreated]);

    const handleCopy = (link) => {
        if (link?.finalUrl) {
            navigator.clipboard.writeText(link.finalUrl);
            showPopup("success", "Link copied!");
        } else {
            showPopup("error", "Failed to copy link");
        }
    };

    const handleReactivate = async (link) => {
        try {
            await dispatch(updateSmartLink({ id: link._id, status: "Active" })).unwrap();
            showPopup("success", "Smartlink reactivated!");
        } catch (error) {
            showPopup("error", "Failed to reactivate link");
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

                    <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0">
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
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Get Anti-Adblock to increase your revenue
                </span>

                <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0">
                    SHOW TIPS
                </button>
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

            {/* MODAL */}
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
            showPopup("success", "Smartlink name updated!");
        }}
    />
)}

            {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">

                    <table className="w-full text-left min-w-[640px]">
                        <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    <button onClick={() => requestSort("name")} className="flex items-center gap-2 w-full">
                                        Name {getSortIcon("name")}
                                    </button>
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    <button onClick={() => requestSort("_id")} className="flex items-center gap-2 w-full">
                                        ID {getSortIcon("_id")}
                                    </button>
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    <button onClick={() => requestSort("status")} className="flex items-center gap-2 w-full">
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
                                    <tr key={link._id} className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700">

                                        <td className="px-4 py-3">{link.name}</td>

                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                            {link.linkId}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(link.status)}`}>
                                                {link.status || "Inactive"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-sm">

                                            <button
                                                onClick={() =>
                                                    navigate("/dashboard/statistics", {
                                                        state: {
                                                            domain: link.linkId,
                                                            placement: link._id,
                                                        },
                                                    })
                                                }
                                                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                            >
                                                STATISTICS
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditingLink(link);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                            >
                                                EDIT
                                            </button>

                                            <button
                                                onClick={() => handleCopy(link)}
                                                className="text-green-400 hover:text-green-300"
                                            >
                                                COPY LINK
                                            </button>

                                            {link.status !== "Active" && (
                                                <button
                                                    onClick={() => handleReactivate(link)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    REACTIVATE
                                                </button>
                                            )}

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        No Smartlinks Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>

            {/* Mobile Card UI */}
            <div className="md:hidden space-y-4">
                {sortedLinks.length > 0 ? (
                    sortedLinks.map((link) => (
                        <div key={link._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">

                            <div className="flex justify-between items-center">
                                <h3 className="text-gray-900 dark:text-white font-semibold">
                                    {link.name}
                                </h3>
                                <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(link.status)}`}>
                                    {link.status || "Inactive"}
                                </span>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {link.linkId}
                            </p>

                            <div className="flex flex-wrap gap-3 text-sm pt-2">

                                <button
                                    onClick={() =>
                                        navigate("/statistics", {
                                            state: {
                                                domain: link.linkId,
                                                placement: link._id,
                                            },
                                        })
                                    }
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                >
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
                                    <button
                                        onClick={() => handleReactivate(link)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        REACTIVATE
                                    </button>
                                )}

                            </div>

                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        No Smartlinks Found
                    </div>
                )}
            </div>

            {/* POPUP */}
            <StatusPopup
                show={popup.show}
                type={popup.type}
                message={popup.message}
                onClose={() => setPopup((prev) => ({ ...prev, show: false }))}
            />

        </div>
    );
};

export default Smartlinks;