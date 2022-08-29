import { Metaverse } from "components/sn-metaverse";
import { Home } from "pages";
import { useSelector } from "react-redux";
import { appSelector } from "selectors/app-selector";
import "utils/i18n";
import "./App.css";
import { userSelector } from "./selectors/user-selector";

function App() {
  const { userLogin } = useSelector(userSelector);
  const { appReady } = useSelector(appSelector);
console.log("appReady", appReady);

  return (
    <div className="App">
      {userLogin?.id || appReady ? <Metaverse /> : <Home />}
    </div>
  );
}

export default App;
