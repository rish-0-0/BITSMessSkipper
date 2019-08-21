let credential = sessionStorage.getItem('token');
let email = sessionStorage.getItem('email');
let name = sessionStorage.getItem('name');
let photo = sessionStorage.getItem('photo');
let firebaseUID = sessionStorage.getItem('firebaseUID');
let isNewUser = sessionStorage.getItem('isNewUser');
let initialState = {
    name: name,
    credential: credential,
    email:email,
    photo: photo,
    isNewUser: isNewUser,
    online: credential ? true : false,
    firebaseUID: firebaseUID,
    error: null,
    loggingOut:false,
    logoutSuccess:false,
    logoutError:false,
};
export const auth = (state=initialState,action) => {
    switch(action.type) {
        case 'USER_INFO':
            window.sessionStorage.setItem('token',action.payload.token);
            window.sessionStorage.setItem('name',action.payload.name);
            window.sessionStorage.setItem('email',action.payload.email);
            window.sessionStorage.setItem('photo',action.payload.userPhoto);
            window.sessionStorage.setItem('firebaseUID',action.payload.firebaseUID);
            window.sessionStorage.setItem('isNewUser',action.payload.isNewUser);
            return {
                ...state,
                name: action.payload.name,
                email:action.payload.email,
                credential: action.payload.token,
                firebaseUID: action.payload.firebaseUID,
                photo: action.payload.photo,
                online:state.online,
            };
        case 'LOGIN_ERROR':
            return {
                ...state,
                error: action.payload.error,
            };
        case 'LOGGING_OUT':
            return {
                ...state,
                loggingOut:true,
            };
        case 'LOGOUT':
            window.sessionStorage.removeItem('token');
            window.sessionStorage.removeItem('name');
            window.sessionStorage.removeItem('email');
            window.sessionStorage.removeItem('photo');
            window.sessionStorage.removeItem('firebaseUID');
            window.sessionStorage.removeItem('isNewUser');
            return {
                ...state,
                loggingOut:false,
                logoutSuccess:action.payload.success,
                logoutError:false,
                credential:null,
                name:null,
                photo:null,
                firebaseUID:null,
                isNewUser:false,
            };
        case 'LOGOUT_ERROR':
            return {
                ...state,
                logoutError:true,
                loggingOut:false,
                logoutSuccess:false,
            };
        default:
            return {
                ...state,
            };
    }
};