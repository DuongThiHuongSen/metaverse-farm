
// import LoadingScreen from 'components/loading/LoadingScreen';
import { useEffect, useState } from "react";
import { AppState } from "types/AppState";
// import { World } from "./world/World";
import { ScenePath } from "types/ScenePath";
import { useSelector } from "react-redux";
import BalanceProvider from "contexts/BalanceProvider";
import { Box, Stack } from "@mui/material";
import { FuncStateType } from "types/FuncStateType";
import { appSelector } from "selectors/app-selector";
import { LoadingScreen } from "components/atoms";

const paths: ScenePath = {
  bodyWrapper: "metaverse",
  canvasId: "metaverseScene",
  squarePath: "/assets/track.glb",
  // squarePath: "/assets/gallery/gallery.glb",
  characterPath: "/assets/dance.glb",
  carPath: "/assets/honda.glb",
  // carPath: "/assets/car.glb",
};

export const Metaverse = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const appState: AppState = useSelector(appSelector);

  useEffect(() => {
    if (!appState.walletAddress) return;
    // getCars();
    // getLands();
    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  //   const getCars = async () => {
  //     const params: GetNFTParamsType = {
  //       pageIndex: 1,
  //       pageSize: 10,
  //       owner: appState.walletAddress,
  //     };
  //     const response = await client.get(Endpoint.GET_NFT, {
  //       params,
  //     });
  //     // console.log(response);
  //   };

  //   const getLands = async () => {
  //     const params: GetLandParamsType = {
  //       pageIndex: 1,
  //       pageSize: 10,
  //     };
  //     const response = await client.get(Endpoint.GET_LAND, {
  //       params,
  //     });
  //   };

  const getUserProfile = async () => {
    // const response = await client.get(Endpoint.USER_PROFILE);
    // console.log(response);
  };

  const [showFuncState, setShowFuncState] =
    useState<FuncStateType>(initialFuncState);

  const handleCloseBackpackModal = () => {
    setShowFuncState({
      ...showFuncState,
      showBackpack: false,
    });
  };

  const handleCloseCharacterModal = () => {
    setShowFuncState({
      ...showFuncState,
      showChosenCharacter: false,
    });
  };

  const changeLoading = (value: boolean) => {
    setLoading(value);
  };

  const changeProgress = (value: number) => {
    setProgress(value);
  };

  useEffect(() => {
    // new World(paths, appState, changeLoading, changeProgress);
  }, []);

  return (
    <BalanceProvider>
      <Stack
        id="metaverse"
        sx={{ position: "relative", width: "100vw", height: "100vh" }}
      >
        <Box component="canvas" id="metaverseScene" />
        {loading && <LoadingScreen progress={progress} />}

        {/* <BottomMenu
            showFuncState={showFuncState}
            setShowFuncState={setShowFuncState}
          /> */}
      </Stack>
      {/* <Modal
        open={showFuncState.showBackpack}
        closeModal={handleCloseBackpackModal}
        width={900}
        headerLabel="Backpack"
      >
        <Backpack />
      </Modal>
      <Modal
        open={showFuncState.showChosenCharacter}
        closeModal={handleCloseCharacterModal}
        headerLabel="Character"
      >
        <ChooseCharacter />
      </Modal> */}
    </BalanceProvider>
  );
};

const initialFuncState: FuncStateType = {
  showBackpack: false,
  showChosenCharacter: false,
  showSettings: false,
  showChatConversation: false,
  showStore: false,
};
