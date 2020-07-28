import Head from 'next/head';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withCookies, Cookies } from 'react-cookie';
import { Button, FormGroup, Typography, Divider } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required } from '../../tools/validator';
import { renderRadio } from '../../components/formInputs';
import { actionPutCandidate } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import { Loading } from '../../components/loading';
import CountrySelect from '../../components/countrySelect';
import { COOKIE_OPTIONS } from '../../../parameters';

class Step9 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidUpdate(prevProps) {
        const {
            candidate,
            router,
            cookies,
            putCandidateStep9: { values },
        } = this.props;
        if (prevProps.candidate !== candidate) {
            const { dataPutCandidate, errorPutCandidate } = candidate;
            if (prevProps.candidate.dataPutCandidate !== dataPutCandidate) {
                if (!values.immIsCleared) {
                    router.push(
                        '/international/notification/[reason]',
                        '/international/notification/immIsCleared',
                    );
                } else {
                    cookies.set('stepDone', 9, COOKIE_OPTIONS);
                    router.push(
                        '/international/notification/[reason]',
                        '/international/notification/success',
                    );
                }
            } else if (!prevProps.errorPutCandidate && errorPutCandidate) {
                this.setState({
                    notification: {
                        status: 'error',
                        title: 'There was an error.',
                        message: 'Please verify below',
                        errors: errorPutCandidate,
                    },
                });
            }
        }
    }

    submitStep = () => {
        const {
            cookies,
            putCandidateStep9: { values },
        } = this.props;
        values.id = cookies.get('candidateId');
        values.immRefusedEnterCanada = values.immRefusedEnterCanada === '1' ? true : false;
        values.immDeported = values.immDeported === '1' ? true : false;
        values.immRefugee = values.immRefugee === '1' ? true : false;
        values.immOverstayedVisa = values.immOverstayedVisa === '1' ? true : false;
        values.immArrested = values.immArrested === '1' ? true : false;
        values.immIsCleared = true;
        if (values.immRefusedEnterCanada || values.immDeported || values.immRefugee || values.immOverstayedVisa || values.immArresed) {
            values.immIsCleared = false;
        }
        this.props.actionPutCandidate(values);
    };

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
    };

    render() {
        const {
            handleSubmit,
            submitting,
            invalid,
            error,
            reset,
            pristine,
            candidate: { isLoading },
        } = this.props;
        return (
            <div className="container">
                <Head>
                    <title>Create Next App</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    {isLoading ? <Loading /> : null}
                    <div className="title">
                        <Typography variant="h4">
                            Immigration situation
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Step 9 of 9
                        </Typography>
                    </div>
                    {error ? (
                        <div>{error.messageKey}</div>
                    ) : (
                        <>
                            <form
                                name="putCandidateStep9"
                                onSubmit={handleSubmit(this.submitStep)}
                            >
                                <div className="form_input">
                                    <Field
                                        name="immCitizenship"
                                        type="text"
                                        label="Country of citizenship"
                                        variant="outlined"
                                        component={CountrySelect}
                                    />
                                </div>
                                <FormGroup className="checkbox">
                                    <div>
                                        <Typography variant="body2">
                                            Have you or any of your immediate
                                            family ever applied to enter Canada
                                            and been refused?
                                        </Typography>
                                    </div>
                                    <Field
                                        name="immRefusedEnterCanada"
                                        type="radio"
                                        row
                                        component={renderRadio}
                                        validate={[required]}
                                        options={[
                                            {
                                                title: 'Yes',
                                                id: 'yes',
                                                value: '1',
                                            },
                                            {
                                                title: 'No',
                                                id: 'no',
                                                value: '0',
                                            },
                                        ]}
                                    />
                                </FormGroup>
                                <Divider />
                                <FormGroup className="checkbox">
                                    <div>
                                        <Typography variant="body2">
                                            Have you or any of your immediate
                                            family ever been deported from any
                                            country?
                                        </Typography>
                                    </div>
                                    <Field
                                        name="immDeported"
                                        type="radio"
                                        row
                                        component={renderRadio}
                                        validate={[required]}
                                        options={[
                                            {
                                                title: 'Yes',
                                                id: 'yes',
                                                value: '1',
                                            },
                                            {
                                                title: 'No',
                                                id: 'no',
                                                value: '0',
                                            },
                                        ]}
                                    />
                                </FormGroup>
                                <Divider />
                                <FormGroup className="checkbox">
                                    <div>
                                        <Typography variant="body2">
                                            Have you or any of your immediate
                                            family ever claimed refugee status
                                            in any country?
                                        </Typography>
                                    </div>
                                    <Field
                                        name="immRefugee"
                                        type="radio"
                                        row
                                        component={renderRadio}
                                        validate={[required]}
                                        options={[
                                            {
                                                title: 'Yes',
                                                id: 'yes',
                                                value: '1',
                                            },
                                            {
                                                title: 'No',
                                                id: 'no',
                                                value: '0',
                                            },
                                        ]}
                                    />
                                </FormGroup>
                                <Divider />
                                <FormGroup className="checkbox">
                                    <div>
                                        <Typography variant="body2">
                                            Have you or any of your immediate
                                            family ever overstayed your visa in
                                            any country?
                                        </Typography>
                                    </div>
                                    <Field
                                        name="immOverstayedVisa"
                                        type="radio"
                                        row
                                        component={renderRadio}
                                        validate={[required]}
                                        options={[
                                            {
                                                title: 'Yes',
                                                id: 'yes',
                                                value: '1',
                                            },
                                            {
                                                title: 'No',
                                                id: 'no',
                                                value: '0',
                                            },
                                        ]}
                                    />
                                </FormGroup>
                                <Divider />
                                <FormGroup className="checkbox">
                                    <div>
                                        <Typography variant="body2">
                                            Have you or any of your immediate
                                            family ever been arrested, even if
                                            you were not charged, in any
                                            country?
                                        </Typography>
                                    </div>
                                    <Field
                                        name="immArrested"
                                        type="radio"
                                        row
                                        component={renderRadio}
                                        validate={[required]}
                                        options={[
                                            {
                                                title: 'Yes',
                                                id: 'yes',
                                                value: '1',
                                            },
                                            {
                                                title: 'No',
                                                id: 'no',
                                                value: '0',
                                            },
                                        ]}
                                    />
                                </FormGroup>
                                <Divider />
                                <div className="form_input form_submit">
                                    <FormGroup row>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={submitting || invalid}
                                            name="submit"
                                            type="submit"
                                        >
                                            Continue
                                        </Button>
                                        <Button
                                            disabled={pristine || submitting}
                                            onClick={reset}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Clear
                                        </Button>
                                    </FormGroup>
                                </div>
                            </form>
                            <NotifierDialog
                                notification={this.state.notification}
                                handleNotificationDismiss={
                                    this.handleNotificationDismiss
                                }
                            />
                        </>
                    )}
                </main>
            </div>
        );
    }
}

Step9.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
};

const mapStateToProps = (state) => {
    return {
        putCandidateStep9: state.form.putCandidateStep9,
        postCandidateForm: state.form.postCandidateForm,
        candidate: state.candidate,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPutCandidate,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: 'putCandidateStep9',
    })(withRouter(withCookies(Step9))),
);

