import {
  all, call, put, takeLatest
} from 'redux-saga/effects'
import axios from 'axios'
import localforage from 'localforage'
import { Now, randomGenerator } from '../tools/functions'
import { parseApiErrors } from '../tools/apiUtils'
import {
    CHECK_ONLINE_STATUS,
    CHECK_ONLINE_STATUS_OK,
    CHECK_ONLINE_STATUS_ERROR,
    POST_CANDIDATE,
    POST_CANDIDATE_INIT,
    POST_CANDIDATE_OK,
    POST_CANDIDATE_ERROR,
    PUT_CANDIDATE,
    PUT_CANDIDATE_INIT,
    PUT_CANDIDATE_OK,
    PUT_CANDIDATE_ERROR,
    POST_EXPERIENCE,
    POST_EXPERIENCE_INIT,
    POST_EXPERIENCE_OK,
    POST_EXPERIENCE_ERROR,
    POST_FAMILY,
    POST_FAMILY_INIT,
    POST_FAMILY_OK,
    POST_FAMILY_ERROR,
} from '../store/actions';

const API_REST = 'API_REST'

const api = (
    method,
    urlSuffix,
    data = null,
    endpoint = API_REST,
    auth = true, // require bearer token
) => {
    // update last active on indexeddb
    if (endpoint !== 'favicon') {
        localforage.setItem('lastActiveAt', Now());
    }
    let url = `${process.env.NEXT_PUBLIC_API_REST_URL}${urlSuffix}`;
    if (endpoint !== API_REST) {
        url = urlSuffix;
    }
    if (!auth) {
        return axios({
            method,
            url,
            data,
            headers: {},
        }).then((response) => {
            return response.data;
        });
    }
    return axios({
        method,
        url,
        data,
    }).then((response) => {
        return response.data;
    });
};

export const apiQl = (data, variables = null, isForage = true) => {
    // update last active on indexeddb
    if (isForage) {
        localforage.setItem('lastActiveAt', Now());
    }
    return axios
        .post(process.env.NEXT_PUBLIC_API_GRAPHQL_URL, {
            query: data,
            variables,
        })
        .then((response) => {
            return response.data;
        });
};

