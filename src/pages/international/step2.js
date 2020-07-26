import Head from 'next/head';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withCookies, Cookies } from 'react-cookie';
import {
    Button,
    FormGroup,
    MenuItem,
    Typography,
} from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required } from '../../tools/validator';
import { renderInput } from '../../components/formInputs';
import RenderSelect from '../../components/formInputRenderSelect';
import CountrySelect from '../../components/countrySelect';
import { actionPostCandidate } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
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
        console.log('UPDATE', this.props);
        if (prevProps.candidate !== candidate) {
            const { dataPostCandidate, errorPostCandidate } = candidate;
            if (dataPostCandidate) {
                if (candidate.dataPostCandidate.eduHighest === '1') {
                    router.push({
                        pathname: '/international/notification',
                        query: { reason: 'edu'},
                    });
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
                    router.push({
                        pathname: '/international/notification',
                        query: { reason: 'email'},
                    });
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
        console.log('props submit', this.props);
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
            isLoading,
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
                            Education
                        </Typography>
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
                                <div className="form_input">
                                    <Field
                                        name="eduHighest"
                                        type="select"
                                        label="Highest level of education completed"
                                        variant="outlined"
                                        component={RenderSelect}
                                        validate={[required]}
                                        autoFocus
                                    >
                                        <MenuItem value="1">Primary</MenuItem>
                                        <MenuItem value="2">
                                            High school
                                        </MenuItem>
                                        <MenuItem value="3">
                                            University
                                        </MenuItem>
                                    </Field>
                                </div>
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
