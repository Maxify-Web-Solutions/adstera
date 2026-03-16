import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useSortableData } from "../../../Components/useSortableData"; 

const linksData = [
    { name: "Smartlink_5", id: "28806761", status: "Active" },
    { name: "Adultlink_3", id: "28243904", status: "Inactive" },
    { name: "Adultlink_2", id: "28243903", status: "Inactive" },
    { name: "Adultlink_1", id: "28243894", status: "Inactive" },
    { name: "Smartlink_1", id: "28243882", status: "Inactive" },
];

const Smartlinks = () => {
    const { items: sortedLinks, requestSort, sortConfig } = useSortableData(linksData, { key: 'name', direction: 'ascending' });

    const getSortIcon = (name) => {
        if (!sortConfig || sortConfig.key !== name) {
            return null;
        }
        if (sortConfig.direction === 'ascending') {
            return <FaArrowUp className="inline ml-1 opacity-50" size={12} />;
        }
        return <FaArrowDown className="inline ml-1 opacity-50" size={12} />;
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

                <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white">
                    ADD SMARTLINK
                </button>

            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">

                <div className="overflow-x-auto">

                <table className="w-full text-left min-w-[640px]">

                    <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm">

                        <tr>
                            <th className="p-4">
                                <button type="button" onClick={() => requestSort('name')} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                                    Name {getSortIcon('name')}
                                </button>
                            </th>
                            <th className="p-4">
                                <button type="button" onClick={() => requestSort('id')} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                                    ID {getSortIcon('id')}
                                </button>
                            </th>
                            <th className="p-4">
                                <button type="button" onClick={() => requestSort('status')} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                                    Status {getSortIcon('status')}
                                </button>
                            </th>
                            <th className="p-4"></th>
                        </tr>

                    </thead>

                    <tbody>
                        {sortedLinks.map((link) => (

                            <tr
                                key={link.id}
                                className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                            >

                                <td className="p-4">{link.name}</td>

                                <td className="p-4 text-gray-500 dark:text-gray-400">{link.id}</td>

                                <td className="p-4">

                                    <span
                                        className={`px-3 py-1 text-xs rounded-full ${link.status === "Active"
                                                ? "bg-green-600/20 text-green-400"
                                                : "bg-red-600/20 text-red-400"
                                            }`}
                                    >
                                        {link.status}
                                    </span>

                                </td>

                                <td className="p-4 flex gap-6 text-sm">

                                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                        STATISTICS
                                    </button>

                                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                        EDIT
                                    </button>

                                    <button className="text-green-400 hover:text-green-300">
                                        COPY LINK
                                    </button>

                                    {link.status === "Inactive" && (
                                        <button className="text-red-400 hover:text-red-300">
                                            REACTIVATE
                                        </button>
                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                </div>

                {/* Pagination */}
                <div className="flex justify-end items-center gap-6 p-4 border-t border-gray-200 dark:border-slate-700 text-sm text-gray-500 dark:text-gray-400">

                    <span>Rows per page: 10</span>
                    <span>1–5 of 5</span>

                </div>

            </div>

        </div>
    );
};

export default Smartlinks;