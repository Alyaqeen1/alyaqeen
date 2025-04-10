import { configureStore } from "@reduxjs/toolkit";
import coreReducer from "../redux/features/core/coreSlice";
import academicReducer from "../redux/features/academic/academicSlice";
import financialReducer from "../redux/features/financial/financialSlice";
import administrationReducer from "../redux/features/administration/administrationSlice";
import marketplaceReducer from "../redux/features/marketplace/marketplaceSlice";
import classroomReducer from "../redux/features/classroom/classroomSlice";

const store = configureStore({
  reducer: {
    core: coreReducer,
    academic: academicReducer,
    financial: financialReducer,
    administration: administrationReducer,
    marketplace: marketplaceReducer,
    classroom: classroomReducer,
  },
  //   middleware: () => {},
});

export default store;
