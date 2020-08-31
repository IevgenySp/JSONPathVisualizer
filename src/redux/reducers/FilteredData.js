
const initialState = [];

export default function FilteredData(state = initialState, action){
    if (action.type === 'FILTERED_DATA_UPDATE') {
        return action.payload;
    }
    return state;
}