import Head from 'next/head';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withCookies, Cookies } from 'react-cookie';
import { Button, FormGroup, Typography } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required } from '../../tools/validator';
import { renderInput, renderCheckBox, renderRadio } from '../../components/formInputs';
import CountrySelect from '../../components/countrySelect';
import { actionPutCandidate } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import { Loading } from '../../components/loading';
import { DatePicker } from '../../components/datePickers';
import { COOKIE_OPTIONS } from '../../../parameters';

class Step3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            issuanceDate: null,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidUpdate(prevProps) {
        const { candidate, router, cookies } = this.props;
        if (prevProps.candidate !== candidate) {
            const { dataPutCandidate, errorPutCandidate } = candidate;
            if (prevProps.candidate.dataPutCandidate !== dataPutCandidate) {
                if (candidate.dataPutCandidate.candidate.driveClassEquivalent > 1) {
                    router.push(
                        '/international/notification/[reason]',
                        '/international/notification/driveClassEquivalent',
                    );
                } else {
                    cookies.set(
                        'driveClassEquivalent',
                        candidate.dataPutCandidate.candidate.driveClassEquivalent,
                        COOKIE_OPTIONS,
                    );
                    cookies.set('stepDone', 3, COOKIE_OPTIONS);
                    router.push('/international/step4');
                }
            } else if (errorPutCandidate) {
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
        const { cookies, putCandidateStep3Form: { values } } = this.props;
        values.id = cookies.get('candidateId');
        const date = values.driveFirstIssuanceDate;
        const month = date.getUTCMonth() + 1; //months from 1-12
        const day = date.getUTCDate();
        const year = date.getUTCFullYear();
        values.driveFirstIssuanceDate = `${year}-${month}-${day}`;
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
                        <Typography variant="h4">Driving skills</Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Step 3 of 9
                        </Typography>
                    </div>
                    {error ? (
                        <div>{error.messageKey}</div>
                    ) : (
                        <>
                            <div>
                                <img
                                    src="/images/help-classes.jpg"
                                    alt="driver licence class"
                                />
                            </div>
                            <form
                                name="putCandidateStep3Form"
                                onSubmit={handleSubmit(this.submitStep)}
                            >
                                <FormGroup className="checkbox">
                                    <div>
                                        <Typography variant="body2">
                                            Highest level of driver's licence ( per above )
                                        </Typography>
                                    </div>
                                    <Field
                                        name="driveClassEquivalent"
                                        type="radio"
                                        component={renderRadio}
                                        validate={[required]}
                                        options={[
                                            {
                                                title: 'Class1',
                                                id: 'class1',
                                                value: '1',
                                            },
                                            {
                                                title: 'Class2',
                                                id: 'class2',
                                                value: '2',
                                            },
                                            {
                                                title: 'Class3',
                                                id: 'class3',
                                                value: '3',
                                            },
                                        ]}
                                    />
                                </FormGroup>
                                <div className="form_input">
                                    <Field
                                        name="driveIssuanceCountry"
                                        type="text"
                                        label="Country of issuance"
                                        variant="outlined"
                                        component={CountrySelect}
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="driveIssuanceCategory"
                                        type="text"
                                        label="Local category name"
                                        variant="outlined"
                                        component={renderInput}
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="driveFirstIssuanceDate"
                                        label="Date of first issuance"
                                        disableFuture
                                        formatDate="dd/MM/yyyy"
                                        component={DatePicker}
                                        selected={this.state.issuanceDate}
                                        handleChange={(date) =>
                                            this.setState({
                                                issuanceDate: date,
                                            })
                                        }
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input checkbox">
                                    <Field
                                        name="driveIsAirBrake"
                                        type="checkbox"
                                        label={
                                            <Typography variant="body2">
                                                Do you have experience with an
                                                air brake system?
                                            </Typography>
                                        }
                                        variant="outlined"
                                        component={renderCheckBox}
                                    />
                                </div>
                                <div className="form_input checkbox">
                                    <Field
                                        name="driveIsManualShift"
                                        type="checkbox"
                                        label={
                                            <Typography variant="body2">
                                                Do you have experience with
                                                manual shift?
                                            </Typography>
                                        }
                                        variant="outlined"
                                        component={renderCheckBox}
                                    />
                                </div>
                                <div className="form_input checkbox">
                                    <Field
                                        name="driveIsLongTrain"
                                        type="checkbox"
                                        label={
                                            <Typography variant="body2">
                                                Do you have experience driving a
                                                road train, that is, a double
                                                road train more than 25 metres
                                                long?
                                            </Typography>
                                        }
                                        variant="outlined"
                                        component={renderCheckBox}
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
}

Step3.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
};

const mapStateToProps = (state) => {
    return {
        putCandidateStep3Form: state.form.putCandidateStep3Form,
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
        form: 'putCandidateStep3Form',
    })(withRouter(withCookies(Step3))),
);
