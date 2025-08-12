import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  useGetTeacherByEmailQuery,
  useGetTeacherWithDetailsQuery,
} from "../../redux/features/teachers/teachersApi";
import { useGetClassByParamsQuery } from "../../redux/features/classes/classesApi";
import { useGetStudentsByGroupQuery } from "../../redux/features/students/studentsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { FiCheckSquare } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAddMeritMutation } from "../../redux/features/merits/meritsApi";
import Swal from "sweetalert2";

export default function Merits() {
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState(""); // weekdays | weekend
  const [time, setTime] = useState(""); // S1/S2/WM/WA
  const [classId, setClassId] = useState("");

  // Removed single behavior/category/incident states
  const [addMerit, { isLoading }] = useAddMeritMutation();

  const { user } = useAuth();
  const { data: teacher } = useGetTeacherByEmailQuery(user?.email, {
    skip: !user?.email,
  });
  const { data: teacherWithDetails } = useGetTeacherWithDetailsQuery(
    teacher?._id,
    {
      skip: !teacher?._id,
    }
  );

  const { data: group } = useGetClassByParamsQuery(
    department && classId && session && time
      ? { dept_id: department, class_id: classId, session, time }
      : skipToken
  );

  const groupId = group?._id;
  const { data: students = [] } = useGetStudentsByGroupQuery(groupId, {
    skip: !groupId,
  });

  // Initialize student states
  const [studentStates, setStudentStates] = useState({});

  // Update behavior for a specific student
  const handleBehaviorChange = (studentId, value) => {
    setStudentStates((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        behavior: value,
      },
    }));
  };

  // Update category for a specific student
  const handleCategoryChange = (studentId, value) => {
    setStudentStates((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        category: value,
        incident: "", // Reset incident when category changes
      },
    }));
  };

  // Update incident for a specific student
  const handleIncidentChange = (studentId, value) => {
    setStudentStates((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        incident: value,
      },
    }));
  };

  // Behavior options and incident categories remain the same...

  const behaviorOptions = [
    { label: "Excellent Homework (1)", value: "Excellent Homework", points: 1 },
    {
      label: "Excellent Classwork (1)",
      value: "Excellent Classwork",
      points: 1,
    },
    { label: "Excellent Conduct (2)", value: "Excellent Conduct", points: 2 },
    {
      label: "Excellent Punctuality (2)",
      value: "Excellent Punctuality",
      points: 2,
    },
    { label: "Excellent Manners (2)", value: "Excellent Manners", points: 2 },
    { label: "Correct Equipment (2)", value: "Correct Equipment", points: 2 },
    {
      label: "Helping students with sabaq (3)",
      value: "Helping students with sabaq",
      points: 3,
    },
    { label: "Helping Staff (3)", value: "Helping Staff", points: 3 },
    {
      label: "Perfect in all aspects (4)",
      value: "Perfect in all aspects",
      points: 4,
    },
    {
      label: "Treating staff respectfully (2)",
      value: "Treating staff respectfully",
      points: 2,
    },
  ];

  const incidentCategories = {
    lesson_class: [
      {
        label: "Not Reading loudly (-1)",
        value: "Not Reading loudly",
        points: -1,
      },
      {
        label: "Not Reciting/Practicing when told to (-2)",
        value: "Not Reciting/Practicing when told to",
        points: -2,
      },
      {
        label: "Not Memorizing Duas (-2)",
        value: "Not Memorizing Duas",
        points: -2,
      },
      {
        label: "Not paying attention when the lesson explained (-2)",
        value: "Not paying attention when the lesson explained",
        points: -2,
      },
      {
        label: "Of task not focussing (-1)",
        value: "Of task not focussing",
        points: -1,
      },
      {
        label: "Quran/Book Disruption (-1)",
        value: "Quran/Book Disruption",
        points: -1,
      },
      { label: "No Book (-2)", value: "No Book", points: -2 },
      {
        label: "No Equipment/Stationary (-1)",
        value: "No Equipment/Stationary",
        points: -1,
      },
      { label: "No Homework (-1)", value: "No Homework", points: -1 },
      { label: "Inadequate Work (-2)", value: "Inadequate Work", points: -2 },
      {
        label: "Poor / Inadequate Uniform (-2)",
        value: "Poor / Inadequate Uniform",
        points: -2,
      },
      {
        label: "Moving seats without permission (-1)",
        value: "Moving seats without permission",
        points: -1,
      },
    ],
    misbehavior: [
      {
        label: "Disrespecting to anyone (-1)",
        value: "Disrespecting to anyone",
        points: -1,
      },
      {
        label: "Bad behavior (Disruption) (-1)",
        value: "Bad behavior (Disruption)",
        points: -1,
      },
      {
        label: "Shouting in Corridor (-1)",
        value: "Shouting in Corridor",
        points: -1,
      },
      {
        label: "Dishonesty/Cheating (-3)",
        value: "Dishonesty/Cheating",
        points: -3,
      },
      { label: "Rude to staff (-3)", value: "Rude to staff", points: -3 },
      {
        label: "Answering back to the teacher (-3)",
        value: "Answering back to the teacher",
        points: -3,
      },
      {
        label: "Promoting bad behaviour (-4)",
        value: "Promoting bad behaviour",
        points: -4,
      },
    ],
    safety: [
      { label: "Shoe Safety (-2)", value: "Shoe Safety", points: -2 },
      {
        label: "Bag Safety (Bags stored in an unsafe place) (-1)",
        value: "Bag Safety (Bags stored in an unsafe place)",
        points: -1,
      },
      {
        label: "Bringing fizzy drinks (-1)",
        value: "Bringing fizzy drinks",
        points: -1,
      },
      { label: "Out of Bounds (-2)", value: "Out of Bounds", points: -2 },
      { label: "Play fighting (-2)", value: "Play fighting", points: -2 },
      {
        label: "Running in Corridor (-2)",
        value: "Running in Corridor",
        points: -2,
      },
      {
        label: "Misbehaving in Corridor (Disruption) (-2)",
        value: "Misbehaving in Corridor (Disruption)",
        points: -2,
      },
      {
        label: "Disruption Outside Academy (-2)",
        value: "Disruption Outside Academy",
        points: -2,
      },
      {
        label: "Using a Mobile phone (-5)",
        value: "Using a Mobile phone",
        points: -5,
      },
    ],
    punctuality: [
      { label: "Late to Class (-2)", value: "Late to Class", points: -2 },
      { label: "Late to Salaah (-2)", value: "Late to Salaah", points: -2 },
      { label: "Late to Academy (-1)", value: "Late to Academy", points: -1 },
      {
        label: "Non Attendance to Detention (-2)",
        value: "Non Attendance to Detention",
        points: -2,
      },
    ],
    bullying: [
      { label: "Name Calling (-2)", value: "Name Calling", points: -2 },
      {
        label: "Verbal harassment or Swearing (-5)",
        value: "Verbal harassment or Swearing",
        points: -5,
      },
      {
        label: "Emotional bullying (-5)",
        value: "Emotional bullying",
        points: -5,
      },
      { label: "Group bullying (-4)", value: "Group bullying", points: -4 },
      {
        label: "Fighting around in class (-5)",
        value: "Fighting around in class",
        points: -5,
      },
      {
        label: "Physical violence or Fighting (-10)",
        value: "Physical violence or Fighting",
        points: -10,
      },
    ],
    off_task: [
      {
        label: "Not Following Instruction (-2)",
        value: "Not Following Instruction",
        points: -2,
      },
      {
        label: "Eating in lesson time (-1)",
        value: "Eating in lesson time",
        points: -1,
      },
      { label: "Chewing Gum (-1)", value: "Chewing Gum", points: -1 },
      {
        label: "Breaktime Disruption (-1)",
        value: "Breaktime Disruption",
        points: -1,
      },
      {
        label: "Salaah Disruption (-1)",
        value: "Salaah Disruption",
        points: -1,
      },
      {
        label: "Damage the Property/Desk or bench (-4)",
        value: "Damage the Property/Desk or bench",
        points: -4,
      },
    ],
  };

  const handleSubmit = async (studentId) => {
    const studentState = studentStates[studentId] || {};
    const merit = behaviorOptions.find(
      (b) => b.value === studentState.behavior
    );
    const incident = studentState.category
      ? incidentCategories[studentState.category]?.find(
          (i) => i.value === studentState.incident
        )
      : null;

    // Check if either behavior or incident is selected
    if (!studentState.behavior && !studentState.incident) {
      toast.error("Please select at least one behavior or incident");
      return;
    }

    const payload = {
      student_id: studentId,
      teacher_id: teacher?._id,
      behavior: studentState.behavior,
      incident: studentState.incident,
      merit_points: (merit?.points || 0) + (incident?.points || 0),
      date: new Date().toISOString(),
    };

    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Give it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await addMerit(payload).unwrap();
          if (data?.insertedId) {
            Swal.fire({
              title: "Added!",
              text: "Merit/Incident given successfully!",
              icon: "success",
            });

            // Reset the fields for this student
            setStudentStates((prev) => ({
              ...prev,
              [studentId]: {
                behavior: "",
                category: "",
                incident: "",
              },
            }));
          }
        } catch (error) {
          console.error("Error saving merit:", error);
          toast.error("Failed to submit merit/incident");
        }
      }
    });
  };

  return (
    <div>
      {/* Filters section remains exactly the same... */}

      {/* ── FILTERS ─────────────────────────────────── */}
      <div className="border border-black p-3">
        <div className="row align-items-center">
          {/* Dept */}
          <div className="col-md-3">
            <label className="form-label">Departments:</label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setClassId("");
              }}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
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
          <div className="col-md-3">
            <label className="form-label">Session</label>
            <select
              value={session}
              onChange={(e) => {
                setSession(e.target.value);
                setTime("");
              }}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
            >
              <option value="">Select Session</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekend">Weekend</option>
            </select>
          </div>
          {/* Session time */}
          <div className="col-md-3">
            <label className="form-label">Session Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
            >
              <option value="">Select Session Time</option>
              {session === "weekdays" && (
                <>
                  <option value="S1">Early - 4:30 PM – 6:00 PM (1½ hrs)</option>
                  <option value="S2">Late - 5:45 PM – 7:15 PM (1½ hrs)</option>
                </>
              )}
              {session === "weekend" && (
                <>
                  <option value="WM">
                    Morning - 10:00 AM – 12:30 PM (2½ hrs)
                  </option>
                  <option value="WA">
                    Afternoon - 12:30 PM – 2:30 PM (2 hrs)
                  </option>
                </>
              )}
            </select>
          </div>
          {/* Class */}
          <div className="col-md-3">
            <label className="form-label">Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
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
        </div>
      </div>

      <div className="table-responsive my-3">
        <table
          className="table mb-0"
          style={{
            minWidth: 700,
          }}
        >
          <thead>
            <tr>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                #
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Student Name
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Behavior
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Incident
              </th>
            </tr>
          </thead>
          <tbody>
            {students?.length > 0 ? (
              students?.map((student, idx) => {
                const studentState = studentStates[student._id] || {};
                return (
                  <tr key={student?._id}>
                    <td className="border text-center align-middle text-nowrap">
                      {idx + 1}
                    </td>
                    <td className="border text-center align-middle text-nowrap">
                      {student?.name}
                    </td>

                    {/* Behavior Column */}
                    <td className="border align-middle">
                      <div className="d-flex gap-2 align-items-center">
                        <select
                          className="form-control"
                          value={studentState.behavior || ""}
                          onChange={(e) =>
                            handleBehaviorChange(student._id, e.target.value)
                          }
                        >
                          <option value="">Select Behavior</option>
                          {behaviorOptions.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmit(student._id)}
                          disabled={isLoading}
                        >
                          <FiCheckSquare />
                        </button>
                      </div>
                    </td>

                    {/* Incident Column */}
                    <td className="border align-middle">
                      <div className="d-flex gap-2 align-items-center">
                        <select
                          value={studentState.category || ""}
                          onChange={(e) =>
                            handleCategoryChange(student._id, e.target.value)
                          }
                          className="form-control"
                          style={{ minWidth: "150px" }}
                        >
                          <option value="">Select Category</option>
                          {Object.keys(incidentCategories).map((cat) => (
                            <option
                              key={cat}
                              className="text-capitalize"
                              value={cat}
                            >
                              {cat.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                        <select
                          className="form-control"
                          value={studentState.incident || ""}
                          onChange={(e) =>
                            handleIncidentChange(student._id, e.target.value)
                          }
                          style={{ minWidth: "150px" }}
                          disabled={!studentState.category}
                        >
                          <option value="">
                            {studentState.category
                              ? "Select Incident"
                              : "Select Category First"}
                          </option>
                          {studentState.category &&
                            incidentCategories[studentState.category]?.map(
                              (i) => (
                                <option key={i.value} value={i.value}>
                                  {i.label}
                                </option>
                              )
                            )}
                        </select>
                        <button
                          className="btn btn-danger"
                          disabled={isLoading}
                          onClick={() => handleSubmit(student._id)}
                        >
                          <FiCheckSquare />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  {groupId
                    ? "No students found."
                    : "Select filters to view attendance."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
