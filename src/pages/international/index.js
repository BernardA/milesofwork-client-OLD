import Head from 'next/head';
import { Button } from '@material-ui/core/';
import Link from '../../components/link';
import NotifierInline from '../../components/notifierInline';

export default function International() {
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className="title">International</h1>
                <NotifierInline
                    message="This is the international homepage to be defined"
                    severity="info"
                    isNotClosable
                />
                <Link href="/international/step1">
                    <Button variant="contained" color="primary">
                        Form
                    </Button>
                </Link>
                <Link href="/international/about">
                    <Button variant="contained" color="primary">
                        About
                    </Button>
                </Link>
            </main>
        </div>
    );
}
