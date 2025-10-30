import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useGetPrayerTimesQuery,
  useUpdatePrayerTimesMutation,
} from "../../redux/features/prayer_times/prayer_timesApi";
import toast from "react-hot-toast";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function PrayerTimeUpdate() {
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");

  const { data: times, isLoading } = useGetPrayerTimesQuery();
  const [updatePrayerTimes, { isLoading: localLoading }] =
    useUpdatePrayerTimesMutation();

  const [sunrise, setSunrise] = useState("");
  const [fajrStart, setFajrStart] = useState("");
  const [fajrJamat, setFajrJamat] = useState("");
  const [zuhrStart, setZuhrStart] = useState("");
  const [zuhrJamat, setZuhrJamat] = useState("");
  const [asrStart, setAsrStart] = useState("");
  const [asrJamat, setAsrJamat] = useState("");
  const [maghribStart, setMaghribStart] = useState("");
  const [maghribJamat, setMaghribJamat] = useState("");
  const [ishaStart, setIshaStart] = useState("");
  const [ishaJamat, setIshaJamat] = useState("");

  // Autofill fields when month & date selected
  useEffect(() => {
    if (month && date && times?.length > 0) {
      const day = times[0]?.[month]?.find(
        (d) => Number(d.date) === Number(date)
      );
      if (day) {
        setSunrise(day.sunrise || "");
        setFajrStart(day.fajr?.start || "");
        setFajrJamat(day.fajr?.jamat || "");
        setZuhrStart(day.zuhr?.start || "");
        setZuhrJamat(day.zuhr?.jamat || "");
        setAsrStart(day.asr?.start || "");
        setAsrJamat(day.asr?.jamat || "");
        setMaghribStart(day.maghrib?.start || "");
        setMaghribJamat(day.maghrib?.jamat || "");
        setIshaStart(day.isha?.start || "");
        setIshaJamat(day.isha?.jamat || "");
      }
    }
  }, [month, date, times]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      month,
      date: Number(date),
      updates: {
        sunrise,
        "fajr.start": fajrStart,
        "fajr.jamat": fajrJamat,
        "zuhr.start": zuhrStart,
        "zuhr.jamat": zuhrJamat,
        "asr.start": asrStart,
        "asr.jamat": asrJamat,
        "maghrib.start": maghribStart,
        "maghrib.jamat": maghribJamat,
        "isha.start": ishaStart,
        "isha.jamat": ishaJamat,
      },
    };

    try {
      await updatePrayerTimes(updatedData).unwrap();
      toast.success("Prayer time updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update prayer time.");
    }
  };

  const getDaysInMonth = (monthName) => {
    if (!monthName) return 0;
    const monthIndex = new Date(`${monthName} 1, 2025`).getMonth();
    return new Date(2025, monthIndex + 1, 0).getDate();
  };

  const dayCount = getDaysInMonth(month);

  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  return (
    <div>
      <h3 className={`fs-3 fw-bold text-center`}>Update Prayer Time</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        {/* basic details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Primary Details
        </div>

        {/* ===== Month Dropdown ===== */}
        <div className="col-md-4">
          <label className="form-label">Month</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="month"
            className="form-control"
            required
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setDate(""); // Reset date if month changes
            }}
          >
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>

        {/* ===== Date Dropdown ===== */}
        <div className="col-md-4">
          <label className="form-label">Date</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="date"
            className="form-control"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            <option value="">Select Date</option>
            {Array.from({ length: dayCount }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Zuhr Jamat Time Input ===== */}
        <div className="col-md-4">
          <label className="form-label">Sunrise</label>
          <input
            type="text"
            name="sunrise"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 6:00 AM"
            value={sunrise}
            onChange={(e) => setSunrise(e.target.value)}
            required
          />
        </div>
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Fajr
        </div>
        <div className="col-md-6">
          <label className="form-label">Fajr Start Time</label>
          <input
            type="text"
            name="fajr_start"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={fajrStart}
            onChange={(e) => setFajrStart(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Fajr Jamat Time</label>
          <input
            type="text"
            name="fajr_jamat"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={fajrJamat}
            onChange={(e) => setFajrJamat(e.target.value)}
            required
          />
        </div>
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Zuhr
        </div>
        <div className="col-md-6">
          <label className="form-label">Zuhr Start Time</label>
          <input
            type="text"
            name="zuhr_start"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={zuhrStart}
            onChange={(e) => setZuhrStart(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Zuhr Jamat Time</label>
          <input
            type="text"
            name="zuhr_jamat"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={zuhrJamat}
            onChange={(e) => setZuhrJamat(e.target.value)}
            required
          />
        </div>
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Asr
        </div>
        <div className="col-md-6">
          <label className="form-label">Asr Start Time</label>
          <input
            type="text"
            name="asr_start"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={asrStart}
            onChange={(e) => setAsrStart(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Asr Jamat Time</label>
          <input
            type="text"
            name="asr_jamat"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={asrJamat}
            onChange={(e) => setAsrJamat(e.target.value)}
            required
          />
        </div>
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Magrib
        </div>
        <div className="col-md-6">
          <label className="form-label">Magrib Start Time</label>
          <input
            type="text"
            name="magrib_start"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={maghribStart}
            onChange={(e) => setMaghribStart(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Magrib Jamat Time</label>
          <input
            type="text"
            name="magrib_jamat"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={maghribJamat}
            onChange={(e) => setMaghribJamat(e.target.value)}
            required
          />
        </div>
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Isha
        </div>
        <div className="col-md-6">
          <label className="form-label">Isha Start Time</label>
          <input
            type="text"
            name="isha_start"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={ishaStart}
            onChange={(e) => setIshaStart(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Isha Jamat Time</label>
          <input
            type="text"
            name="isha_jamat"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            placeholder="e.g. 1:00 PM"
            value={ishaJamat}
            onChange={(e) => setIshaJamat(e.target.value)}
            required
          />
        </div>

        {/* ===== Submit Button ===== */}
        <div className="col-12 text-center py-3">
          <button
            disabled={localLoading}
            type="submit"
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            {localLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
