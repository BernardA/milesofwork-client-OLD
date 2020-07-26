import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import candidate from './candidate';
import experience from './experience';
import family from './family';

const rootReducer = combineReducers({
  form: formReducer,
  candidate,
  experience,
  family,
})

export default rootReducer
