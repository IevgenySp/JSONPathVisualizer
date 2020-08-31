
const initialState = null;

export default function JSONData(state = initialState, action){
    if (action.type === 'JSON_DATA_UPDATE') {
        return action.payload;
    }
    return state;
}