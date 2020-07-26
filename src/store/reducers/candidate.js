import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_CANDIDATE_INIT,
    POST_CANDIDATE_OK,
    POST_CANDIDATE_ERROR,
    PUT_CANDIDATE_INIT,
    PUT_CANDIDATE_OK,
    PUT_CANDIDATE_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    errorPostCandidate: null,
    dataPostCandidate: null,
    errorPutCandidate: null,
    dataPutCandidate: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.data,
            };
        }
        case POST_CANDIDATE_INIT:
            return {
                ...state,
                isLoading: true,
                errorPostCandidate: null,
                dataPostCandidate: null,
            };
        case POST_CANDIDATE_OK:
            return {
                ...state,
                isLoading: false,
                dataPostCandidate: action.data,
            };
        case POST_CANDIDATE_ERROR:
            return {
                ...state,
                isLoading: false,
                errorPostCandidate: action.data,
            };
        case PUT_CANDIDATE_INIT:
            return {
                ...state,
                isLoading: true,
                errorPutCandidate: null,
            };
        case PUT_CANDIDATE_OK:
            return {
                ...state,
                isLoading: false,
                dataPutCandidate: action.data,
            };
        case PUT_CANDIDATE_ERROR:
            return {
                ...state,
                isLoading: false,
                errorPutCandidate: action.data,
            };
        default:
            return state;
    }
};