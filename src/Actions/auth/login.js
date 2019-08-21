import { firebaseAuth } from '../../firebase';
import { googleAuth } from '../../firebase';

const gotInfo = (parcel) => {
    return {
        type: 'USER_INFO',
        payload: {
            ...parcel,
        },
    };
};
const gotError = (error) => {
    return {
        type: 'LOGIN_ERROR',
        payload: {
            error,
        },
    };
};
export const login = () => {
    return dispatch => {
        firebaseAuth.signInWithPopup(googleAuth)
        .then(result => {
            const token = result.credential.accessToken;
            const user = result.user;
            const firebaseUID = firebaseAuth.currentUser.uid;
            const isNewUser = result.additionalUserInfo.isNewUser;
            const userEmail = user.email;
            const userPhoto = user.photoURL;
            const userName = user.displayName;
            const parcel = {
                'token': token,
                'name': userName,
                'email': userEmail,
                'firebaseUID':firebaseUID,
                'isNewUser':isNewUser,
                'userPhoto': userPhoto,
            };
            dispatch(gotInfo(parcel));
        })
        .catch(e => {
            console.log('ERROR OCURRED',e);
            dispatch(gotError(e.message));
        });
    };
};