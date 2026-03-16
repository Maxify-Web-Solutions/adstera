import React from "react";

const Statistics = () => {
  return (
    <div className="space-y-10">

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">

        <h2 className="text-gray-900 dark:text-white font-semibold mb-6">Filters</h2>

        <div className="grid md:grid-cols-4 gap-6">

          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
              Date range
            </label>
            <input
              type="text"
              defaultValue="2026/03/09 – 2026/03/13"
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-300"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
              Country
            </label>
            <select className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-300">
              <option>All countries</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
              Domain
            </label>
            <select className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-300">
              <option>All Domains</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
              Placement
            </label>
            <select className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-300">
              <option>All Placements</option>
            </select>
          </div>

        </div>

        <div className="flex gap-4 mt-6">

          <button className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg text-white dark:bg-slate-700 dark:hover:bg-slate-600">
            APPLY
          </button>

          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            RESET
          </button>

        </div>

      </div>

      {/* Group By */}
      <div>

        <h2 className="text-gray-900 dark:text-white font-semibold mb-4">Group by</h2>

        <div className="flex flex-wrap gap-2">

          {[
            "DATE",
            "DOMAIN",
            "PLACEMENT",
            "COUNTRY",
            "DEVICE FORMAT",
            "OPERATING SYSTEM",
            "BROWSER",
          ].map((item, index) => (

            <button
              key={index}
              className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 text-sm ${
                index === 0
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">

        {/* Export */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">

          <button className="text-green-400 text-sm hover:text-green-300">
            EXPORT CSV
          </button>

        </div>

        <div className="overflow-x-auto">
          {/* Table */}
          <table className="w-full text-left min-w-[640px]">

            <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm">

              <tr>

                <th className="p-4">Date</th>
                <th className="p-4">Impressions</th>
                <th className="p-4">Clicks</th>
                <th className="p-4">CTR</th>
                <th className="p-4">CPM</th>
                <th className="p-4">Revenue</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-t border-gray-200 dark:border-slate-700">

                <td className="p-4">2026/03/13</td>
                <td className="p-4">0</td>
                <td className="p-4">0</td>
                <td className="p-4">0%</td>
                <td className="p-4">$0</td>
                <td className="p-4">$0</td>

              </tr>

              <tr className="border-t border-gray-200 dark:border-slate-700 font-semibold">

                <td className="p-4">Total:</td>
                <td className="p-4">0</td>
                <td className="p-4">0</td>
                <td className="p-4">0%</td>
                <td className="p-4">$0</td>
                <td className="p-4">$0</td>

              </tr>

            </tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-6 p-4 border-t border-gray-200 dark:border-slate-700 text-sm text-gray-500 dark:text-gray-400">

          <span>Rows per page: 10</span>
          <span>1–1 of 1</span>

        </div>

      </div>

      {/* Footer note */}
      <p className="text-center text-sm text-gray-400 dark:text-gray-500">
        For more information about how to use statistics see our Help Center
      </p>

    </div>
  );
};

export default Statistics;