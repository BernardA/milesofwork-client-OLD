import React from 'react';
import withReduxSaga from 'next-redux-saga';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import wrapper from '../store/reduxWrapper';
import theme from '../styles/theme';
import styles from '../styles/layout.css';
import Layout from '../components/layout';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

function MyApp(props) {
    const { Component, pageProps } = props;
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <title>My page</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object,
};

export default wrapper.withRedux(withReduxSaga(MyApp));
