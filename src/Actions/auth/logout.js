import { firebaseAuth } from '../../firebase';
const loggingOut = () => {
    return {
        type: 'LOGGING_OUT',
    };
};
const loggedOut = (success) => {
    return {
        type: 'LOGOUT',
        payload: {
            ...success,
        },
    };
};
const logoutError = (err) => {
    return {
        type: 'LOGOUT_ERROR',
        payload: {
            err,
        },
    };
};
export const logout = () => {
    return dispatch => {
        dispatch(loggingOut());
        firebaseAuth.signOut()
        .then(() => {
            dispatch(loggedOut({'success':true}));
        })
        .catch(err => {
            console.log('ERROR OCURRED WHILE SIGNING_OUT',err.message);
            dispatch(logoutError(err.message));
        });
    };
};