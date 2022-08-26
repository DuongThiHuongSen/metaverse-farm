import { Home, Login } from "pages";
import { useSelector } from "react-redux";
import "./App.css";
import { userSelector } from "./selectors/user-selector";
import "utils/i18n";

function App() {
  const { userLogin } = useSelector(userSelector);

  return <div className="App">
    {/* {userLogin?.id ? 'đefd' :''} */}
    {!userLogin?.id ? <Login/> : <Home/>}
    </div>;
}

export default App;
