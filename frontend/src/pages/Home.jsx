import { useState, useRef } from "react";

function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [expiryMinutes, setExpiryMinutes] = useState("");
  const [oneTime, setOneTime] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null); // ⭐ important fix

  const handleUpload = async () => {
    if (!text && !file) {
      alert("Please provide either text or a file.");
      return;
    }

    if (text && file) {
      alert("Upload either text or file, not both.");
      return;
    }

    setLoading(true);

    try {
      let response;

      // TEXT UPLOAD
      if (text) {
        response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, expiryMinutes, oneTime }),
        });
      } 
      // FILE UPLOAD
      else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("oneTime", oneTime);

        if (expiryMinutes) {
          formData.append("expiryMinutes", expiryMinutes);
        }

        response = await fetch("http://localhost:5000/api/upload/file", {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Upload failed");
      } else {
        const id = data.link.split("/").pop();
        setGeneratedId(id);

        // reset form properly
        setText("");
        setFile(null);
        setExpiryMinutes("");
        setOneTime(false);
        if (fileInputRef.current) fileInputRef.current.value = ""; // ⭐ clears browser file memory
      }
    } catch (error) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl border border-gray-200">

        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          🔐 LinkVault
        </h1>

        {/* TEXT AREA */}
        <textarea
          placeholder="Enter text to share..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-4 mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <div className="flex items-center gap-3 my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* FILE INPUT */}
      <div className="mb-5">
        <span className="block text-sm font-medium text-gray-600 mb-2">
          Upload a file
        </span>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-gray-600"
          />

          {file && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // ⭐ prevent file dialog
                setFile(null);
                fileInputRef.current.value = "";
              }}
              className="text-red-500 text-sm underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>


        {/* EXPIRY */}
        <input
          type="number"
          placeholder="Expiry in minutes (default 10)"
          value={expiryMinutes}
          onChange={(e) => setExpiryMinutes(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        {/* ONE TIME */}
        <label className="flex items-center gap-2 mb-6 text-indigo-700">
          <input
            type="checkbox"
            checked={oneTime}
            onChange={(e) => setOneTime(e.target.checked)}
          />
          Self-destruct after first open
        </label>

        {/* SUBMIT */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
        >
          {loading ? "Uploading..." : "Generate Secure Link"}
        </button>

        {/* LINK RESULT */}
        {generatedId && (
          <div className="mt-8 bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
            <p className="font-semibold text-indigo-700 mb-2">
              🔗 Share this link:
            </p>

            <div className="flex items-center gap-2">
              <a
                href={`/${generatedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline break-all flex-1"
              >
                {window.location.origin}/{generatedId}
              </a>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/${generatedId}`
                  )
                }
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
              >
                Copy
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;
