import Head from 'next/head';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { withCookies, Cookies } from 'react-cookie';
import {
    Button,
    FormGroup,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    Table,
    TableContainer,
    Paper,
    Typography,
} from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required } from '../../tools/validator';
import { renderRadio } from '../../components/formInputs';
import { actionPutCandidate } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import { Loading } from '../../components/loading';
import { COOKIE_OPTIONS } from '../../../parameters';

const styles = (theme) => ({
    MuiTableHeadRoot: {
        '& th': {
            paddingLeft: '2px',
            paddingRight: '2px',
            fontSize: '13px',
        },
    },
    MuiTableCellRoot: {
        '& div:first-child': {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            '& label': {
                display: 'grid',
                margin: 0,
            },
        },
    },
    thCenter: {
        '& th': {
            textAlign: 'center',
        },
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        height: '100%',
        boxShadow: 'none',
    },
    nav: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    table: {
        '& td': {
            padding: '16px 4px',
        },
        '& th': {
            padding: '16px 4px',
        },
    },
});

const fields = [
    {
        name: 'langENListen',
        title: 'Listening',
    },
    {
        name: 'langENRead',
        title: 'Reading',
    },
    {
        name: 'langENWrite',
        title: 'Writing',
    },
    {
        name: 'langENSpeak',
        title: 'Speaking',
    },
];

class Step6 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isIntermediateOrHigher: true,
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
                if (!this.state.isIntermediateOrHigher) {
                    router.push({
                        pathname: '/international/notification',
                        query: { reason: 'langSelf' },
                    });
                } else {
                    cookies.set('stepDone', 6, COOKIE_OPTIONS);
                    router.push('/international/step7');
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
        console.log('props submit', this.props);
        const {
            cookies,
            putCandidateStep6Form: { values },
        } = this.props;
        // set state if any assessment is basic
        for (const [key, value] of Object.entries(values)) {
            if (value === '1') {
                this.setState({ isIntermediateOrHigher: false });
            }
        }
        values.id = cookies.get('candidateId');
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
        console.log('STEP6', this.props);
        const {
            handleSubmit,
            submitting,
            invalid,
            error,
            reset,
            pristine,
            candidate: { isLoading },
            classes,
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
                            Self-assessment - English
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Step 6 of 9
                        </Typography>
                    </div>
                    {error ? (
                        <div>{error.messageKey}</div>
                    ) : (
                        <>
                            <form
                                name="putCandidateStep6Form"
                                onSubmit={handleSubmit(this.submitStep)}
                            >
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead
                                            className={classes.MuiTableHeadRoot}
                                        >
                                            <TableRow
                                                className={classes.thCenter}
                                            >
                                                <TableCell></TableCell>
                                                <TableCell>Basic</TableCell>
                                                <TableCell>
                                                    Intermediate
                                                </TableCell>
                                                <TableCell>Advanced</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fields.map((field) => (
                                                <TableRow key={field.title}>
                                                    <TableCell>
                                                        {field.title}
                                                    </TableCell>
                                                    <TableCell
                                                        colSpan={3}
                                                        className={
                                                            classes.MuiTableCellRoot
                                                        }
                                                    >
                                                        <Field
                                                            name={field.name}
                                                            type="radio"
                                                            row
                                                            component={
                                                                renderRadio
                                                            }
                                                            validate={[
                                                                required,
                                                            ]}
                                                            options={[
                                                                {
                                                                    title: '',
                                                                    id: 'basic',
                                                                    value: '1',
                                                                },
                                                                {
                                                                    title: '',
                                                                    id:
                                                                        'intermediate',
                                                                    value: '2',
                                                                },
                                                                {
                                                                    title: '',
                                                                    id:
                                                                        'advanced',
                                                                    value: '3',
                                                                },
                                                            ]}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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

Step6.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
};

const mapStateToProps = (state) => {
    return {
        putCandidateStep6Form: state.form.putCandidateStep6Form,
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
        form: 'putCandidateStep6Form',
    })(withRouter(withStyles(styles)(withCookies(Step6)))),
);
