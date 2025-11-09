// client/src/context/AuthContext.js
import { createContext, useReducer } from 'react';
import axios from 'axios';

// 1. Define the Initial State
// We check localStorage to see if a user is already logged in
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  user: userFromStorage,
  loading: false,
  error: null,
};

// 2. Create the Auth Reducer
// A reducer handles state changes based on 'actions'
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

// 3. Create the Context
export const AuthContext = createContext(initialState);

// 4. Create the AuthProvider (the component that provides the state)
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 5. Add Actions (Login, Register, Logout)

  // --- Login Action ---
  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });

      const res = await axios.post(
        'https://threew-taskplanet.onrender.com/api/users/login',
        { email, password }
      );

      localStorage.setItem('user', JSON.stringify(res.data));
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return true; // Indicate success
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAIL', payload: errorMsg });
      return false; // Indicate failure
    }
  };

  // --- Register Action ---
  const register = async (username, email, password) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' });

      const res = await axios.post(
        'https://threew-taskplanet.onrender.com/api/users/register',
        { username, email, password }
      );

      localStorage.setItem('user', JSON.stringify(res.data));
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      return true; // Indicate success
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      dispatch({ type: 'REGISTER_FAIL', payload: errorMsg });
      return false; // Indicate failure
    }
  };

  // --- Logout Action ---
  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // 6. Provide the context to children
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};