import { configureStore } from "@reduxjs/toolkit";
import coreReducer from "../redux/features/core/coreSlice";
import academicReducer from "../redux/features/academic/academicSlice";
import financialReducer from "../redux/features/financial/financialSlice";
import administrationReducer from "../redux/features/administration/administrationSlice";
import marketplaceReducer from "../redux/features/marketplace/marketplaceSlice";
import classroomReducer from "../redux/features/classroom/classroomSlice";
import { apiSlice } from "./features/api/apiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    core: coreReducer,
    academic: academicReducer,
    financial: financialReducer,
    administration: administrationReducer,
    marketplace: marketplaceReducer,
    classroom: classroomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
