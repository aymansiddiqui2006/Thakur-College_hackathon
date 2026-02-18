function Student() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Top Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-slate-800 border-b border-slate-700">
        <div>
          <h1 className="text-xl font-bold">EduPortal</h1>
          <p className="text-sm text-gray-400">Student Dashboard</p>
        </div>

        <button className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-500 to-blue-500 font-medium hover:opacity-90">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <section className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Student 👋</h2>
          <p className="text-gray-400">
            Search and access study materials uploaded by faculty
          </p>
        </section>

        {/* Search Card */}
        <section className="bg-slate-800 rounded-xl p-6 shadow-lg mb-12">
          <input
            type="text"
            placeholder="Search notes, PDFs, lectures, presentations..."
            className="w-full px-4 py-3 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </section>

        {/* Resources */}
        <section>
          <h3 className="text-2xl font-semibold mb-6">Available Resources</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1 */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-teal-500 transition">
              <h4 className="text-lg font-semibold mb-1">
                AI in Smart Campuses
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Type: Research Paper
              </p>
              <button className="text-sm text-teal-400 hover:underline">
                View / Download
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-teal-500 transition">
              <h4 className="text-lg font-semibold mb-1">
                Machine Learning Unit 3
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Type: Video Lecture
              </p>
              <button className="text-sm text-teal-400 hover:underline">
                View / Download
              </button>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Student;