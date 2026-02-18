import { useState, useCallback } from "react";

const typeIcons = {
  notes: "📝",
  "previous-paper": "📄",
  "research-paper": "🔬",
  syllabus: "📋",
  assignment: "✏️",
  other: "📁",
};

const branchNames = {
  cse: "Computer Science", ece: "Electronics", it: "Information Technology",
  me: "Mechanical", ce: "Civil", ee: "Electrical",
};

const initialMaterials = [
  { id: 1, title: "DBMS Notes", type: "notes", branch: "cse", year: "2", downloads: 42, uploadDate: "2026-02-17", fileName: "dbms.pdf" },
  { id: 2, title: "Physics Paper", type: "previous-paper", branch: "me", year: "1", downloads: 18, uploadDate: "2026-02-16", fileName: "physics.pdf" },
];

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-once">
      <div className={`px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-white font-medium ${toast.type === "error" ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-blue-500"}`}>
        {toast.type === "error"
          ? <span>✕</span>
          : <span>✓</span>}
        {toast.message}
      </div>
    </div>
  );
}

// ── Upload Tab ─────────────────────────────────────────────────────────────
function UploadTab({ onUpload, showToast }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", branch: "", year: "" });

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { showToast("Please select a file", "error"); return; }
    setUploading(true);
    await new Promise(r => setTimeout(r, 800));
    onUpload({ id: Date.now(), ...form, uploadDate: new Date().toISOString().split("T")[0], downloads: 0, fileName: file.name });
    setForm({ title: "", type: "", branch: "", year: "" });
    setFile(null);
    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Resource</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a new educational material to the library</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && setFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById("file-inp").click()}
            className={`rounded-xl p-8 text-center cursor-pointer border-2 border-dashed transition-all duration-200 ${
              dragOver ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-slate-600 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
            }`}
          >
            <input type="file" id="file-inp" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={e => e.target.files[0] && setFile(e.target.files[0])} />
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 flex items-center justify-center text-2xl">
              📂
            </div>
            <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">Drop file here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, PPT, TXT</p>
            {file && <p className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">📎 {file.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Title</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Data Structures Notes" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Type</label>
              <select required value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputClass}>
                <option value="">Select type</option>
                <option value="notes">📝 Notes</option>
                <option value="previous-paper">📄 Previous Year Paper</option>
                <option value="research-paper">🔬 Research Paper</option>
                <option value="syllabus">📋 Syllabus</option>
                <option value="assignment">✏️ Assignment</option>
                <option value="other">📁 Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Branch</label>
              <select required value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} className={inputClass}>
                <option value="">Select branch</option>
                <option value="cse">💻 Computer Science</option>
                <option value="ece">📡 Electronics</option>
                <option value="it">🌐 Information Technology</option>
                <option value="me">⚙️ Mechanical</option>
                <option value="ce">🏗️ Civil</option>
                <option value="ee">⚡ Electrical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Year</label>
              <select required value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className={inputClass}>
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={uploading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-60 text-white font-semibold transition-all shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 flex items-center justify-center gap-2">
            {uploading ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Uploading...</>
            ) : (
              <><span>⬆</span> Upload Resource</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Materials Tab ──────────────────────────────────────────────────────────
function MaterialsTab({ materials, onDelete }) {
  const [filterBranch, setFilterBranch] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const filtered = materials
    .filter(m => !filterBranch || m.branch === filterBranch)
    .filter(m => !filterYear || String(m.year) === filterYear);

  const selectClass = "px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-400 outline-none";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Materials Library</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{filtered.length} resource{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <div className="flex gap-2">
          <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className={selectClass}>
            <option value="">All Branches</option>
            <option value="cse">CSE</option><option value="ece">ECE</option>
            <option value="it">IT</option><option value="me">ME</option>
            <option value="ce">CE</option><option value="ee">EE</option>
          </select>
          <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className={selectClass}>
            <option value="">All Years</option>
            <option value="1">Year 1</option><option value="2">Year 2</option>
            <option value="3">Year 3</option><option value="4">Year 4</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <div className="text-5xl mb-3">📭</div>
          <p className="font-medium">No materials found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/30 dark:to-emerald-900/30 flex items-center justify-center text-xl">
                    {typeIcons[m.type] || "📁"}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{m.title}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{m.fileName}</p>
                  </div>
                </div>
                {onDelete && (
                  <button onClick={() => onDelete(m.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                  {branchNames[m.branch] || m.branch}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  Year {m.year}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-700">
                <span className="text-xs text-gray-400 dark:text-gray-500">{m.uploadDate}</span>
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {m.downloads}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Stats Tab ──────────────────────────────────────────────────────────────
function StatsTab({ materials }) {
  const totalDownloads = materials.reduce((s, m) => s + m.downloads, 0);
  const byType = materials.reduce((acc, m) => { acc[m.type] = (acc[m.type] || 0) + 1; return acc; }, {});
  const byBranch = materials.reduce((acc, m) => { acc[m.branch] = (acc[m.branch] || 0) + 1; return acc; }, {});
  const maxBranch = Math.max(...Object.values(byBranch), 1);

  const overviewCards = [
    { label: "Total Resources", value: materials.length, icon: "📚", grad: "from-blue-500 to-blue-600" },
    { label: "Total Downloads", value: totalDownloads,   icon: "⬇️", grad: "from-emerald-500 to-emerald-600" },
    { label: "Resource Types",  value: Object.keys(byType).length, icon: "🗂️", grad: "from-sky-500 to-blue-500" },
    { label: "Branches Covered",value: Object.keys(byBranch).length, icon: "🎓", grad: "from-teal-500 to-emerald-500" },
  ];

  const typeColors = ["bg-blue-400", "bg-emerald-400", "bg-sky-400", "bg-teal-400", "bg-indigo-400", "bg-cyan-400"];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Overview of all uploaded resources</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {overviewCards.map(({ label, value, icon, grad }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-lg mb-3`}>{icon}</div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* By Branch */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Resources by Branch</h3>
          {Object.keys(byBranch).length === 0 ? (
            <p className="text-gray-400 text-sm">No data</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(byBranch).sort((a, b) => b[1] - a[1]).map(([branch, count], i) => (
                <div key={branch} className="flex items-center gap-3">
                  <span className="w-8 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{branch}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${typeColors[i % typeColors.length]}`}
                      style={{ width: `${(count / maxBranch) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Type */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Resources by Type</h3>
          {Object.keys(byType).length === 0 ? (
            <p className="text-gray-400 text-sm">No data</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(byType).map(([type, count], i) => (
                <div key={type} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                  <span className="text-xl">{typeIcons[type] || "📁"}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{type.replace("-", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState("materials");
  const [dark, setDark] = useState(false);
  const [materials, setMaterials] = useState(initialMaterials);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Applies dark to <html> so Tailwind dark: classes activate
  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      if (next) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  };

  const handleUpload = (material) => {
    setMaterials(m => [...m, material]);
    showToast("Resource uploaded successfully!");
    setTab("materials");
  };

  const handleDelete = (id) => {
    setMaterials(m => m.filter(x => x.id !== id));
    showToast("Resource deleted");
  };

  const navItems = [
    { id: "materials", label: "Materials", icon: "🗂️" },
    { id: "stats",     label: "Statistics", icon: "📊" },
    { id: "upload",    label: "Upload",     icon: "⬆️" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-200 dark:shadow-emerald-900/40">
              E
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">EduAdmin</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Resource Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-150 ${
                tab === id
                  ? "bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}>
              <span className="text-base">{icon}</span>
              {label}
              {id === "materials" && (
                <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-md font-semibold">{materials.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700 space-y-3">
          {/* Storage bar */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-xs text-gray-500 dark:text-gray-400">Storage</p>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">35%</p>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full" style={{ width: "35%" }} />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">3.5 GB / 10 GB</p>
          </div>

          {/* Dark mode toggle */}
          <button onClick={toggleDark}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors">
            <span>{dark ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
            <div className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${dark ? "bg-blue-500" : "bg-gray-300"}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${dark ? "translate-x-4" : "translate-x-0"}`} />
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white capitalize text-sm">
              {tab === "upload" ? "Upload Resource" : tab === "stats" ? "Statistics & Analytics" : "Materials Library"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">EduAdmin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">DA</div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-800 dark:text-white">Dr. Admin</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-slate-900">
          {tab === "materials" && <MaterialsTab materials={materials} onDelete={handleDelete} />}
          {tab === "stats"     && <StatsTab materials={materials} />}
          {tab === "upload"    && <UploadTab onUpload={handleUpload} showToast={showToast} />}
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
