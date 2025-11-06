import React, { useEffect, useState } from "react";
import { useGetClassByParamsQuery } from "../../redux/features/classes/classesApi";
import { useGetStudentsByGroupQuery } from "../../redux/features/students/studentsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import useAuth from "../../hooks/useAuth";
import {
  useGetTeacherByEmailQuery,
  useGetTeacherWithDetailsQuery,
} from "../../redux/features/teachers/teachersApi";
import { useGetTeacherStudentsProgressQuery } from "../../redux/features/lessons_covered/lessons_coveredApi";

import ReportSubmitModal from "./ReportSubmitModal";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function LessonsCovered() {
  const { user } = useAuth();

  // ── INPUT STATES ──
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [time, setTime] = useState("");
  const [classId, setClassId] = useState("");
  const currentYear = new Date().getFullYear();
  const [filterMonth, setFilterMonth] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // ── APPLIED FILTER STATES ──
  const [appliedFilters, setAppliedFilters] = useState({
    department: "",
    session: "",
    time: "",
    classId: "",
  });

  // ── APPLY FILTER HANDLER ──
  const handleApplyFilters = () => {
    setAppliedFilters({ department, session, time, classId });
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

  const { data: lessonsCovered = [], isLoading: LessonCoveredLoading } =
    useGetTeacherStudentsProgressQuery(
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

  const {
    data: students = [],
    refetch,
    isLoading,
  } = useGetStudentsByGroupQuery(groupId, {
    skip: !groupId,
  });

  const handleShow = (id) => {
    setSelectedStudentId(id);
    setShowModal(true);
  };

  useEffect(() => {
    if (groupId) {
      refetch();
    }
  }, [groupId]);

  if (isLoading || LessonCoveredLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  return (
    <div>
      <h3 className="mb-2">Lessons Covered</h3>

      {/* ── FILTERS UI ── */}
      <div className="border border-black p-3 mb-3">
        <div className="row align-items-center">
          {/* Department */}
          <div className="col-md-6">
            <label className="form-label">Departments:</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setClassId("");
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
          <div className="col-md-6">
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

          {/* Apply Button */}
          <div className="col-md-4">
            <label className="form-label invisible">Apply</label>
            <button
              type="button"
              style={{ backgroundColor: "var(--border2)" }}
              className="btn text-white w-100"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content Area - Always show students list */}
      <div
        className={`${
          students?.length > 0 ? "border border-black" : ""
        } mt-4 p-3`}
      >
        <div className="mt-2">
          {students.map((student, index) => (
            <div
              key={student._id}
              className="border p-4 mb-3 bg-light rounded shadow-sm"
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-3">
                  {index + 1}. {student.name}{" "}
                </h5>
                <button
                  style={{
                    backgroundColor: "var(--border2)",
                    color: "white",
                  }}
                  className="px-4 py-2"
                  onClick={() => handleShow(student?._id)}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>

        <ReportSubmitModal
          studentId={selectedStudentId}
          teacherId={teacher?._id}
          classId={classId}
          departmentId={department}
          showModal={showModal}
          setShowModal={setShowModal}
        ></ReportSubmitModal>
      </div>
    </div>
  );
}
