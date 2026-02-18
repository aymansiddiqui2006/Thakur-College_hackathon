import { useState, useCallback } from "react";
import Upload from "./Upload"; 
const initialMaterials = [
  { id: 1, title: "DBMS Notes", type: "notes", branch: "cse", year: "2", downloads: 42, uploadDate: "2026-02-17", fileName: "dbms.pdf" },
  { id: 2, title: "Physics Paper", type: "previous-paper", branch: "me", year: "1", downloads: 18, uploadDate: "2026-02-16", fileName: "physics.pdf" },
];

export default function Home() {
  const [tab, setTab] = useState("materials"); // materials / stats / upload
  const [dark, setDark] = useState(false);
  const [materials, setMaterials] = useState(initialMaterials);

  const showToast = useCallback((msg, type = "success") => {
    alert(`${type.toUpperCase()}: ${msg}`);
  }, []);

  const toggleDark = () => {
    setDark((d) => {
      const next = !d;
      if (next) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  };

  const handleUpload = (material) => {
    setMaterials((m) => [...m, material]);
    showToast("Resource uploaded successfully!");
  };

  // ── Materials Tab ───────────────────────────────────────────────
  const MaterialsTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Materials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <div key={m.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">{m.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{m.type.replace("-", " ")}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{m.branch.toUpperCase()} - Year {m.year}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Downloads: {m.downloads}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded: {m.uploadDate}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">File: {m.fileName}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Stats Tab ───────────────────────────────────────────────
  const StatsTab = () => {
    const totalMaterials = materials.length;
    const totalDownloads = materials.reduce((sum, m) => sum + m.downloads, 0);
    const byType = materials.reduce((acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + 1;
      return acc;
    }, {});

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Materials</h3>
            <p className="text-3xl font-bold">{totalMaterials}</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Downloads</h3>
            <p className="text-3xl font-bold">{totalDownloads}</p>
          </div>
          {Object.keys(byType).map((type) => (
            <div key={type} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">{type.replace("-", " ")}</h3>
              <p className="text-2xl font-bold">{byType[type]}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 p-6 border-r border-gray-200 dark:border-slate-700">
        <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Admin Panel</h1>
        <ul className="space-y-2">
          <li
            onClick={() => setTab("materials")}
            className={`cursor-pointer p-2 rounded ${tab === "materials" ? "bg-emerald-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
          >
            Materials
          </li>
          <li
            onClick={() => setTab("stats")}
            className={`cursor-pointer p-2 rounded ${tab === "stats" ? "bg-emerald-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
          >
            Stats
          </li>
          <li
            onClick={() => setTab("upload")}
            className={`cursor-pointer p-2 rounded ${tab === "upload" ? "bg-emerald-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
          >
            Upload
          </li>
        </ul>

        <button
          onClick={toggleDark}
          className="mt-6 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded w-full"
        >
          Toggle Dark Mode
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {tab === "materials" && <MaterialsTab />}
        {tab === "stats" && <StatsTab />}
        {tab === "upload" && <UploadPage materials={materials} onUpload={handleUpload} showToast={showToast} />}
      </main>
    </div>
  );
}
