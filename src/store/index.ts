import { configureStore } from "@reduxjs/toolkit";
import { appSlice } from "./app";
import { languageSlice } from "./language";
import { serverUrlSlice } from "./serverUrl";
import { userSlice } from "./user";

const middleware = (getDefaultMiddleware) => getDefaultMiddleware({})

const store = configureStore({
    reducer: {
      language: languageSlice.reducer,
      baseUrl: serverUrlSlice.reducer,
      user: userSlice.reducer,
      app: appSlice.reducer,
    },
    middleware,
  });

  export default store;