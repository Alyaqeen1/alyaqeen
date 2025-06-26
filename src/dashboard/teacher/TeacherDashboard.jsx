import React from "react";

export default function TeacherDashboard() {
  return (
    <div>
      <div className="border border-black shadow-md rounded-3 p-4 col-4">
        <p>Mark your presence please:</p>

        <button
          style={{ backgroundColor: "var(--border2)" }}
          className="btn text-white w-100"
        >
          Time In
        </button>
      </div>
      <div className="p-3 border border-black mt-4">
        <div className="bg-body-secondary p-3 border-bottom border-black">
          <h3 className="fs-1 fw-bold text-center">Notice Board</h3>
        </div>
        <div className="bg-body-secondary p-3">
          <p className="text-end">
            {new Date().toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="fs-5">Islamic Studies extra work sheets</p>
          <p className="fs-5">Assalamoalykum,</p>

          <p className="fs-5 py-4">
            1- Please all teachers should update your profile information if
            anything incorrect there please correct it. if you will update there
            then you dont need to brig your latest proof of address or any other
            documents,
          </p>
          <p className="fs-5 pb-4">
            2- There will be a folder next to the printer in downstair hall for
            all islamic studies books in the next few days, you can take an
            extra work sheet form the folder relevant to the lessons and make
            copies of any lesson according to the number of the students in the
            class for your class students, if they have completed their class
            work or the 2nd teacher is not arrived yet or the students have time
            to do something more than this activity will not only keep them busy
            but they will get more knowledge of the lesson and when they take
            this work to their homes the parents will see what activities their
            children have been done in the class on that day, inshallah it will
            be very helpful for the children and Academy. Please everyone should
            make sure to start it from tomorrow, if you have any question please
            text me or see me in the office you have chance to discuss.
          </p>
          <p className="fs-5">Jazakallah khiaran</p>
        </div>
      </div>
    </div>
  );
}
