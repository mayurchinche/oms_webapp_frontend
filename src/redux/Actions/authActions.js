// src/redux/Actions/authActions.js
export const setAuth = (role, token, mobileNumber, userName) => {
    return {
      type: 'SET_AUTH',
      payload: {
        role,
        token,
        mobileNumber,
        userName
      }
    };
  };
  
  export const rehydrateAuth = () => {
    const role = sessionStorage.getItem('role');
    const token = sessionStorage.getItem('token');
    const mobileNumber = sessionStorage.getItem('mobileNumber');
    const userName = sessionStorage.getItem('user_name');
  
    if (role && token && mobileNumber && userName) {
      return setAuth(role, token, mobileNumber, userName);
    }
  
    return { type: 'NO_AUTH' };
  };