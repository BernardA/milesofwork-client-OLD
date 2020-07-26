import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_FAMILY_INIT,
    POST_FAMILY_OK,
    POST_FAMILY_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    errorPostFamily: null,
    dataPostFamily: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.data,
            };
        }
        case POST_FAMILY_INIT:
            return {
                ...state,
                isLoading: true,
                errorPostFamily: null,
                dataPostFamily: null,
            };
        case POST_FAMILY_OK:
            return {
                ...state,
                isLoading: false,
                dataPostFamily: action.data,
            };
        case POST_FAMILY_ERROR:
            return {
                ...state,
                isLoading: false,
                errorPostFamily: action.data,
            };
        default:
            return state;
    }
};
