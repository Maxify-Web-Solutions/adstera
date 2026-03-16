import React, { useState } from "react";

const ApiPage = () => {

  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  const generateToken = () => {
    const newToken =
      "sk_" + Math.random().toString(36).substring(2) + Date.now();
    setToken(newToken);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    alert("Token copied!");
  };

  const revokeToken = () => {
    setToken("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Page Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          API Access
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Generate and manage your API token to connect external applications.
        </p>
      </div>

      {/* API Card */}
      <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          API Token
        </h2>

        {!token ? (
          <button
            onClick={generateToken}
            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Generate API Token
          </button>
        ) : (

          <div className="space-y-4">

            {/* Token Field */}
            <div className="flex flex-col md:flex-row gap-3">

              <input
                type={showToken ? "text" : "password"}
                value={token}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg border bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-sm"
              />

              <button
                onClick={() => setShowToken(!showToken)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {showToken ? "Hide" : "Show"}
              </button>

              <button
                onClick={copyToken}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Copy
              </button>

            </div>

            {/* Revoke Button */}
            <button
              onClick={revokeToken}
              className="text-red-500 hover:text-red-400 text-sm"
            >
              Revoke Token
            </button>

          </div>

        )}

      </div>

      {/* API Usage Guide */}
      <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          API Usage
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Use your API token to authenticate requests to our API.
        </p>

        <pre className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">
{`curl https://api.yoursite.com/leads
  -H "Authorization: Bearer YOUR_API_TOKEN"`}
        </pre>

      </div>

    </div>
  );
};

export default ApiPage;