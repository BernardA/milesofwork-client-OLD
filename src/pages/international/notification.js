import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Notification() {
    const router = useRouter();
    console.log('router', router);
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {router.query.reason ? (
                    <h1 className="title">{router.query.reason}</h1>
                ) : null}
            </main>
        </div>
    );
}
