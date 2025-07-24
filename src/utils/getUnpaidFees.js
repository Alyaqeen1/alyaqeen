import { addDays, isBefore, format, isValid } from "date-fns";

export function getUnpaidFees({ students, fees, feeChoice, discount = 0 }) {
  const now = new Date("2025-11-01"); //"2025-12-12"
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const currentDate = now.getDate();
  const cutoffDay = 10;
  const cutoffDay2 = 1;

  const monthlyPaidMap = {};

  // Build payment map from fee records
  for (const fee of fees || []) {
    if (
      (fee.paymentType === "monthly" || fee.paymentType === "monthlyOnHold") &&
      (fee.status === "paid" || fee.status === "pending")
    ) {
      for (const stu of fee.students || []) {
        const studentId = stu?.studentId?.toString?.();

        if (fee?.month) {
          const paidMonth = fee.month;
          if (studentId && paidMonth) {
            monthlyPaidMap[`${studentId}_${paidMonth}`] = true;
          }
        }

        if (Array.isArray(stu.monthsPaid)) {
          for (const { month, year } of stu.monthsPaid) {
            const monthStr = `${year}-${month.toString().padStart(2, "0")}`;
            monthlyPaidMap[`${studentId}_${monthStr}`] = true;
          }
        }
      }
    }
  }

  const grouped = {};

  for (const student of students) {
    const studentId = student._id?.toString?.();
    const { name, monthly_fee, startingDate } = student;

    const startDate = new Date(startingDate);
    if (!studentId || !isValid(startDate)) continue;

    const joinDay = startDate.getDate();

    const fee = monthly_fee || 0;

    const addUnpaidMonth = (monthStr) => {
      const key = `${studentId}_${monthStr}`;
      if (monthlyPaidMap[key]) return;

      const discountedFee = fee - (fee * discount) / 100;

      if (!grouped[monthStr]) {
        grouped[monthStr] = {
          totalAmount: 0,
          studentNames: new Set(),
          studentsMap: {},
        };
      }

      grouped[monthStr].totalAmount += discountedFee;
      grouped[monthStr].studentNames.add(name);

      if (!grouped[monthStr].studentsMap[studentId]) {
        grouped[monthStr].studentsMap[studentId] = {
          studentId,
          name,
          subtotal: 0,
          monthsUnpaid: [],
        };
      }

      grouped[monthStr].studentsMap[studentId].monthsUnpaid.push({
        month: monthStr,
        monthlyFee: fee,
        discountedFee: parseFloat(discountedFee.toFixed(2)),
      });

      grouped[monthStr].studentsMap[studentId].subtotal += discountedFee;
    };

    if (feeChoice === "fullMonth" && joinDay > cutoffDay) {
      let billingEndDate = addDays(startDate, 30);
      while (isBefore(billingEndDate, now)) {
        const monthStr = format(billingEndDate, "yyyy-MM");
        addUnpaidMonth(monthStr);
        billingEndDate = addDays(billingEndDate, 30);
      }
    } else {
      let payableMonth = startDate.getMonth() + 2;
      let payableYear = startDate.getFullYear();
      if (payableMonth > 12) {
        payableMonth = 1;
        payableYear++;
      }

      while (
        payableYear < currentYear ||
        (payableYear === currentYear && payableMonth <= currentMonth)
      ) {
        const skipCurrentMonth =
          payableYear === currentYear &&
          payableMonth === currentMonth &&
          currentDate < cutoffDay2;

        if (!skipCurrentMonth) {
          const monthStr = `${payableYear}-${payableMonth
            .toString()
            .padStart(2, "0")}`;
          addUnpaidMonth(monthStr);
        }

        payableMonth++;
        if (payableMonth > 12) {
          payableMonth = 1;
          payableYear++;
        }
      }
    }
  }

  // Final formatting
  return Object.entries(grouped).map(([month, data]) => {
    return {
      month,
      totalAmount: parseFloat(data.totalAmount.toFixed(2)),
      studentNames: Array.from(data.studentNames).join(", "),
      students: Object.values(data.studentsMap).map((stu) => ({
        ...stu,
        subtotal: parseFloat(stu.subtotal.toFixed(2)),
      })),
    };
  });
}
