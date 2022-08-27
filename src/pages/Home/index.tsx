import { Box, Stack, Typography } from "@mui/material";
import { logoRacefi, mainBackground } from "assets";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import ConnectForm from "components/form/ConnectForm";
import { LoginLang } from "config/lang/LoginLang";

type HomeProps = {};

const Home: FC<HomeProps> = () => {
  const { t } = useTranslation();

  return (
    <Stack
      justifyContent="center"
      sx={{
        textAlign: "center",
        width: "100%",
        height: { lg: "100vh", md: "100%" },
        position: "relative",
        overflow: "hidden",
        background: `url(${mainBackground}) no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      <Box component="div" sx={{ marginTop: "5%" }}>
        <Box
          component="img"
          src={logoRacefi}
          alt="RaceFi"
          sx={{ width: "506px" }}
        />
      </Box>
      <Typography
        variant="subtitle2"
        sx={{
          fontFamily: "MashineSemiBold",
          marginTop: "24px",
          marginBottom: "70px",
          letterSpacing: "0.3em",
          textTransform: "capitalize",
          background:
            "linear-gradient(180deg, #21caff 0%, #27677b 50%, #b1edff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {t(LoginLang.General.SubHeading)}
      </Typography>
      <ConnectForm />
    </Stack>
  );
};

export default memo(Home);
