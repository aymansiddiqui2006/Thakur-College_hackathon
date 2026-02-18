import { useState } from "react";

const typeIcons = {
  notes: "📝",
  "previous-paper": "📄",
  "research-paper": "🔬",
  syllabus: "📋",
  assignment: "✏️",
  other: "📁",
};

const branchNames = {
  cse: "Computer Science",
  ece: "Electronics",
  it: "Information Technology",
  me: "Mechanical",
  ce: "Civil",
  ee: "Electrical",
};

const yearNames = {
  1: "1st Year",
  2: "2nd Year",
  3: "3rd Year",
  4: "4th Year",
};

// ── Material Card ──────────────────────────────────────────────────────────
export function MaterialCard({ material, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeIcons[material.type] || "📁"}</span>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
              {material.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{material.fileName}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(material.id)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Upload Tab ─────────────────────────────────────────────────────────────
export default function Upload({ materials, onUpload, showToast }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", branch: "", year: "" });

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please select a file to upload", "error");
      return;
    }
    setUploading(true);
    const material = {
      id: Date.now().toString(),
      ...form,
      uploadDate: new Date().toISOString(),
      downloads: Math.floor(Math.random() * 100),
      fileName: selectedFile.name,
    };
    await new Promise((r) => setTimeout(r, 800));
    onUpload(material);
    setForm({ title: "", type: "", branch: "", year: "" });
    setSelectedFile(null);
    setUploading(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all";

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Upload Resources</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Upload notes, previous papers, research papers and other educational materials
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <form onSubmit={handleSubmit}>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input").click()}
              className={`rounded-xl p-8 text-center mb-6 cursor-pointer border-2 border-dashed transition-all duration-300 ${
                dragOver
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-300 dark:border-slate-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
              }`}
            >
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={(e) => e.target.files[0] && setSelectedFile(e.target.files[0])}
              />
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Drop files here or click to browse</p>
              {selectedFile && (
                <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 font-medium">📎 {selectedFile.name}</p>
              )}
            </div>

            {/* Form inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={inputClass}
              />
              <select
                required
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select Type</option>
                <option value="notes">Notes</option>
                <option value="previous-paper">Previous Paper</option>
                <option value="research-paper">Research Paper</option>
                <option value="syllabus">Syllabus</option>
                <option value="assignment">Assignment</option>
                <option value="other">Other</option>
              </select>
              <select
                required
                value={form.branch}
                onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select Branch</option>
                <option value="cse">CSE</option>
                <option value="ece">ECE</option>
                <option value="it">IT</option>
                <option value="me">ME</option>
                <option value="ce">CE</option>
                <option value="ee">EE</option>
              </select>
              <select
                required
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select Year</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
              </select>
            </div>

            <button type="submit" disabled={uploading} className="w-full py-3.5 bg-emerald-500 text-white rounded-xl">
              {uploading ? "Uploading..." : "Upload Resource"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
