import { Metaverse } from "components/sn-metaverse";
import { Home, Login } from "pages";
import { useSelector } from "react-redux";
import "utils/i18n";
import "./App.css";
import { userSelector } from "./selectors/user-selector";

function App() {
  const { userLogin } = useSelector(userSelector);

  return (
    <div className="App">
      {!userLogin?.id ? <Home /> : <Metaverse />}
    </div>
  );
}

export default App;
