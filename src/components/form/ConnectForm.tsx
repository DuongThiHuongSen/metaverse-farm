import { Box, Stack, Typography } from "@mui/material";
import { connectIcn, guestIcn, itemFormBackground } from "assets";
import { Button } from "components/atoms";
// import Button from "components/button";
import { useTranslation } from "react-i18next";
// import { useAppDispatch } from "store/hooks";
import {
  buttonConnectStyle,
  itemTitleStyle,
  itemWrapperStyle,
} from "pages/Home/home.style";
import ConnectButton from "./ConnectButton";
import { LoginLang } from '../../config/lang/LoginLang';
import { FC, memo } from "react";
import { CommonLang } from '../../config/lang/CommonLang';
import store from "store";
import { appSlice } from "store/app";

type FormProps = {};

const ConnectForm: FC<FormProps> = () => {
  // const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Stack
      direction={{ lg: "row", md: "column" }}
      justifyContent="center"
      alignItems="center"
      gap="75px"
      sx={{ marginBottom: { lg: "5%", md: "0" } }}
    >
      <Box
        component="div"
        sx={{
          ...itemWrapperStyle,
          backgroundImage: `url(${itemFormBackground})`,
        }}
      >
        <Typography variant="h6" sx={{ ...itemTitleStyle }}>
          {t(CommonLang.ConnectWallet)}
        </Typography>

        <Stack
          justifyContent="space-between"
          alignItems="center"
          sx={{ height: "calc(100% - 78px)" }}
        >
          <Box component="div" sx={{ maxWidth: "416px", margin: "0 auto" }}>
            {t(LoginLang.General.ConnectWalletSubTitle)}
          </Box>
          <Box component="div">
            <Box
              component="img"
              src={connectIcn}
              alt={t(CommonLang.ConnectWallet)}
            />
          </Box>
          <Box component="div" sx={{ width: "100%", padding: "0 20px" }}>
            <ConnectButton />
          </Box>
        </Stack>
      </Box>
      <Box
        component="div"
        sx={{
          ...itemWrapperStyle,
          backgroundImage: `url(${itemFormBackground})`,
        }}
      >
        <Typography variant="h6" sx={{ ...itemTitleStyle }}>
          {t(LoginLang.General.PlayGuest)}
        </Typography>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          sx={{ height: "calc(100% - 78px)" }}
        >
          <Box component="div" sx={{ maxWidth: "416px", margin: "0 auto" }}>
            {t(LoginLang.General.PlayGuestSubTitle)}
          </Box>
          <Box component="div">
            <Box
              component="img"
              src={guestIcn}
              alt={t(CommonLang.ConnectWallet)}
            />
          </Box>
          <Box component="div" sx={{ width: "100%", padding: "0 20px" }}>
            <Button
              sx={{ ...buttonConnectStyle }}
              handleClick={() => {
                // dispatch(
                //   updateWalletInfo({
                //     walletAddress: null,
                //     walletName: null,
                //     typeConnected: ConnectedType.GUEST,
                //   }),
                // );
                store.dispatch(appSlice.actions.setAppReady(true));
              }}
            >
              {t(LoginLang.General.ConnectButtonLabel)}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default memo(ConnectForm);
