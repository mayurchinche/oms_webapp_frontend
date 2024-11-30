// src/redux/Reducers/authReducer.js
const initialState = {
    role: '',
    token: '',
    mobileNumber: '',
    userName: ''
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_AUTH':
        return {
          ...state,
          role: action.payload.role,
          token: action.payload.token,
          mobileNumber: action.payload.mobileNumber,
          userName: action.payload.userName
        };
      case 'NO_AUTH':
        return state;
      default:
        return state;
    }
  };
  
  export default authReducer;