/*import DatePicker from 'react-datepicker';
import { TextField }from '@material-ui/core/';

export function YearPicker(field) {
    console.log('PICKER', field);
    // const [startDate, setStartDate] = useState(new Date());
    const CustomInput = ({ value, onClick }) => (
        <TextField
            onClick={onClick}
            label={field.label}
            variant={field.variant}
            // selected={field.selected}
        >
            {`${value}-the value`}
        </TextField>
    );
    return (
        <DatePicker
            // selected={startDate}
            // onChange={(date) => setStartDate(date)}
            customInput={<CustomInput field={field} />}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            {...field.input}
            selected={field.selected}
            onChange={(value) => {
                field.handleChange(value);
                field.input.onChange(value);
            }}
            onBlur={() => field.input.onBlur(field.input.value)}
        />
    );
};
*/
import { makeStyles } from '@material-ui/core/styles';
import {
    KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles({
    root: {
        width: '300px',
    },
});

export function DatePicker(field) {
    console.log('PICKER', field);
    const classes = useStyles();
    return (
        <KeyboardDatePicker
            // disableToolbar
            style={{marginBottom: '20px'}}
            className={classes.root}
            disableFuture={field.disableFuture}
            openTo="year"
            variant="inline"
            format={field.formatDate}
            margin="normal"
            maxDate={field.maxDate}
            label={field.label}
            helperText={field.helperText}
            value={field.selected}
            onChange={(value) => {
                field.handleChange(value);
                field.input.onChange(value);
            }}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
        />
    );
}

export function YearPicker(field) {
    console.log('PICKER', field);
    const classes = useStyles();
    return (
        <KeyboardDatePicker
            // disableToolbar
            style={{ marginBottom: '20px' }}
            className={classes.root}
            variant={field.variant}
            format={field.formatDate}
            margin="normal"
            maxDate={field.maxDate}
            views={['year']}
            label={field.label}
            helperText={field.helperText}
            value={field.selected}
            onChange={(value) => {
                field.handleChange(value);
                field.input.onChange(value);
            }}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
        />
    );
}

export function MonthYearPicker(field) {
    console.log('PICKER', field);
    const classes = useStyles();
    return (
        <KeyboardDatePicker
            // disableToolbar
            style={{ marginBottom: '20px' }}
            className={classes.root}
            variant={field.variant}
            format={field.formatDate}
            margin="normal"
            maxDate={field.maxDate}
            views={['year', 'month']}
            label={field.label}
            helperText={field.helperText}
            value={field.selected}
            onChange={(value) => {
                field.handleChange(value);
                field.input.onChange(value);
            }}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
        />
    );
}
