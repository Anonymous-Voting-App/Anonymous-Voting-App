import React from 'react';
import './App.scss';
import { Header } from './Header';
import PollCreationPage from './PollCreationPage';
//import PollAnsweringPage from './PollAnsweringPage';

function App() {
    // Just testing, this can be removed :)
    // const backendAddress =
    //     (process.env.REACT_APP_BACKEND_HOST || window.location.origin) +
    //     '/api/';
    // console.log('Backend:' + backendAddress);
    // console.log('Env:' + process.env.NODE_ENV);

    // const testBackend = async () => {
    //     try {
    //         const res = await fetch(backendAddress + 'health');
    //         const json = await res.json();

    //         setBackendStatus(json.server);
    //         setDatabaseStatus(json.database);
    //     } catch {
    //         setBackendStatus(false);
    //         setDatabaseStatus(false);
    //     }
    // };

    // const [backendStatus, setBackendStatus] = useState(false);
    // const [databaseStatus, setDatabaseStatus] = useState(false);

    return (
        <div className="App">
            <Header></Header>
            {/*For now since we don't have routing, comment out the components
            you don't want to see.*/}
            <PollCreationPage></PollCreationPage>
            {/*<PollAnsweringPage></PollAnsweringPage>*/}
        </div>
    );
}

export default App;
