export const CHECK_ONLINE_STATUS = 'CHECK_ONLINE_STATUS';
export const CHECK_ONLINE_STATUS_OK = 'CHECK_ONLINE_STATUS_OK';
export const CHECK_ONLINE_STATUS_ERROR = 'CHECK_ONLINE_STATUS_ERROR';

export const POST_CANDIDATE = 'POST_CANDIDATE';
export const POST_CANDIDATE_INIT = 'POST_CANDIDATE_INIT';
export const POST_CANDIDATE_OK = 'POST_CANDIDATE_OK';
export const POST_CANDIDATE_ERROR = 'POST_CANDIDATE_ERROR';

export const PUT_CANDIDATE = 'PUT_CANDIDATE';
export const PUT_CANDIDATE_INIT = 'PUT_CANDIDATE_INIT';
export const PUT_CANDIDATE_OK = 'PUT_CANDIDATE_OK';
export const PUT_CANDIDATE_ERROR = 'PUT_CANDIDATE_ERROR';

export const POST_EXPERIENCE = 'POST_EXPERIENCE';
export const POST_EXPERIENCE_INIT = 'POST_EXPERIENCE_INIT';
export const POST_EXPERIENCE_OK = 'POST_EXPERIENCE_OK';
export const POST_EXPERIENCE_ERROR = 'POST_EXPERIENCE_ERROR';

export const POST_FAMILY = 'POST_FAMILY';
export const POST_FAMILY_INIT = 'POST_FAMILY_INIT';
export const POST_FAMILY_OK = 'POST_FAMILY_OK';
export const POST_FAMILY_ERROR = 'POST_FAMILY_ERROR';

export const actionCheckOnlineStatus = () => ({
    type: CHECK_ONLINE_STATUS,
});

export function actionPostCandidate(values) {
    return {
        type: POST_CANDIDATE,
        values,
    };
}

export function actionPutCandidate(values) {
    return {
        type: PUT_CANDIDATE,
        values,
    };
}

export function actionPostExperience(values) {
    return {
        type: POST_EXPERIENCE,
        values,
    };
}

export function actionPostFamily(values) {
    return {
        type: POST_FAMILY,
        values,
    };
}