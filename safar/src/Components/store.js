import {  configureStore } from "@reduxjs/toolkit";
import {combineReducers } from 'redux';
import loggedReducer from "./slice";
//import reducers from "./slice";
import {persistReducer} from 'redux-persist'
import { thunk } from "redux-thunk";
import storage from 'redux-persist/lib/storage'


// export default configureStore({
//     reducer: {
        
//         logged: loggedReducer
//     }
// })

const reducers= combineReducers({
    logged: loggedReducer
});

const persistConfig={
    key:'root',
    storage
};

const persistedReducer= persistReducer(persistConfig,reducers);

export default configureStore ({
    reducer: persistedReducer, 
    devTools: process.env.NODE_ENV !== 'production'
});

