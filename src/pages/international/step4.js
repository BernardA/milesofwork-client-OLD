import Head from 'next/head';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withCookies, Cookies } from 'react-cookie';
import { Button, FormGroup, Typography } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required } from '../../tools/validator';
import { getMonthsBetweenDates } from '../../tools/functions';
import { renderInput } from '../../components/formInputs';
import CountrySelect from '../../components/countrySelect';
import { actionPutCandidate, actionPostExperience } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import { Loading } from '../../components/loading';
import { MonthYearPicker } from '../../components/datePickers';
import { COOKIE_OPTIONS } from '../../../parameters';


class Step4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateFrom: null,
            dateTo: null,
            experienceMonths: 0,
            isAddNewExperience: true,
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
            dataPostExperience,
            errorPostExperience,
            candidate,
            cookies,
            router } = this.props;
        if (!prevProps.dataPostExperience && dataPostExperience) {
            this.setState({
                isAddNewExperience: false,
            });
        } else if (!prevProps.errorPostExperience && errorPostExperience) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'There was an error.',
                    message: 'Please verify below',
                    errors: errorPostExperience,
                },
            });
        }
        if (prevProps.candidate.dataPutCandidate !== candidate.dataPutCandidate) {
            cookies.set('stepDone', 4, COOKIE_OPTIONS);
            router.push('/international/step5');
        }
    }

    submitStep = () => {
        const {
            postExperienceForm: { values },
            cookies,
        } = this.props;
        values.candidateId = cookies.get('candidateId');
        // convert date object to year-month string
        const dateFrom = values.dateFrom;
        const monthFrom = dateFrom.getUTCMonth() + 1; //months from 1-12
        const yearFrom = dateFrom.getUTCFullYear();
        values.dateFrom = `${yearFrom}-${monthFrom}`;
        const dateTo = values.dateTo;
        const monthTo = dateTo.getUTCMonth() + 1; //months from 1-12
        const yearTo = dateTo.getUTCFullYear();
        values.dateTo = `${yearTo}-${monthTo}`;
        // get months experience
        this.setState((state) => {
            return {
                experienceMonths: state.experienceMonths +
                    getMonthsBetweenDates(dateFrom, dateTo, true)
            }
        });
        this.props.actionPostExperience(values);
    };

    handleContinue = () => {
        const { cookies } = this.props;
        cookies.set('stepDone', 4, COOKIE_OPTIONS);
        // put experience months 
        const values = {
            id: cookies.get('candidateId'),
            experienceMonths: this.state.experienceMonths,
        };
        this.props.actionPutCandidate(values)
    }

    handleAddNewExperience = () => {
        this.setState({
            isAddNewExperience: true,
            dateTo: null,
            dateFrom: null,
        });
        this.props.reset();
    }

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
            // error,
            reset,
            pristine,
            candidate: { isLoading },
            isLoadingExperience,
        } = this.props;
        const { isAddNewExperience } = this.state;
        return (
            <div className="container">
                <Head>
                    <title>Create Next App</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    {isLoading || isLoadingExperience ? <Loading /> : null}
                    <div className="title">
                        <Typography variant="h4">Professional experience</Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Step 4 of 9
                        </Typography>
                    </div>
                    {!isAddNewExperience ? (
                        <div>
                            <FormGroup>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleAddNewExperience}
                                >
                                    Add experience
                                </Button>
                                <Button
                                    onClick={this.handleContinue}
                                    variant="contained"
                                    color="primary"
                                >
                                    Continue
                                </Button>
                            </FormGroup>
                        </div>
                    ) : (
                        <>
                            <form
                                name="postExperienceForm"
                                onSubmit={handleSubmit(this.submitStep)}
                            >
                                <div className="form_input">
                                    <Field
                                        name="dateFrom"
                                        label="From"
                                        helperText="year and month"
                                        disableFuture
                                        formatDate="MM/yyyy"
                                        component={MonthYearPicker}
                                        selected={this.state.dateFrom}
                                        handleChange={(date) =>
                                            this.setState({
                                                dateFrom: date,
                                            })
                                        }
                                        validate={[required]}
                                        autoFocus
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="dateTo"
                                        label="To"
                                        helperText="year and month"
                                        disableFuture
                                        formatDate="MM/yyyy"
                                        component={MonthYearPicker}
                                        selected={this.state.dateTo}
                                        handleChange={(date) =>
                                            this.setState({
                                                dateTo: date,
                                            })
                                        }
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="companyName"
                                        type="text"
                                        label="Company name"
                                        variant="outlined"
                                        component={renderInput}
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="companyStreetAddress"
                                        type="text"
                                        label="Company street address"
                                        variant="outlined"
                                        component={renderInput}
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="companyCity"
                                        type="text"
                                        label="Company city"
                                        variant="outlined"
                                        component={renderInput}
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="companyCountry"
                                        type="text"
                                        label="Company country"
                                        variant="outlined"
                                        component={CountrySelect}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="companyContactPerson"
                                        type="text"
                                        label="Company contact person"
                                        variant="outlined"
                                        component={renderInput}
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="companyContactTelephone"
                                        type="text"
                                        label="Company contact telephone"
                                        variant="outlined"
                                        component={renderInput}
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
                                            Submit
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

Step4.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
};

const mapStateToProps = (state) => {
    return {
        candidate: state.candidate,
        dataPostExperience: state.experience.dataPostExperience,
        errorPostExperience: state.experience.errorPostExperience,
        isLoadingExperience: state.experience.isLoading,
        postExperienceForm: state.form.postExperienceForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPutCandidate,
            actionPostExperience,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: 'postExperienceForm',
    })(withRouter(withCookies(Step4))),
);
