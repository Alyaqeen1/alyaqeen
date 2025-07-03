const feeStructure = {
  admissionFee: 20,
  discountOnAdmission: {
    threshold: 2, // 3rd child onwards
    percentage: 10,
  },
  monthlyFees: {
    "Qaidah, Quran & Islamic Studies": {
      weekdays: 50,
      weekend: 50,
    },
    "Primary Maths & English Tuition": {
      weekdays: 100,
      weekend: 80,
    },
    "GCSE Maths English & Science Tuition": {
      weekdays: 120,
      weekend: 100,
    },
    "Hifz Memorisation": {
      weekdays: 90,
      weekend: 60,
    },
    "Arabic Language": {
      weekdays: 60,
      weekend: 50,
    },
  },
};

export default feeStructure;
