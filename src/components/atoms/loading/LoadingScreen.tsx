import { Stack } from "@mui/material";
import loadingBg from "assets/images/background/loading-image.png";
import { FC } from "react";
// import styles from "./LoadingScreen.module.scss";

type LoadingProps = {
  progress: number;
};

const LoadingScreen: FC<LoadingProps> = ({ progress = 0 }) => {
  return (
    <Stack className={"wrapper"}>
      <div className={"background"}>
        <img src={loadingBg} alt="Loading..." />
      </div>
      <div className={"progressBar"}>
        <div className={"progress"} style={{ width: progress + "%" }}></div>
      </div>
    </Stack>
  );
};
export default LoadingScreen;
