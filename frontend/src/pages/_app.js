import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import "admin-lte/dist/css/adminlte.min.css"
import Head from "next/head";
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* <script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script> */}
        {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css" /> */}
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
