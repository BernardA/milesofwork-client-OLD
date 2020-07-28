import Head from 'next/head';

export default function About() {
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1 className="title">
                    Welcome to about
                </h1>
            </main>
        </div>
    );
}
