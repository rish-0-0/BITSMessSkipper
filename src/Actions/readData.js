// import API from '../api';
import DB from '../firebase';
const gettingData = () => {
    return {
        type: 'GETTING_DATA',
    };
};
const receivedData = (stuff) => {
    return {
        type: 'RECEIVED_DATA',
        payload: {
            ...stuff,
        }
    };
};
const receivedError = (err) => {
    return {
        type: 'RECEIVED_ERROR',
        payload: {
            err,
        },
    };
};
export const readData = (collection,document) => {
    return dispatch => {
        dispatch(gettingData());
        // IF A SPECIFIC DOCUMENT IS REQUESTED
        let docRef = DB.ref('/'+collection+'/'+document).once('value');
        docRef
        .then(doc => {
            let documents = [];
            documents.push(doc.val());
            let parcel = {
                'items': documents,
            };
            dispatch(receivedData(parcel));
        })
        .catch(err => {
            console.log(err.message);
            dispatch(receivedError(err.message));
        });
    };
};