/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import countries from '../tools/countries';

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode) {
    return typeof String.fromCodePoint !== 'undefined'
        ? isoCode
              .toUpperCase()
              .replace(/./g, (char) =>
                  String.fromCodePoint(char.charCodeAt(0) + 127397),
              )
        : isoCode;
}

const useStyles = makeStyles({
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
    },
});

export default function CountrySelect(field) {
    const classes = useStyles();
    return (
        <Autocomplete
            id="country-select-demo"
            options={countries}
            className={classes.root}
            classes={{
                option: classes.option,
            }}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(option) => (
                <>
                    <span>{countryToFlag(option.code)}</span>
                    {option.label} ({option.code}) +{option.phone}
                </>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    type={field.type}
                    label={field.label}
                    placeholder={field.placeholder}
                    className={field.className}
                    variant={field.variant}
                    disabled={field.disabled}
                    {...field.input}
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                />
            )}
        />
    );
}
