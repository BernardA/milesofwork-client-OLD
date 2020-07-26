import Head from 'next/head';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, FormGroup, Typography } from '@material-ui/core/';
import PropTypes from 'prop-types';
import {
    required,
    isEmail,
} from '../../tools/validator';
import { renderInput } from '../../components/formInputs';
import CountrySelect from '../../components/countrySelect';
import countries from '../../tools/countries';

const Step1 = (props) => {
    const router = useRouter();
    const {
        handleSubmit,
        submitting,
        invalid,
        error,
        reset,
        pristine,
    } = props;

    const submitStep = () => {
        const { postCandidateForm: { values } } = props;
        const country = countries.filter((ct) => {
            return ct.label === values.persoResidence;
        })
        console.log('country', country);
        values.countryCode = country[0].phone;
        router.push('/international/step2')
    }
    console.log('STEP1', props);
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="title">
                    <Typography variant="h4">General information</Typography>
                    <Typography variant="subtitle1" gutterBottom>Step 1 of 9</Typography>
                </div>
                {error ? (
                    <div>{error.messageKey}</div>
                ) : (
                    <form
                        name="postCandidateForm"
                        onSubmit={handleSubmit(submitStep)}
                    >
                        <div className="form_input">
                            <Field
                                name="persoLastName"
                                type="text"
                                label="Last name"
                                variant="outlined"
                                component={renderInput}
                                validate={[required]}
                                autoFocus
                            />
                        </div>
                        <div className="form_input">
                            <Field
                                name="persoFirstName"
                                type="text"
                                label="First name"
                                variant="outlined"
                                component={renderInput}
                                validate={[required]}
                            />
                        </div>
                        <div className="form_input">
                            <Field
                                name="persoEmail"
                                type="e-mail"
                                label="E-mail"
                                variant="outlined"
                                component={renderInput}
                                validate={[required, isEmail]}
                            />
                        </div>
                        <div className="form_input">
                            <Field
                                name="persoResidence"
                                type="text"
                                label="Country of residence"
                                variant="outlined"
                                component={CountrySelect}
                                validate={[required]}
                            />
                        </div>
                        <div className="form_input">
                            <Field
                                name="persoTel"
                                type="text"
                                label="Telephone"
                                variant="outlined"
                                helperText="Please do not add country code"
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
                )}
            </main>
        </div>
    );
}

Step1.propTypes = {
}

const mapStateToProps = (state) => {
    return {
        postCandidateForm: state.form.postCandidateForm,
    };
};

export default connect(
    mapStateToProps,
    null,
)(
    reduxForm({
        form: 'postCandidateForm',
        destroyOnUnmount: false,
    })(Step1),
);
