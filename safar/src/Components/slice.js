import { createSlice } from "@reduxjs/toolkit";

export const loggedSlice = createSlice({
  name: "logged",
  initialState: {
    loggedIn: false,
    userDetails: null, // Store user details here
  },
  reducers: {
    login: (state, action) => {
      console.log("in login action");
      return {
        loggedIn: true,
        userDetails: action.payload, // Store user details from action payload
      };
    },
    logout: () => {
      console.log("in logout action");
      return {
        loggedIn: false,
        userDetails: null, // Clear user details on logout
      };
    },
  },
});

export const { login, logout } = loggedSlice.actions;
export default loggedSlice.reducer;
