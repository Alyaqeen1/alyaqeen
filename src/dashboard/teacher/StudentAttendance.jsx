import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCircle } from "react-icons/fa";

export default function StudentAttendance() {
  const [session, setSession] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [className, setClassName] = useState("");
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center my-2">
        <h3>Student Attendance</h3>
        <div>
          <button
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            <FaArrowLeft></FaArrowLeft>
          </button>
          <button
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white mx-1"
          >
            <FaCircle></FaCircle>
          </button>
          <button
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            <FaArrowRight></FaArrowRight>
          </button>
        </div>
      </div>
      <div className="border border-black p-3 row align-items-center">
        <div className="col-md-3">
          <label className="form-label">Session</label>
          <select
            value={session}
            style={{ borderColor: "var(--border2)" }}
            name="session"
            onChange={(e) => setSession(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select Session</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekend">Weekend</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Session Time</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="session_time"
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select Session Time</option>
            {session === "weekdays" && (
              <>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
              </>
            )}

            {session === "weekend" && (
              <>
                <option value="WM">WM</option>
                <option value="WA">WA</option>
              </>
            )}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Class Name</label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
            name="student_age"
            className="form-control"
            required
          >
            <option value="">Select Class</option>
            {session === "weekdays" && sessionTime === "S1" ? (
              <option value="B7">B7</option>
            ) : session === "weekend" && sessionTime === "WA" ? (
              <option value="5">WA - B1/2</option>
            ) : null}

            {/* <option value="5">5</option> */}
          </select>
        </div>
        <div className="col-md-3">
          <button
            style={{ backgroundColor: "var(--border2)", marginTop: 35 }}
            className="btn text-white w-100"
          >
            Apply Filter
          </button>
        </div>
      </div>
      <div className="border border-black mt-4 p-3">
        <div className=" w-100 d-flex justify-content-between align-items-center">
          <div className="d-flex ">
            <div>
              <span className="bg-success px-2 rounded-1 mx-2"></span>
              <span>Present</span>
            </div>
            <div>
              <span className="bg-primary px-2 rounded-1 mx-2"></span>
              <span>Late</span>
            </div>
            <div>
              <span className="bg-danger px-2 rounded-1 mx-2"></span>
              <span>Absent</span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-success">Present All</button>
            <button className="btn btn-danger">Remove All</button>
          </div>
        </div>
        <div className="mt-4">
          <table
            className="table table-responsive mb-0"
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
                {session === "weekdays" ? (
                  <>
                    <th
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--border2)" }}
                    >
                      Monday
                    </th>
                    <th
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--border2)" }}
                    >
                      Tuesday
                    </th>
                    <th
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--border2)" }}
                    >
                      Wednesday
                    </th>
                    <th
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--border2)" }}
                    >
                      Thursday
                    </th>
                  </>
                ) : session === "weekend" ? (
                  <>
                    <th
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--border2)" }}
                    >
                      Saturday
                    </th>
                    <th
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--border2)" }}
                    >
                      Sunday
                    </th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {/* {students?.length > 0 ? (
              students?.map((student, idx) => ( */}
              <tr>
                {/* <td
                  className={` border h6 text-center align-middle text-nowrap`}
                ></td>
                <td
                  className={` border h6 text-center align-middle text-nowrap`}
                ></td>
                <td
                  className={`fw-medium border text-center align-middle text-nowrap`}
                ></td>
                <td
                  className={`border h6 text-center align-middle text-nowrap`}
                ></td>
                <td
                  className={`border h6 text-center align-middle text-nowrap`}
                ></td>
                <td
                  className={`border h6 text-center align-middle text-nowrap`}
                ></td>
                <td
                  className={`border h6 text-center align-middle text-nowrap`}
                ></td>
                <td
                  className={`border h6 text-center align-middle text-nowrap`}
                ></td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
