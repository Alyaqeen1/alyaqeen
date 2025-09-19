export default function QuranQaidahForm({ quranOption, setQuranOption }) {
  return (
    <div className="border rounded p-3 mb-4">
      <h6 className="fw-bold mb-3">Quran / Qaidah</h6>

      {/* Select Option */}
      <div className="mb-3">
        <label className="form-label">Select Option</label>
        <select
          className="form-control"
          value={quranOption}
          onChange={(e) => setQuranOption(e.target.value)}
        >
          <option value="">Select</option>
          <option value="quran">Quran</option>
          <option value="qaidah">Qaidah</option>
          <option value="tajweed">Tajweed</option>
          <option value="hifz">Hifz</option>
        </select>
      </div>

      {/* Quran / Hifz Fields */}
      {["quran", "hifz"].includes(quranOption) && (
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Juz (Para)</label>
            <input
              type="number"
              className="form-control"
              name="quran_hifz_para"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Page</label>
            <input
              type="number"
              className="form-control"
              name="quran_hifz_page"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Line (Optional)</label>
            <input
              type="number"
              className="form-control"
              name="quran_hifz_line"
            />
          </div>
        </div>
      )}

      {/* Qaidah / Tajweed Fields */}
      {["qaidah", "tajweed"].includes(quranOption) && (
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Level</label>
            <select
              className="form-control"
              name="qaidah_tajweed_level"
              required
            >
              <option value="">Select Level</option>
              {quranOption === "qaidah"
                ? Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={`level${i + 1}`}>
                      Level {i + 1}
                    </option>
                  ))
                : Array.from({ length: 8 }, (_, i) => (
                    <option key={i} value={`level${i + 1}`}>
                      Level {i + 1}
                    </option>
                  ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Lesson Name</label>
            <input
              type="text"
              className="form-control"
              name="qaidah_tajweed_lesson_name"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Page</label>
            <input
              type="number"
              className="form-control"
              name="qaidah_tajweed_page"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Line</label>
            <input
              type="number"
              className="form-control"
              name="qaidah_tajweed_line"
              required
            />
          </div>
        </div>
      )}
    </div>
  );
}
