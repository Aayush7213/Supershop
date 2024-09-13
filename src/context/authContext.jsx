import { createContext, useReducer } from "react"; 
import rootReducer from "../reducers";
import { makeAuthRequest, logout as authLogout } from "../actions/authActions";
import { fetchFromLocalStorage } from "../utils/helpers";
import PropTypes from 'prop-types';

// Fetch authentication data from local storage
const fetchAuthData = () => {
    let authData = fetchFromLocalStorage("authData");
    if (!authData || authData.length === 0) return { isLoggedIn: false, info: {} };
    return authData;
}

const initialState = {
    authLoading: false,
    authError: false,
    authData: fetchAuthData(),
    authErrorMsg: ""
}

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer.auth, initialState);

    // Utility function to check if user is admin
    const isAdmin = state.authData.isLoggedIn && state.authData.info.role === 'admin';

    // Enhanced logout function
    const logout = () => {
        authLogout(dispatch);
        // Additional logout logic if needed
    };

    // Check if the user is logged in and their role status
    const isLoggedIn = state.authData.isLoggedIn;

    return (
        <AuthContext.Provider value={{
            ...state,
            makeAuthRequest,
            dispatch,
            logout,
            isLoggedIn,
            isAdmin  // Expose isAdmin boolean
        }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node
}

