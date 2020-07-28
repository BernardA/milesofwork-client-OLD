import Head from 'next/head';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withCookies, Cookies } from 'react-cookie';
import { withStyles } from '@material-ui/core/styles';
import { Button, FormGroup, Typography } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required } from '../../tools/validator';
import { renderInput } from '../../components/formInputs';
import { actionPostFamily } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import { Loading } from '../../components/loading';
import { COOKIE_OPTIONS } from '../../../parameters';

const styles = () => ({
    actionButton: {
        marginBottom: '30px',
    },
});

class Step8 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNewFamilyMember: true,
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
            dataPostFamily,
            errorPostFamily,
        } = this.props;
        if (!prevProps.dataPostFamily && dataPostFamily) {
            this.setState({
                isAddNewFamilyMember: false,
            });
        } else if (!prevProps.errorPostFamily && errorPostFamily) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'There was an error.',
                    message: 'Please verify below',
                    errors: errorPostFamily,
                },
            });
        }
    }

    submitStep = () => {
        const {
            cookies,
            postFamilyForm: { values },
        } = this.props;
        values.candidateId = cookies.get('candidateId');
        this.props.actionPostFamily(values);
    };

    handleContinue = () => {
        const { cookies } = this.props;
        cookies.set('stepDone', 8, COOKIE_OPTIONS);
        this.props.router.push('/international/step9');
    };

    handleAddNewFamily = () => {
        this.setState({
            isAddNewFamilyMember: true,
        });
        this.props.reset();
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
            // error,
            reset,
            pristine,
            candidate: { isLoading },
            isLoadingFamily,
            classes,
        } = this.props;
        const { isAddNewFamilyMember } = this.state;
        return (
            <div className="container">
                <Head>
                    <title>Create Next App</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    {isLoading || isLoadingFamily ? <Loading /> : null}
                    <div className="title">
                        <Typography variant="h4">
                            Family
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Step 8 of 9
                        </Typography>
                    </div>
                    {!isAddNewFamilyMember ? (
                        <div>
                            <FormGroup>
                                <Button
                                    className={classes.actionButton}
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleAddNewFamily}
                                >
                                    Add family member
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
                                name="postFamilyForm"
                                onSubmit={handleSubmit(this.submitStep)}
                            >
                                <div className="form_input">
                                    <Field
                                        name="relationshipType"
                                        type="text"
                                        label="Relationship"
                                        variant="outlined"
                                        component={renderInput}
                                        validate={[required]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="age"
                                        type="number"
                                        label="Age"
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

Step8.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
};

const mapStateToProps = (state) => {
    return {
        candidate: state.candidate,
        dataPostFamily: state.family.dataPostFamily,
        errorPostFamily: state.family.errorPostFamily,
        isLoadingFamily: state.family.isLoading,
        postFamilyForm: state.form.postFamilyForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostFamily,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: 'postFamilyForm',
    })(withRouter(withCookies(withStyles(styles)(Step8)))),
);
