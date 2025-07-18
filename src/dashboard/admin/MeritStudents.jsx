import React from "react";
import { useGetTopMeritsQuery } from "../../redux/features/merits/meritsApi";

export default function MeritStudents() {
  const { data: merits, isLoading, error } = useGetTopMeritsQuery();

  if (isLoading) return <div>Loading top merit students...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        🎖️ Top Merit Students (50+ points)
      </h2>
      {merits.length === 0 ? (
        <p>No students have reached the 50 merit point threshold.</p>
      ) : (
        <ul className="space-y-3">
          {merits.map((student) => (
            <li
              key={student.student_id}
              className="border p-3 rounded-md shadow-md bg-white"
            >
              <div className="font-semibold text-lg">
                {student.student_name}{" "}
                {student.family_name && `(${student.family_name})`}
              </div>
              <div className="text-sm text-gray-600">
                Class: {student.class} | Department: {student.department}
              </div>
              <div className="text-sm font-medium text-green-600">
                Total Merit Points: {student.totalMerit}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
