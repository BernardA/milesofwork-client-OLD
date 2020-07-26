import { useState } from 'react';
import { Field } from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { DatePicker } from './datePickers';
import { required } from '../tools/validator';
import { renderInput } from './formInputs';

const useStyles = makeStyles({
    section: {
        marginBottom: '30px',
    },
});

const LangTestResults = (props) => {
    const classes = useStyles();
    const { fieldName, testName } = props;
    const [selectedDate, setSelectedDate] = useState(null);
    return (
        <div className={classes.section}>
            <div>
                <Typography variant="h4">{testName}</Typography>
            </div>
            <div className="form_input">
                <Field
                    name={fieldName[0]}
                    disableFuture
                    label="Date of test"
                    formatDate="dd/MM/yyyy"
                    component={DatePicker}
                    selected={selectedDate}
                    handleChange={(date) => setSelectedDate(date)}
                    validate={[required]}
                />
            </div>
            <div className="form_input">
                <Field
                    name={fieldName[1]}
                    type="number"
                    label="Listening"
                    variant="outlined"
                    component={renderInput}
                    validate={[required]}
                />
            </div>
            <div className="form_input">
                <Field
                    name={fieldName[2]}
                    type="number"
                    label="Reading"
                    variant="outlined"
                    component={renderInput}
                    validate={[required]}
                />
            </div>
            <div className="form_input">
                <Field
                    name={fieldName[3]}
                    type="number"
                    label="Writing"
                    variant="outlined"
                    component={renderInput}
                    validate={[required]}
                />
            </div>
            <div className="form_input">
                <Field
                    name={fieldName[4]}
                    type="number"
                    label="Speaking"
                    variant="outlined"
                    component={renderInput}
                    validate={[required]}
                />
            </div>
        </div>
    );
};

LangTestResults.propTypes = {
};

export default LangTestResults;
