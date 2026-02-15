import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function ContentPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const fetched = useRef(false);

  // 1️⃣ Get content info
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch(`http://localhost:5000/api/content/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Invalid or expired link");
        return res.json();
      })
      .then(data => setData(data))
      .catch(err => setError(err.message));
  }, [id]);

  // 2️⃣ Destroy one-time TEXT after it is shown
  useEffect(() => {
    if (!data) return;

    if (data.type === "text" && data.oneTime) {
      fetch(`http://localhost:5000/api/content/${id}`, {
        method: "DELETE",
      });
    }
  }, [data, id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  // TEXT VIEW
  if (data.type === "text") {
    const copyText = async () => {
      await navigator.clipboard.writeText(data.content);
      alert("Copied!");
    };

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
            📄 Shared Text
          </h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 whitespace-pre-wrap text-gray-800">
            {data.content}
          </div>

          <button
            onClick={copyText}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    );
  }

  // FILE VIEW
  if (data.type === "file") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            File Ready to Download
          </h2>

          <a
            href={`http://localhost:5000/api/download/${id}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Download {data.fileName}
          </a>
        </div>
      </div>
    );
  }

  return null;
}

export default ContentPage;
