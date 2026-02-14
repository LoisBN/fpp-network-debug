import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // BUG 1: This URL has a typo - students need to find and fix it
  const API_URL = "https://jsonplaceholder.typicode.com/pots/1";

  async function fetchData() {
    // BUG 2: No error handling - students need to add try/catch
    setLoading(true);
    const response = await fetch(API_URL);
    const data = await response.json();
    setResult(JSON.stringify(data, null, 2));
    setLoading(false);
  }

  // BUG 3: This function doesn't handle the case when the network is offline
  async function fetchUserList() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    // BUG 4: Should display user names but displays the whole object
    setResult(users);
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Network Debug Lab</h1>
      <p className="text-gray-600 mb-6">
        Open your browser DevTools (F12) and use the Network tab to debug these API calls.
        Find and fix the bugs!
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Fetch Post
        </button>
        <button
          onClick={fetchUserList}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Fetch Users
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm">
        {result || "Click a button to fetch data. Watch the Network tab in DevTools!"}
      </pre>
    </div>
  );
}