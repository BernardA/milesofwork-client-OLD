import Head from 'next/head';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withCookies, Cookies } from 'react-cookie';
import { withStyles } from '@material-ui/core/styles';
import { Button, FormGroup, Typography, Divider } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required } from '../../tools/validator';
import { renderInput, renderCheckBox, renderRadio } from '../../components/formInputs';
import { actionPutCandidate } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import { Loading } from '../../components/loading';
import LangTestResults from '../../components/langTestResults';
import { COOKIE_OPTIONS } from '../../../parameters';

const styles = () => ({
    groupContainer: {
        marginBottom: '40px',
        borderBottom: '2px solid #ccc',
    },
    caption: {
        marginBottom: '20px',
    }
});

class Step7 extends React.Component {
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
        console.log('UPDATE', this.props);
        if (prevProps.candidate !== candidate) {
            const { dataPutCandidate, errorPutCandidate } = candidate;
            if (prevProps.candidate.dataPutCandidate !== dataPutCandidate) {
                cookies.set('stepDone', 7, COOKIE_OPTIONS);
                router.push('/international/step8');
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
        console.log('props submit', this.props);
        const {
            cookies,
            putCandidateStep7: { values },
        } = this.props;
        values.id = cookies.get('candidateId');
        values.langFRSchooling = values.langFRSchooling === '1' ? true : false;
        values.langENSchooling = values.langENSchooling === '1' ? true : false;
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
        console.log('STEP7', this.props);
        const {
            handleSubmit,
            submitting,
            invalid,
            error,
            reset,
            pristine,
            isLoading,
            putCandidateStep7,
            classes,
        } = this.props;
        const values = putCandidateStep7 && putCandidateStep7.values || null;
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
                            Language - Schooling & Tests
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Step 7 of 9
                        </Typography>
                    </div>
                    {error ? (
                        <div>{error.messageKey}</div>
                    ) : (
                        <>
                            <form
                                name="putCandidateStep7"
                                onSubmit={handleSubmit(this.submitStep)}
                            >
                                <div className={classes.groupContainer}>
                                    <FormGroup className="checkbox">
                                        <div>
                                            <Typography variant="body2">
                                                Have you done any of your
                                                schooling where the language
                                                most often spoken was French ?
                                            </Typography>
                                        </div>
                                        <Field
                                            name="langFRSchooling"
                                            type="radio"
                                            row
                                            className="radioJustify"
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
                                    {values &&
                                    values.langFRSchooling &&
                                    values.langFRSchooling === '1' ? (
                                        <>
                                            <FormGroup className="checkbox">
                                                <div>
                                                    <Typography variant="body2">
                                                        What was your highest
                                                        level of education in
                                                        French?
                                                    </Typography>
                                                </div>
                                                <Field
                                                    name="langFRHighestLevel"
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
                                                            title:
                                                                'Secondary(High school)',
                                                            id: 'secondary',
                                                            value: '2',
                                                        },
                                                        {
                                                            title:
                                                                'Tertiary (University)',
                                                            id: 'tertiary',
                                                            value: '3',
                                                        },
                                                    ]}
                                                />
                                            </FormGroup>
                                            <Divider />
                                            <div className="form_input checkbox">
                                                <Typography variant="body2">
                                                    How many years, in total,
                                                    did you study in French?
                                                </Typography>
                                                <Field
                                                    name="langFRYearsSchooling"
                                                    type="number"
                                                    variant="outlined"
                                                    component={renderInput}
                                                    validate={[required]}
                                                />
                                            </div>
                                            <Divider />
                                        </>
                                    ) : null}
                                </div>
                                <div className={classes.groupContainer}>
                                    <FormGroup className="checkbox">
                                        <div>
                                            <Typography variant="body2">
                                                Have you done any of your
                                                schooling where the language
                                                most often spoken was English?
                                            </Typography>
                                        </div>
                                        <Field
                                            name="langENSchooling"
                                            type="radio"
                                            className="radioJustify"
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
                                    {values &&
                                    values.langENSchooling &&
                                    values.langENSchooling === '1' ? (
                                        <>
                                            <FormGroup className="checkbox">
                                                <div>
                                                    <Typography variant="body2">
                                                        What was your highest
                                                        level of education in
                                                        English
                                                    </Typography>
                                                </div>
                                                <Field
                                                    name="langENHighestLevel"
                                                    type="radio"
                                                    row
                                                    component={renderRadio}
                                                    validate={[required]}
                                                    options={[
                                                        {
                                                            title: 'Primary',
                                                            id: 'Primary',
                                                            value: '1',
                                                        },
                                                        {
                                                            title:
                                                                'Secondary(High school)',
                                                            id: 'secondary',
                                                            value: '2',
                                                        },
                                                        {
                                                            title:
                                                                'Tertiary (University)',
                                                            id: 'tertiary',
                                                            value: '3',
                                                        },
                                                    ]}
                                                />
                                            </FormGroup>
                                            <Divider />
                                            <div className="form_input checkbox">
                                                <Typography variant="body2">
                                                    How many years, in total,
                                                    did you study in English?
                                                </Typography>
                                                <Field
                                                    name="langENYearsSchooling"
                                                    type="number"
                                                    variant="outlined"
                                                    component={renderInput}
                                                    validate={[required]}
                                                />
                                            </div>
                                            <Divider />
                                        </>
                                    ) : null}
                                </div>
                                <FormGroup className="checkbox">
                                    <div className={classes.caption}>
                                        <Typography variant="body2">
                                            Have you ever done any of these
                                            tests (multiple choice)?
                                        </Typography>
                                    </div>
                                    <div className={classes.groupContainer}>
                                        <div className="form_input">
                                            <Field
                                                name="langTestCelpip"
                                                type="checkbox"
                                                label={
                                                    <Typography variant="body2">
                                                        Canadian English
                                                        Language Proficiency
                                                        Index (CELPIP- General)
                                                    </Typography>
                                                }
                                                variant="outlined"
                                                component={renderCheckBox}
                                            />
                                        </div>
                                        {values && values.langTestCelpip ? (
                                            <LangTestResults
                                                testName="CELPIP"
                                                fieldName={[
                                                    'langCelpipDateOfTest',
                                                    'langCelpipListening',
                                                    'langCelpipReading',
                                                    'langCelpipWriting',
                                                    'langCelpipSpeaking',
                                                ]}
                                            />
                                        ) : null}
                                    </div>
                                    <div className={classes.groupContainer}>
                                        <div className="form_input">
                                            <Field
                                                name="langTestIelts"
                                                type="checkbox"
                                                label={
                                                    <Typography variant="body2">
                                                        International English
                                                        Language System (IELTS)
                                                    </Typography>
                                                }
                                                variant="outlined"
                                                component={renderCheckBox}
                                            />
                                        </div>
                                        {values && values.langTestIelts ? (
                                            <LangTestResults
                                                testName="IELTS"
                                                fieldName={[
                                                    'langIeltsDateOfTest',
                                                    'langIeltsListening',
                                                    'langIeltsReading',
                                                    'langIeltsWriting',
                                                    'langIeltsSpeaking',
                                                ]}
                                            />
                                        ) : null}
                                    </div>
                                    <div className={classes.groupContainer}>
                                        <div className="form_input">
                                            <Field
                                                name="langTestTef"
                                                type="checkbox"
                                                label={
                                                    <Typography variant="body2">
                                                        Test d’évaluation de
                                                        français (TEF Canada)
                                                    </Typography>
                                                }
                                                variant="outlined"
                                                component={renderCheckBox}
                                            />
                                        </div>
                                        {values && values.langTestTef ? (
                                            <LangTestResults
                                                testName="TEF"
                                                fieldName={[
                                                    'langTefDateOfTest',
                                                    'langTefListening',
                                                    'langTefReading',
                                                    'langTefWriting',
                                                    'langTefSpeaking',
                                                ]}
                                            />
                                        ) : null}
                                    </div>
                                    <div className={classes.groupContainer}>
                                        <div className="form_input">
                                            <Field
                                                name="langTestTcf"
                                                type="checkbox"
                                                label={
                                                    <Typography variant="body2">
                                                        Test de connaissance du
                                                        français (TCF Canada)
                                                    </Typography>
                                                }
                                                variant="outlined"
                                                component={renderCheckBox}
                                            />
                                        </div>
                                        {values && values.langTestTcf ? (
                                            <LangTestResults
                                                testName="TCF"
                                                fieldName={[
                                                    'langTcfDateOfTest',
                                                    'langTcfListening',
                                                    'langTcfReading',
                                                    'langTcfWriting',
                                                    'langTcfSpeaking',
                                                ]}
                                            />
                                        ) : null}
                                    </div>
                                </FormGroup>
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

Step7.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
};

const mapStateToProps = (state) => {
    return {
        putCandidateStep7: state.form.putCandidateStep7,
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
        form: 'putCandidateStep7',
    })(withRouter(withCookies(withStyles(styles)(Step7)))),
);
