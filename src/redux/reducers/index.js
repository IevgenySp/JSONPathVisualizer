import { combineReducers } from 'redux';

import JSONData from './JSONData';
import FilteredData from './FilteredData';

export default combineReducers({
    JSONData,
    FilteredData
});