const apiStd = (urlSuffix, data = null) => {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}${urlSuffix}`;
    return axios.post(url, data).then((response) => {
        return response.data;
    });
};

function errorParser(error) {
    // console.log('error parser', error);
    const title = 'error';
    const description = error['hydra:description'];
    const parsedE = [];
    const obj = {};
    obj[title] = description;
    parsedE.push(obj);
    return parsedE;
}

function violationParser(error) {
    // console.log('VIOLATION parser', error);
    const statusCode = error.status;
    let data = [];
    if (statusCode === 401) {
        data[0] = error.data;
    } else if (statusCode === 400) {
        const violations = error.data.violations;
        data = parseApiErrors(violations);
    } else if (statusCode === 403) {
        data = errorParser(error.data);
    } else if (statusCode === 500) {
        data.push({
            error: 'System error. Please try again or contact us',
        });
    }
    return data;
}

function errorParserGraphql(errors) {
    if (errors[0].message === 'Expired JWT Token') {
        return 'token expired';
    }
    if (errors[0].message === 'Access Denied.') {
        return [{ message: 'You are not authorized to perform this action.' }];
    }
    const parsedE = [];
    errors.forEach((error) => {
        // graphql variable error
        if (error.message.startsWith('Variable ')) {
            const origKey = error.message.match(/\$[a-zA-z0-9]+/gm);
            let key = origKey[0].replace('$', '');
            const position = key.search(/[A-Z]/);
            if (position !== -1) {
                key = key.toLowerCase();
                key = `${key.slice(0, position)} ${key.slice(position)}`;
            }
            const obj = {};
            obj[key] = error.message.replace(`Variable "${origKey}"`, '');
            parsedE.push(obj);
        } else {
            // symfony validation error
            const split = error.message.split(':');
            const key = split[0].trim();
            const obj = {};
            obj[key] = split[1].trim();
            parsedE.push(obj);
        }
    });
    return parsedE;
}

function* getCheckOnlineStatus() {
    const url = `${process.env.NEXT_PUBLIC_LOCAL_HOST}/icons/icon-48x48.png`;
    try {
        yield call(api, 'get', url, null, 'favicon', false);
        yield put({
            type: CHECK_ONLINE_STATUS_OK,
            isOnline: true,
        });
        // clears indexedDB offline event flag
        localforage.removeItem('offline-event-fired');
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
        yield put({
            type: CHECK_ONLINE_STATUS_ERROR,
            isOnline: !isOffline,
        });
    }
}

function* postCandidate(action) {
    console.log('candidate action', action);
    const { values } = action;
    const queryQl = `mutation postCandidate(
            $persoLastName: String!
            $persoFirstName: String!
            $persoEmail: String!
            $persoResidence: String!
            $persoTel: String!
            $eduHighest: Int!
            $eduHighestYearAttained: Int!
            $eduHighestNameOfSchool: String!
            $eduHighestCity: String!
            $eduHighestCountry: String!
        ){
        createCandidate(input: {
            persoLastName: $persoLastName
            persoFirstName: $persoFirstName
            persoEmail: $persoEmail
            persoResidence: $persoResidence
            persoTel: $persoTel
            eduHighest: $eduHighest
            eduHighestYearAttained: $eduHighestYearAttained
            eduHighestNameOfSchool: $eduHighestNameOfSchool
            eduHighestCity: $eduHighestCity
            eduHighestCountry: $eduHighestCountry
        }) {
            candidate{
                id
                eduHighest
            }
        }
    }`;

    const variables = {
        persoLastName: values.persoLastName,
        persoFirstName: values.persoFirstName,
        persoEmail: values.persoEmail,
        persoResidence: values.persoResidence,
        persoTel: `(${values.countryCode})-${values.persoTel}`,
        eduHighest: values.eduHighest,
        eduHighestYearAttained: values.eduHighestYearAttained,
        eduHighestNameOfSchool: values.eduHighestNameOfSchool,
        eduHighestCity: values.eduHighestCity,
        eduHighestCountry: values.eduHighestCountry,
    };

    try {
        yield put({
            type: POST_CANDIDATE_INIT,
        });

        const data = yield call(
            apiQl,
            queryQl,
            variables,
        );
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_CANDIDATE_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: POST_CANDIDATE_OK,
            data: data.data.createCandidate,
        });
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (isOffline) {
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* putCandidate(action) {
    console.log('candidate PUT', action);
    const { values } = action;
    const queryQl = `mutation putCandidate(
            $id: ID!
            $driveClassEquivalent: Int
            $driveIssuanceCountry: String
            $driveIssuanceCategory: String
            $driveFirstIssuanceDate: String
            $driveIsAirBrake: Boolean
            $driveIsManualShift: Boolean
            $driveIsLongTrain: Boolean
            $experienceMonths: Int
            $clientMutationId: String
            $langFRListen: Int
            $langFRRead: Int
            $langFRWrite: Int
            $langFRSpeak: Int
            $langENListen: Int
            $langENRead: Int
            $langENWrite: Int
            $langENSpeak: Int
            $langFRSchooling: Boolean
            $langFRHighestLevel: Int
            $langFRYearsSchooling: Int
            $langENSchooling: Boolean
            $langENHighestLevel: Int
            $langENYearsSchooling: Int
            $langTestCelpip: Boolean
            $langTestIelts: Boolean
            $langTestTef: Boolean
            $langTestTcf: Boolean
            $langCelpipDateOfTest: String
            $langCelpipListening: Float
            $langCelpipReading: Float
            $langCelpipWriting: Float
            $langCelpipSpeaking: Float
            $langIeltsListening: Float
            $langIeltsReading: Float
            $langIeltsWriting: Float
            $langIeltsSpeaking: Float
            $langTefListening: Float
            $langTefReading: Float
            $langTefWriting: Float
            $langTefSpeaking: Float
            $langTcfListening: Float
            $langTcfReading: Float
            $langTcfWriting: Float
            $langTcfSpeaking: Float
            $immCitizenship: String,
            $immRefusedEnterCanada: Boolean
            $immDeported: Boolean
            $immRefugee: Boolean
            $immOverstayedVisa: Boolean
            $immArrested: Boolean
            $immCleared: Boolean
        ){
        updateCandidate(input: {
            id: $id
            driveClassEquivalent: $driveClassEquivalent
            driveIssuanceCountry: $driveIssuanceCountry
            driveIssuanceCategory: $driveIssuanceCategory
            driveFirstIssuanceDate: $driveFirstIssuanceDate
            driveIsAirBrake: $driveIsAirBrake
            driveIsManualShift: $driveIsManualShift
            driveIsLongTrain: $driveIsLongTrain
            experienceMonths: $experienceMonths
            langFRListen: $langFRListen
            langFRRead: $langFRRead
            langFRWrite: $langFRWrite
            langFRSpeak: $langFRSpeak
            langENListen: $langENListen
            langENRead: $langENRead
            langENWrite: $langENWrite
            langENSpeak: $langENSpeak
            langFRSchooling: $langFRSchooling
            langFRHighestLevel: $langFRHighestLevel
            langFRYearsSchooling: $langFRYearsSchooling
            langENSchooling: $langENSchooling
            langENHighestLevel: $langENHighestLevel
            langENYearsSchooling: $langENYearsSchooling
            langTestCelpip: $langTestCelpip
            langTestIelts: $langTestIelts
            langTestTef: $langTestTef
            langTestTcf: $langTestTcf
            langCelpipDateOfTest: $langCelpipDateOfTest
            langCelpipListening: $langCelpipListening
            langCelpipReading: $langCelpipReading
            langCelpipWriting: $langCelpipWriting
            langCelpipSpeaking: $langCelpipSpeaking
            langIeltsListening: $langIeltsListening
            langIeltsReading: $langIeltsReading
            langIeltsWriting: $langIeltsWriting
            langIeltsSpeaking: $langIeltsSpeaking
            langTefListening: $langTefListening
            langTefReading: $langTefReading
            langTefWriting: $langTefWriting
            langTefSpeaking: $langTefSpeaking
            langTcfListening: $langTcfListening
            langTcfReading: $langTcfReading
            langTcfWriting: $langTcfWriting
            langTcfSpeaking: $langTcfSpeaking
            immCitizenship: $immCitizenship
            immRefusedEnterCanada: $immRefusedEnterCanada
            immDeported: $immDeported
            immRefugee: $immRefugee
            immOverstayedVisa: $immOverstayedVisa
            immArrested: $immArrested
            immCleared: $immCleared
            clientMutationId: $clientMutationId
        }){
            candidate{
                id
                _id
                eduHighest
                driveClassEquivalent
            }
            clientMutationId
        }
    }`;

    const variables = {
        id: values.id,
        driveClassEquivalent: values.driveClassEquivalent,
        driveIssuanceCountry: values.driveIssuanceCountry,
        driveIssuanceCategory: values.driveIssuanceCategory,
        driveFirstIssuanceDate: values.driveFirstIssuanceDate,
        driveIsAirBrake: values.driveIsAirBrake || false,
        driveIsManualShift: values.driveIsManualShift || false,
        driveIsLongTrain: values.driveIsLongTrain || false,
        experienceMonths: values.experienceMonths,
        langFRListen: values.langFRListen,
        langFRRead: values.langFRRead,
        langFRWrite: values.langFRWrite,
        langFRSpeak: values.langFRSpeak,
        langENListen: values.langENListen,
        langENRead: values.langENRead,
        langENWrite: values.langENWrite,
        langENSpeak: values.langENSpeak,
        langFRSchooling: values.langFRSchooling,
        langFRHighestLevel: values.langFRHighestLevel,
        langFRYearsSchooling: values.langFRYearsSchooling,
        langENSchooling: values.langENSchooling,
        langENHighestLevel: values.langENHighestLevel,
        langENYearsSchooling: values.langENYearsSchooling,
        langTestCelpip: values.langTestCelpip,
        langTestIelts: values.langTestIelts,
        langTestTef: values.langTestTef,
        langTestTcf: values.langTestTcf,
        langCelpipDateOfTest: values.langCelpipDateOfTest,
        langCelpipListening: values.langCelpipListening,
        langCelpipReading: values.langCelpipReading,
        langCelpipWriting: values.langCelpipWriting,
        langCelpipSpeaking: values.langCelpipSpeaking,
        langIeltsListening: values.langIeltsListening,
        langIeltsReading: values.langIeltsReading,
        langIeltsWriting: values.langIeltsWriting,
        langIeltsSpeaking: values.langIeltsSpeaking,
        langTefListening: values.langTefListening,
        langTefReading: values.langTefReading,
        langTefWriting: values.langTefWriting,
        langTefSpeaking: values.langTefSpeaking,
        langTcfListening: values.langTcfListening,
        langTcfReading: values.langTcfReading,
        langTcfWriting: values.langTcfWriting,
        langTcfSpeaking: values.langTcfSpeaking,
        immCitizenship: values.immCitizenship,
        immRefusedEnterCanada: values.immRefusedEnterCanada,
        immDeported: values.immDeported,
        immRefugee: values.immRefugee,
        immOverstayedVisa: values.immOverstayedVisa,
        immArrested: values.immArrested,
        immCleared: values.immCleared,
        clientMutationId: 'llkjlkjfdlkjlk',
    };

    try {
        yield put({
            type: PUT_CANDIDATE_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: PUT_CANDIDATE_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: PUT_CANDIDATE_OK,
            data: data.data.updateCandidate,
        });
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* postExperience(action) {
    console.log('experience action', action);
    const { values } = action;
    const queryQl = `mutation postExperience(
            $candidate: String 
            $dateFrom: String!
            $dateTo: String!
            $companyName: String!
            $companyStreetAddress: String!
            $companyCity: String!
            $companyCountry: String!
            $companyContactPerson: String!
            $companyContactTelephone: String!
  			$clientMutationId: String
        ){
        createExperience(input: {
            candidate: $candidate
            dateFrom: $dateFrom
            dateTo: $dateTo
            companyName: $companyName
            companyStreetAddress: $companyStreetAddress	
            companyCity: $companyCity
            companyCountry: $companyCountry
          	companyContactPerson: $companyContactPerson
          	companyContactTelephone: $companyContactTelephone
            clientMutationId: $clientMutationId
        }){
            experience{
                id
            }
            clientMutationId
        }
    }`;

    const variables = {
        candidate: values.candidateId,
        dateFrom: values.dateFrom,
        dateTo: values.dateTo,
        companyName: values.companyName,
        companyStreetAddress: values.companyStreetAddress,
        companyCity: values.companyCity,
        companyCountry: values.companyCountry,
        companyContactPerson: values.companyContactPerson,
        companyContactTelephone: values.companyContactTelephone,
        clientMutationId: 'ljlkj',
    };

    try {
        yield put({
            type: POST_EXPERIENCE_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_EXPERIENCE_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: POST_EXPERIENCE_OK,
            data: data.data.createExperience,
        });
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* postFamily(action) {
    console.log('family action', action);
    const { values } = action;
    const queryQl = `mutation postFamily(
            $candidate: String 
            $relationshipType: String!
            $age: Int!
  			$clientMutationId: String
        ){
        createFamily(input: {
            candidate: $candidate
            relationshipType: $relationshipType
            age: $age
            clientMutationId: $clientMutationId
        }){
            family{
                id
            }
            clientMutationId
        }
    }`;

    const variables = {
        candidate: values.candidateId,
        relationshipType: values.relationshipType,
        age: values.age,
        clientMutationId: 'ljlkj',
    };

    try {
        yield put({
            type: POST_FAMILY_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_FAMILY_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: POST_FAMILY_OK,
            data: data.data.createFamily,
        });
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

export default function* () {
    yield all([
        takeLatest(CHECK_ONLINE_STATUS, getCheckOnlineStatus),
        takeLatest(POST_CANDIDATE, postCandidate),
        takeLatest(PUT_CANDIDATE, putCandidate),
        takeLatest(POST_EXPERIENCE, postExperience),
        takeLatest(POST_FAMILY, postFamily),
    ]);
}
