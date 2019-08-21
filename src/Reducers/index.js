import { combineReducers } from 'redux';

import {read} from './read';
import {write} from './write';
import {auth} from './auth';

const reducer = combineReducers({
    read,
    write,
    auth,
});

export default reducer;