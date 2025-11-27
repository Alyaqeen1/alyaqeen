import React from "react";
import { format } from "date-fns";
import {
  useAddAttendanceMutation,
  useTimeoutAttendanceMutation,
  useGetAttendanceByTeacherAndDateQuery,
} from "../../redux/features/attendances/attendancesApi";
import useAuth from "../../hooks/useAuth";
import { useGetTeacherByEmailQuery } from "../../redux/features/teachers/teachersApi";
import { FaThumbsUp } from "react-icons/fa";
import toast from "react-hot-toast";
import { useGetAnnouncementByTypeQuery } from "../../redux/features/announcements/announcementsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data: teacher } = useGetTeacherByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  const {
    data: announcement,
    isLoading,
    isError,
  } = useGetAnnouncementByTypeQuery("teacher");

  // Get today's date
  const today = format(new Date(), "yyyy-MM-dd");

  // Fetch today's attendance
  const { data: todayAttendance, refetch } =
    useGetAttendanceByTeacherAndDateQuery(
      { teacherId: teacher?._id, date: today },
      { skip: !teacher?._id }
    );

  const [addAttendance, { isLoading: isTimeInLoading }] =
    useAddAttendanceMutation();
  const [timeoutAttendance, { isLoading: isTimeOutLoading }] =
    useTimeoutAttendanceMutation();

  const handleTimeIn = async () => {
    try {
      const now = new Date();
      const time_in = now.toTimeString().split(" ")[0]; // "HH:MM:SS"

      const data = await addAttendance({
        staff_id: teacher?._id,
        date: today,
        status: "present",
        time_in,
        attendance: "staff",
      }).unwrap();

      if (data?.insertedId) {
        toast.success("Time in marked");
        refetch(); // Refresh the attendance data
      }
    } catch (err) {
      console.error("Error marking time in:", err);
    }
  };

  const handleTimeOut = async () => {
    try {
      const data = await timeoutAttendance(todayAttendance?._id).unwrap();
      if (data?.modifiedCount) {
        toast.success("Time Out marked");
        refetch(); // Refresh the attendance data
      }
    } catch (err) {
      console.error("Error marking time out:", err);
    }
  };

  const formatTimeDisplay = (timeString) => {
    if (!timeString) return "--:--:--";
    return timeString;
  };

  const formatTotalHours = (timeString) => {
    if (!timeString) return "0h 0m";
    const [h, m, s] = timeString.split(/[: ]+/).map(Number);
    return `${h}h ${m}m ${s}s`;
  };

  // Default content if no announcement exists
  const defaultContent = `
    <p><strong>Islamic Studies extra work sheets</strong></p>
    <p>Assalamoalykum,</p>
    <p>1- Please all teachers should update your profile information if anything incorrect there please correct it. if you will update there then you dont need to brig your latest proof of address or any other documents,</p>
    <p>2- There will be a folder next to the printer in downstair hall for all islamic studies books in the next few days, you can take an extra work sheet form the folder relevant to the lessons and make copies of any lesson according to the number of the students in the class for your class students, if they have completed their class work or the 2nd teacher is not arrived yet or the students have time to do something more than this activity will not only keep them busy but they will get more knowledge of the lesson and when they take this work to their homes the parents will see what activities their children have been done in the class on that day, inshallah it will be very helpful for the children and Academy. Please everyone should make sure to start it from tomorrow, if you have any question please text me or see me in the office you have chance to discuss.</p>
    <p>Jazakallah khiaran</p>
  `;

  const displayContent = announcement?.content || defaultContent;
  const lastUpdated =
    announcement?.lastUpdated ||
    new Date().toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  if (isError) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          <h4>Failed to Load Announcement</h4>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Time In/Out Section */}
      <div className="border border-black shadow-md rounded-3 p-4 col-lg-4">
        {!todayAttendance?.total_hours && (
          <p>
            {!todayAttendance?.time_in
              ? "Mark your presence please:"
              : "Mark Time out before leaving:"}
          </p>
        )}

        {!todayAttendance?.time_in ? (
          <button
            onClick={handleTimeIn}
            disabled={isTimeInLoading}
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white w-100"
          >
            {isTimeInLoading ? "Processing..." : "Time In"}
          </button>
        ) : !todayAttendance?.time_out ? (
          <div className="mb-2">
            <button
              onClick={handleTimeOut}
              disabled={isTimeOutLoading}
              className="btn text-white w-100 bg-success"
            >
              {isTimeOutLoading ? "Processing..." : "Time Out"}
            </button>
            {!todayAttendance?.time_out && (
              <p
                className="text-danger text-center"
                style={{ fontSize: "12px" }}
              >
                Note: Once you click on timeout button, it cannot be undone
              </p>
            )}
          </div>
        ) : (
          <div className="alert alert-success mb-0">
            <div className="d-flex justify-content-between fw-bold">
              <span>
                <FaThumbsUp style={{ fontSize: "12px", marginRight: "10px" }} />
                Your total stay in academy today is: <br />
                {formatTotalHours(todayAttendance.total_hours)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Notice Board */}
      <div className="p-3 border border-black mt-4">
        <div className="bg-body-secondary p-3 border-bottom border-black">
          <h3 className="fs-1 fw-bold text-center">Notice Board</h3>
        </div>
        <div className="bg-body-secondary p-3">
          <p className="text-end fw-bold">Last Updated: {lastUpdated}</p>

          {/* Display the announcement content */}
          <div
            className="announcement-content"
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.6",
              fontFamily: "inherit",
            }}
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        </div>
      </div>
    </div>
  );
}
