import Sidebar from "./Sidebar";
import Main from "./Main";
import "./App.css";

function App() {
    return (
        <div className="d-flex" id="wrapper">
            <Sidebar></Sidebar>
            <Main></Main>
        </div>
    );
}

export default App;
