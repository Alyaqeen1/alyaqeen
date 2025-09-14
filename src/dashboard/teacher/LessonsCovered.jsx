import React, { useState } from "react";
import { useGetClassByParamsQuery } from "../../redux/features/classes/classesApi";
import { useGetStudentsByGroupQuery } from "../../redux/features/students/studentsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import useAuth from "../../hooks/useAuth";
import {
  useGetTeacherByEmailQuery,
  useGetTeacherWithDetailsQuery,
} from "../../redux/features/teachers/teachersApi";
import toast from "react-hot-toast";
import {
  useAddLessonCoveredMutation,
  useGetLessonsCoveredMonthlySummaryQuery,
  useGetLessonsCoveredQuery,
  useGetTeacherStudentsProgressQuery,
} from "../../redux/features/lessons_covered/lessons_coveredApi";
import LessonCoveredSummary from "../shared/LessonCoveredSummary";
import LessonCoveredTable from "./LessonCoveredTable";

export default function LessonsCovered() {
  const { user } = useAuth();

  // ── INPUT STATES ──
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [time, setTime] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [time_of_month, setTime_of_month] = useState("");
  const [book_name, setBook_name] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const [month, setMonth] = useState(currentMonth);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [filterMonth, setFilterMonth] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [addLessonCovered] = useAddLessonCoveredMutation();
  const [type, setType] = useState("");

  // Get all lessons covered by this teacher by default

  // ── APPLIED FILTER STATES ──
  const [appliedFilters, setAppliedFilters] = useState({
    department: "",
    session: "",
    time: "",
    classId: "",
    subjectId: "",
  });

  // ── APPLY FILTER HANDLER ──
  const handleApplyFilters = () => {
    setAppliedFilters({ department, session, time, classId, subjectId });
    setIsEditMode(!isEditMode); // enable form display
  };

  // ── QUERIES ──
  const { data: teacher } = useGetTeacherByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  const { data: teacherWithDetails } = useGetTeacherWithDetailsQuery(
    teacher?._id,
    {
      skip: !teacher?._id,
    }
  );

  const { data: lessonsCovered = [] } = useGetTeacherStudentsProgressQuery(
    {
      teacher_id: teacher?._id,
      student_name: filterName,
      month: filterMonth,
      year: filterYear,
    },
    {
      skip: !teacher?._id,
    }
  );

  const { data: group } = useGetClassByParamsQuery(
    appliedFilters.department &&
      appliedFilters.classId &&
      appliedFilters.session &&
      appliedFilters.time
      ? {
          dept_id: appliedFilters.department,
          class_id: appliedFilters.classId,
          session: appliedFilters.session,
          time: appliedFilters.time,
        }
      : skipToken
  );

  let groupId = group?._id;

  const { data: students = [] } = useGetStudentsByGroupQuery(groupId, {
    skip: !groupId,
  });

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    if (!time_of_month || !book_name) {
      toast.error("Please fill time of the month and book name first.");
      return;
    }
    if (!subjectId || !classId || !department || !session || !time) {
      toast.error("Please fill subject class and dept first.");
      return;
    }

    const form = e.target;
    const qaidahPages = form.qaidahPages.value;
    const duasSurahs = form.duasSurahs.value;
    const islamicStudiesPages = form.islamicStudiesPages.value;

    const description = form?.description?.value;

    // Define lessonsData once
    let lessonsData = {
      time_of_month,
      book_name,
      student_id: id,
      class_id: classId,
      subject_id: subjectId,
      teacher_id: teacher?._id,
      department_id: department,
      monthly_publish: false,
      yearly_publish: false,
      month,
      year,
      qaidahPages,
      duasSurahs,
      islamicStudiesPages,
      date: new Date().toISOString(),
    };

    // Conditionally add description if exists
    if (description) {
      lessonsData.description = description;
    }
    try {
      const data = await addLessonCovered(lessonsData).unwrap();
      if (data?.insertedId) {
        toast.success("Lessons covered added successfully.");

        // Reset form fields
        form.reset();

        // Clear filters to reset group and students
        // setAppliedFilters({
        //   department: "",
        //   session: "",
        //   time: "",
        //   classId: "",
        //   subjectId: "",
        // });

        // Also reset individual filter inputs

        setTime_of_month("");
        setMonth("");
        setBook_name("");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add lessons covered.");
    }
  };

  return (
    <div>
      <h3 className="mb-2">Lessons Covered</h3>

      {/* ── FILTERS UI ── */}
      <div className="border border-black p-3 mb-3">
        <div className="row align-items-center">
          {/* Department */}
          <div className="col-md-4">
            <label className="form-label">Departments:</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setClassId("");
                setSubjectId("");
              }}
              className="form-control"
            >
              <option value="">Select Department</option>
              {teacherWithDetails?.departments_info?.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.dept_name}
                </option>
              ))}
            </select>
          </div>

          {/* Session */}
          <div className="col-md-4">
            <label className="form-label">Session</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              value={session}
              onChange={(e) => {
                setSession(e.target.value);
                setTime("");
              }}
              className="form-control"
            >
              <option value="">Select Session</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekend">Weekend</option>
            </select>
          </div>

          {/* Session Time */}
          <div className="col-md-4">
            <label className="form-label">Session Time</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="form-control"
            >
              <option value="">Select Session Time</option>
              {session === "weekdays" && (
                <>
                  <option value="S1">Early - 4:30 PM – 6:00 PM</option>
                  <option value="S2">Late - 6:00 PM – 7:30 PM</option>
                </>
              )}
              {session === "weekend" && (
                <>
                  <option value="WM">Morning - 10:00 AM – 12:30 PM</option>
                  <option value="WA">Afternoon - 12:30 PM – 2:30 PM</option>
                </>
              )}
            </select>
          </div>

          {/* Class */}
          <div className="col-md-4">
            <label className="form-label">Class</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setSubjectId("");
              }}
              className="form-control"
            >
              <option value="">Select Class</option>
              {teacherWithDetails?.classes_info
                ?.filter(
                  (c) =>
                    c.dept_id === department &&
                    c.session === session &&
                    c.session_time === time
                )
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.class_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Subject */}
          <div className="col-md-4">
            <label className="form-label">Subject</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="form-control"
            >
              <option value="">Select Subject</option>
              {teacherWithDetails?.subjects_info
                ?.filter(
                  (s) => s.dept_id === department && s.class_id === classId
                )
                .map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subject_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Apply Button */}
          <div className="col-md-4">
            <label className="form-label invisible">Apply</label>
            <button
              type="button"
              style={{ backgroundColor: "var(--border2)" }}
              className="btn text-white w-100"
              onClick={handleApplyFilters}
            >
              {isEditMode ? "Cancel" : "Apply Filters"}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="border border-black mt-4 p-3">
        {isEditMode ? (
          // SHOW INPUT FORM FOR EACH STUDENT WHEN IN EDIT MODE
          <div className="mt-2">
            <div className="row mb-4">
              <div className="col-lg-2">
                <label className="form-label">Month</label>
                <select
                  style={{ borderColor: "var(--border2)" }}
                  className="form-control bg-light"
                  required
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Select month</option>
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
              <div className="col-lg-2">
                <label className="form-label">Year</label>
                <select
                  style={{ borderColor: "var(--border2)" }}
                  className="form-control bg-light"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                    (yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="col-lg-3">
                <label className="form-label">Which time of the month</label>
                <select
                  style={{ borderColor: "var(--border2)" }}
                  className="form-control bg-light"
                  required
                  value={time_of_month}
                  onChange={(e) => setTime_of_month(e.target.value)}
                >
                  <option value="">Select time of the month</option>
                  <option value="beginning">Beginning Of The Month</option>
                  <option value="ending">End Of The Month</option>
                </select>
              </div>
              <div className="col-lg-2">
                <label className="form-label">Type Of Education</label>
                <select
                  style={{ borderColor: "var(--border2)" }}
                  className="form-control bg-light"
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="normal">Normal Education</option>
                  <option value="gift_muslim">Gift For Muslim</option>
                </select>
              </div>
              <div className="col-lg-3">
                <label className="form-label">Book Name</label>
                <select
                  style={{ borderColor: "var(--border2)" }}
                  className="form-control bg-light"
                  required
                  value={book_name}
                  onChange={(e) => setBook_name(e.target.value)}
                >
                  <option value="">Select Book</option>
                  {type === "normal" ? (
                    <>
                      <option value="qaidah_quran">
                        Qaidah / Tajweed / Quran / Hifz
                      </option>
                      <option value="dua_surah">Dua / Surahs</option>
                      <option value="islamic_studies">Islamic Studies</option>
                    </>
                  ) : (
                    <>
                      <option value="dua_surah">Dua / Surahs</option>
                      <option value="islamic_studies">Islamic Studies</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            {students.map((student, index) => (
              <div
                key={student._id}
                className="border p-4 mb-3 bg-light rounded shadow-sm"
              >
                <h5 className="mb-3">
                  {index + 1} - {student.name}
                </h5>
                <form
                  onSubmit={(e) => handleSubmit(e, student?._id)}
                  className="row"
                >
                  <div className="col-lg-4">
                    <label className="form-label">
                      Quran Qaidah Pages done
                    </label>
                    <input
                      type="number"
                      name="qaidahPages"
                      className="form-control"
                      style={{ borderColor: "var(--border2)" }}
                      required
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className="form-label">Duas / Surahs done</label>
                    <input
                      type="number"
                      name="duasSurahs"
                      className="form-control"
                      style={{ borderColor: "var(--border2)" }}
                      required
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className="form-label">
                      Islamic Studies pages done
                    </label>
                    <input
                      type="number"
                      name="islamicStudiesPages"
                      className="form-control"
                      style={{ borderColor: "var(--border2)" }}
                      required
                    />
                  </div>
                  {time_of_month === "ending" && (
                    <>
                      <div className="col-lg-12 mt-3">
                        <label className="form-label">
                          Description (Optional)
                        </label>
                        <textarea
                          className="form-control"
                          name="description"
                          rows="4"
                          placeholder="Write detailed description..."
                          style={{ borderColor: "var(--border2)" }}
                        ></textarea>
                      </div>
                    </>
                  )}

                  <div className="col-md-12">
                    <label className="form-label invisible">Apply</label>
                    <button
                      type="submit"
                      style={{ backgroundColor: "var(--border2)" }}
                      className="btn text-white w-100"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        ) : (
          // SHOW EXISTING LESSONS COVERED DATA BY DEFAULT
          <div className="mt-2">
            <LessonCoveredTable
              lessonsCovered={lessonsCovered}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              filterName={filterName}
              setFilterName={setFilterName}
              filterYear={filterYear}
              setFilterYear={setFilterYear}
            ></LessonCoveredTable>
          </div>
        )}
      </div>
    </div>
  );
}
