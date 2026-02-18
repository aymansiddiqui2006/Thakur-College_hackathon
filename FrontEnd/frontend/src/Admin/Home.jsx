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

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
      <div style={{
        padding: "12px 20px", borderRadius: 12, color: "#fff", fontWeight: 600,
        background: toast.type === "error" ? "#ef4444" : "linear-gradient(135deg, #10b981, #3b82f6)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 8
      }}>
        {toast.type === "error" ? "✕" : "✓"} {toast.message}
      </div>
    </div>
  );
}

function UploadTab({ onUpload, showToast }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", branch: "", year: "" });

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #2d3748",
    background: "#1a2332", color: "#e2e8f0", fontSize: 13, outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box"
  };

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
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Upload Resource</h2>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Add a new educational material to the library</p>
      </div>
      <div style={{ background: "#0f1923", borderRadius: 16, border: "1px solid #1e2d3d", padding: 24 }}>
        <form onSubmit={handleSubmit}>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && setFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById("file-inp").click()}
            style={{
              border: `2px dashed ${dragOver ? "#3b82f6" : "#2d3748"}`,
              borderRadius: 12, padding: "32px 20px", textAlign: "center", cursor: "pointer",
              background: dragOver ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.01)",
              transition: "all 0.2s", marginBottom: 20
            }}
          >
            <input type="file" id="file-inp" style={{ display: "none" }} accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={e => e.target.files[0] && setFile(e.target.files[0])} />
            <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
            <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, margin: 0 }}>Drop file here or click to browse</p>
            <p style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>PDF, DOC, DOCX, PPT, TXT</p>
            {file && <p style={{ color: "#10b981", fontSize: 13, fontWeight: 600, marginTop: 8 }}>📎 {file.name}</p>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Title</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Data Structures Notes" style={inputStyle} />
            </div>
            {[
              { key: "type", label: "Type", opts: [["notes","📝 Notes"],["previous-paper","📄 Previous Year Paper"],["research-paper","🔬 Research Paper"],["syllabus","📋 Syllabus"],["assignment","✏️ Assignment"],["other","📁 Other"]] },
              { key: "branch", label: "Branch", opts: [["cse","💻 Computer Science"],["ece","📡 Electronics"],["it","🌐 IT"],["me","⚙️ Mechanical"],["ce","🏗️ Civil"],["ee","⚡ Electrical"]] },
              { key: "year", label: "Year", opts: [["1","1st Year"],["2","2nd Year"],["3","3rd Year"],["4","4th Year"]] },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{label}</label>
                <select required value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle}>
                  <option value="">Select {label.toLowerCase()}</option>
                  {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>

          <button type="submit" disabled={uploading} style={{
            width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: uploading ? "not-allowed" : "pointer",
            background: "linear-gradient(135deg, #10b981, #3b82f6)", color: "#fff", fontWeight: 600, fontSize: 14,
            opacity: uploading ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            {uploading ? "⏳ Uploading..." : "⬆ Upload Resource"}
          </button>
        </form>
      </div>
    </div>
  );
}

function MaterialsTab({ materials, onDelete }) {
  const [filterBranch, setFilterBranch] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const filtered = materials
    .filter(m => !filterBranch || m.branch === filterBranch)
    .filter(m => !filterYear || String(m.year) === filterYear);

  const selectStyle = {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #2d3748",
    background: "#1a2332", color: "#94a3b8", fontSize: 13, outline: "none"
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Materials Library</h2>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{filtered.length} resource{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} style={selectStyle}>
            <option value="">All Branches</option>
            <option value="cse">CSE</option><option value="ece">ECE</option>
            <option value="it">IT</option><option value="me">ME</option>
            <option value="ce">CE</option><option value="ee">EE</option>
          </select>
          <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={selectStyle}>
            <option value="">All Years</option>
            <option value="1">Year 1</option><option value="2">Year 2</option>
            <option value="3">Year 3</option><option value="4">Year 4</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#475569" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontWeight: 500 }}>No materials found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, overflowY: "auto" }}>
          {filtered.map(m => (
            <div key={m.id} style={{
              background: "#0f1923", borderRadius: 14, border: "1px solid #1e2d3d",
              padding: 18, transition: "all 0.2s", position: "relative"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
                  }}>
                    {typeIcons[m.type] || "📁"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 13 }}>{m.title}</div>
                    <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{m.fileName}</div>
                  </div>
                </div>
                {onDelete && (
                  <button onClick={() => onDelete(m.id)} style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: "#475569", padding: 4, borderRadius: 6, lineHeight: 1
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#475569"; e.currentTarget.style.background = "transparent"; }}
                  >✕</button>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                <span style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(59,130,246,0.1)", color: "#60a5fa", fontSize: 11, fontWeight: 500 }}>
                  {branchNames[m.branch] || m.branch}
                </span>
                <span style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(16,185,129,0.1)", color: "#34d399", fontSize: 11, fontWeight: 500 }}>
                  Year {m.year}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #1e2d3d" }}>
                <span style={{ color: "#475569", fontSize: 11 }}>{m.uploadDate}</span>
                <span style={{ color: "#64748b", fontSize: 11, fontWeight: 500 }}>⬇ {m.downloads}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatsTab({ materials }) {
  const totalDownloads = materials.reduce((s, m) => s + m.downloads, 0);
  const byType = materials.reduce((acc, m) => { acc[m.type] = (acc[m.type] || 0) + 1; return acc; }, {});
  const byBranch = materials.reduce((acc, m) => { acc[m.branch] = (acc[m.branch] || 0) + 1; return acc; }, {});
  const maxBranch = Math.max(...Object.values(byBranch), 1);

  const cards = [
    { label: "Total Resources", value: materials.length, icon: "📚", color: "#3b82f6" },
    { label: "Total Downloads", value: totalDownloads, icon: "⬇️", color: "#10b981" },
    { label: "Resource Types", value: Object.keys(byType).length, icon: "🗂️", color: "#06b6d4" },
    { label: "Branches Covered", value: Object.keys(byBranch).length, icon: "🎓", color: "#14b8a6" },
  ];

  const barColors = ["#3b82f6", "#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Statistics</h2>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Overview of all uploaded resources</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {cards.map(({ label, value, icon, color }) => (
          <div key={label} style={{
            background: "#0f1923", borderRadius: 14, border: "1px solid #1e2d3d", padding: 18,
            transition: "transform 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10, marginBottom: 12,
              background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
            }}>{icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9" }}>{value}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "#0f1923", borderRadius: 14, border: "1px solid #1e2d3d", padding: 20 }}>
          <h3 style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Resources by Branch</h3>
          {Object.keys(byBranch).length === 0 ? (
            <p style={{ color: "#475569", fontSize: 13 }}>No data</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(byBranch).sort((a, b) => b[1] - a[1]).map(([branch, count], i) => (
                <div key={branch} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 32, fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>{branch}</span>
                  <div style={{ flex: 1, height: 8, background: "#1e2d3d", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      background: barColors[i % barColors.length],
                      width: `${(count / maxBranch) * 100}%`,
                      transition: "width 0.6s ease"
                    }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", width: 16, textAlign: "right" }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: "#0f1923", borderRadius: 14, border: "1px solid #1e2d3d", padding: 20 }}>
          <h3 style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Resources by Type</h3>
          {Object.keys(byType).length === 0 ? (
            <p style={{ color: "#475569", fontSize: 13 }}>No data</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {Object.entries(byType).map(([type, count]) => (
                <div key={type} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 10, background: "#1a2332"
                }}>
                  <span style={{ fontSize: 20 }}>{typeIcons[type] || "📁"}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{count}</div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "capitalize" }}>{type.replace("-", " ")}</div>
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

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#0a1628", border: "1px solid #1e2d3d", borderRadius: 16,
        padding: 28, width: 320, boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        textAlign: "center"
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", margin: "0 auto 16px",
          background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
        }}>🚪</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Sign Out?</div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.5 }}>
          Are you sure you want to log out of EduAdmin?
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #2d3748",
            background: "#0f1923", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(239,68,68,0.3)"
          }}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState("materials");
  const [dark, setDark] = useState(true);
  const [materials, setMaterials] = useState(initialMaterials);
  const [toast, setToast] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

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
    { id: "stats", label: "Statistics", icon: "📊" },
    { id: "upload", label: "Upload", icon: "⬆️" },
  ];

  const tabTitles = {
    materials: "Materials Library",
    stats: "Statistics & Analytics",
    upload: "Upload Resource"
  };

  return (
    <div style={{
      display: "flex", width: "100vw", height: "100vh", overflow: "hidden",
      background: "#060d14", fontFamily: "'Segoe UI', system-ui, sans-serif", boxSizing: "border-box"
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, minWidth: 220, height: "100%", background: "#0a1628",
        borderRight: "1px solid #1e2d3d", display: "flex", flexDirection: "column",
        boxShadow: "4px 0 20px rgba(0,0,0,0.3)"
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #1e2d3d" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #10b981, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 14,
              boxShadow: "0 4px 12px rgba(16,185,129,0.4)"
            }}>E</div>
            <div>
              <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 13 }}>EduAdmin</div>
              <div style={{ color: "#475569", fontSize: 11 }}>Resource Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              textAlign: "left", fontSize: 13, fontWeight: 500, marginBottom: 4,
              transition: "all 0.15s",
              background: tab === id ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.12))" : "transparent",
              color: tab === id ? "#60a5fa" : "#64748b",
              borderLeft: tab === id ? "2px solid #3b82f6" : "2px solid transparent"
            }}>
              <span style={{ fontSize: 15 }}>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              {id === "materials" && (
                <span style={{
                  background: "rgba(59,130,246,0.2)", color: "#60a5fa",
                  fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5
                }}>{materials.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid #1e2d3d" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))",
            borderRadius: 10, padding: 12, marginBottom: 10, border: "1px solid #1e2d3d"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#64748b" }}>Storage</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>35%</span>
            </div>
            <div style={{ height: 4, background: "#1e2d3d", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "35%", background: "linear-gradient(90deg, #10b981, #3b82f6)", borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: "#475569", marginTop: 5 }}>3.5 GB / 10 GB</div>
          </div>

          <button onClick={() => setDark(d => !d)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 12px", borderRadius: 10, border: "1px solid #1e2d3d",
            background: "#0f1923", color: "#64748b", fontSize: 12, fontWeight: 500, cursor: "pointer",
            marginBottom: 8
          }}>
            <span>{dark ? "☀️ Light" : "🌙 Dark"}</span>
            <div style={{
              width: 32, height: 18, borderRadius: 9, background: dark ? "#3b82f6" : "#2d3748",
              display: "flex", alignItems: "center", padding: "0 2px", transition: "background 0.2s"
            }}>
              <div style={{
                width: 14, height: 14, background: "#fff", borderRadius: "50%",
                transform: dark ? "translateX(14px)" : "none", transition: "transform 0.2s"
              }} />
            </div>
          </button>

          <button onClick={() => setShowLogoutModal(true)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.2)",
            background: "rgba(239,68,68,0.06)", color: "#f87171", fontSize: 12, fontWeight: 600,
            cursor: "pointer", transition: "all 0.15s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.14)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
          >
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Header */}
        <header style={{
          background: "#0a1628", borderBottom: "1px solid #1e2d3d",
          padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 14 }}>{tabTitles[tab]}</div>
            <div style={{ color: "#475569", fontSize: 11, marginTop: 1 }}>EduAdmin Dashboard</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{
              position: "relative", background: "#0f1923", border: "1px solid #1e2d3d",
              borderRadius: 10, padding: "7px 9px", cursor: "pointer", color: "#64748b", lineHeight: 1
            }}>
              🔔
              <span style={{
                position: "absolute", top: 6, right: 6, width: 6, height: 6,
                background: "#ef4444", borderRadius: "50%"
              }} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 12, borderLeft: "1px solid #1e2d3d" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 700
              }}>DA</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>Dr. Admin</div>
                <div style={{ fontSize: 10, color: "#475569" }}>Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{
          flex: 1, overflow: "auto", padding: 24,
          background: "#060d14"
        }}>
          {tab === "materials" && <MaterialsTab materials={materials} onDelete={handleDelete} />}
          {tab === "stats" && <StatsTab materials={materials} />}
          {tab === "upload" && <UploadTab onUpload={handleUpload} showToast={showToast} />}
        </main>
      </div>

      <Toast toast={toast} />
      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { setShowLogoutModal(false); showToast("You have been logged out"); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}
