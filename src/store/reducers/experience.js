import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_EXPERIENCE_INIT,
    POST_EXPERIENCE_OK,
    POST_EXPERIENCE_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    errorPostExperience: null,
    dataPostExperience: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.data,
            };
        }
        case POST_EXPERIENCE_INIT:
            return {
                ...state,
                isLoading: true,
                errorPostExperience: null,
                dataPostExperience: null,
            };
        case POST_EXPERIENCE_OK:
            return {
                ...state,
                isLoading: false,
                dataPostExperience: action.data,
            };
        case POST_EXPERIENCE_ERROR:
            return {
                ...state,
                isLoading: false,
                errorPostExperience: action.data,
            };
        default:
            return state;
    }
};
