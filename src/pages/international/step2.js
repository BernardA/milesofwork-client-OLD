import Head from 'next/head';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withCookies, Cookies } from 'react-cookie';
import {
    Button,
    FormGroup,
    Typography,
} from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required } from '../../tools/validator';
import { renderInput, renderRadio } from '../../components/formInputs';
import CountrySelect from '../../components/countrySelect';
import { actionPostCandidate } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import NotifierInline from '../../components/notifierInline';
import { Loading } from '../../components/loading';
import { YearPicker } from '../../components/datePickers';
import { COOKIE_OPTIONS } from '../../../parameters';

class Step2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highestYear: null,
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
        } = this.props;
        if (prevProps.candidate !== candidate) {
            const { dataPostCandidate, errorPostCandidate } = candidate;
            if (dataPostCandidate) {
                if (candidate.dataPostCandidate.candidate.eduHighest === 1) {
                    router.push(
                        '/international/notification/[reason]',
                        '/international/notification/eduHighest'
                    )
                } else {
                    cookies.set(
                        'candidateId',
                        candidate.dataPostCandidate.candidate.id,
                        COOKIE_OPTIONS,
                    );
                    cookies.set(
                        'eduHighest',
                        candidate.dataPostCandidate.candidate.eduHighest,
                        COOKIE_OPTIONS,
                    );
                    cookies.set(
                        'stepDone',
                        2,
                        COOKIE_OPTIONS,
                    );
                    router.push('/international/step3');
                }
            } else if (errorPostCandidate) {
                if (
                    errorPostCandidate[0].persoEmail &&
                    errorPostCandidate[0].persoEmail.includes('already used')) {
                    router.push(
                        '/international/notification/[reason]',
                        '/international/notification/email',
                    );
                } else {
                    this.setState({
                        notification: {
                            status: 'error',
                            title: 'There was an error.',
                            message: 'Please verify below',
                            errors: errorPostCandidate,
                        },
                    });
                }
            }
        }
    }

    submitStep = () => {
        const { postCandidateForm: { values } } = this.props;
        const date = values.eduHighestYearAttained;
        values.eduHighestYearAttained = date.getUTCFullYear();
        this.props.actionPostCandidate(values);
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
                    <NotifierInline
                        message="Candidate created in db. If fails eduHighest redirected to /notification"
                        severity="info"
                        isNotClosable
                    />
                    {isLoading ? <Loading /> : null}
                    <div className="title">
                        <Typography variant="h4">Education</Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Step 2 of 9
                        </Typography>
                    </div>
                    {error ? (
                        <div>{error.messageKey}</div>
                    ) : (
                        <>
                            <form
                                name="postCandidateForm"
                                onSubmit={handleSubmit(this.submitStep)}
                            >
                                <FormGroup className="checkbox">
                                    <div>
                                        <Typography variant="body2">
                                            Highest level of education completed
                                        </Typography>
                                    </div>
                                    <Field
                                        name="eduHighest"
                                        type="radio"
                                        component={renderRadio}
                                        validate={[required]}
                                        options={[
                                            {
                                                title: 'Primary',
                                                id: 'Primary',
                                                value: '1',
                                            },
                                            {
                                                title: 'Secondary(High school)',
                                                id: 'secondary',
                                                value: '2',
                                            },
                                            {
                                                title: 'Tertiary (University)',
                                                id: 'tertiary',
                                                value: '3',
                                            },
                                        ]}
                                    />
                                </FormGroup>
                                <div className="form_input">
                                    <Field
                                        name="eduHighestYearAttained"
                                        label="Year attained"
                                        formatDate="yyyy"
                                        maxDate={new Date()}
                                        variant="outlined"
                                        component={YearPicker}
                                        validate={[required]}
                                        selected={this.state.highestYear}
                                        handleChange={(date) =>
                                            this.setState({
                                                highestYear: date,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="eduHighestNameOfSchool"
                                        type="text"
                                        label="Name of school"
                                        variant="outlined"
                                        component={renderInput}
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="eduHighestCity"
                                        type="text"
                                        label="City"
                                        variant="outlined"
                                        component={renderInput}
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="eduHighestCountry"
                                        type="text"
                                        label="Country"
                                        variant="outlined"
                                        component={CountrySelect}
                                        validate={[required]}
                                    />
                                </div>
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
};

Step2.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
};

const mapStateToProps = (state) => {
    return {
        postCandidateForm: state.form.postCandidateForm,
        candidate: state.candidate,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostCandidate,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: 'postCandidateForm',
        destroyOnUnmount: false,
    })(withRouter(withCookies(Step2))),
);
