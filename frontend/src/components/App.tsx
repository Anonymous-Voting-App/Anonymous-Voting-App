import './App.scss';
import NavBar from './NavBar';
import PollCreationPage from './PollCreationPage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
//import PollAnsweringPage from './PollAnsweringPage';

function App() {
    return (
        <div className="App">
            <NavBar></NavBar>
            {/*For now since we don't have routing, comment out the components
            you don't want to see.*/}
            {/*<RegisterPage></RegisterPage>*/}
            {/*<LoginPage></LoginPage>*/}
            <PollCreationPage></PollCreationPage>
            {/*<PollAnsweringPage></PollAnsweringPage>*/}
        </div>
    );
}

export default App;
