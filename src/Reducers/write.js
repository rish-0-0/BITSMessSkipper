let initialState = {
    stillWriting: false,
    wrote:false,
    writeError: null,
};
export function write(state=initialState,action) {
    switch(action.type) {
        case 'WRITING_DATA':
            return {
                ...state,
                stillWriting: true,
            };
        case 'WROTE_DATA':
            return {
                ...state,
                wrote:true,
                stillWriting: false,            };
        case 'WRITE_ERROR':
            return {
                ...state,
                stillWriting: false,
                wrote:false,
                writeError: action.payload.err,
            };
        default:
            return state;
    }
}