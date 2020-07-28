import Head from 'next/head';
import { useRouter } from 'next/router';
import NotifierInline from '../../../../components/notifierInline';

export default function Notification() {
    const router = useRouter();
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {router.query.reason && router.query.reason !== 'success' ? (
                    <NotifierInline
                        message={`Failure due to ${router.query.reason}`}
                        severity="danger"
                        isNotClosable
                    />
                ) : (
                    <NotifierInline
                        message={router.query.reason}
                        severity="success"
                        isNotClosable
                    />
                )}
            </main>
        </div>
    );
}
