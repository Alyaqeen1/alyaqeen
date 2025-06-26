import React from "react";

export default function TimeTable() {
  return (
    <div>
      {" "}
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
              Period Time
            </th>
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
          </tr>
        </thead>
        <tbody>
          {/* {students?.length > 0 ? (
              students?.map((student, idx) => ( */}
          <tr>
            <td className={` border h6 text-center align-middle text-nowrap`}>
              09:00 AM - 09:45 AM
            </td>
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
          </tr>
          {/* ))
            ) : (
              <tr>
                <td colSpan={12}>
                  <h5>No students available.</h5>
                </td>
              </tr>
            )}
            {} */}
        </tbody>
      </table>
    </div>
  );
}
