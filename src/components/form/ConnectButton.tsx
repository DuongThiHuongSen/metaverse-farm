// import { WalletReadyState } from "@solana/wallet-adapter-base";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { useWalletModal } from "@solana/wallet-adapter-react-ui";
// import { client, Endpoint } from "api";
// import { setToken } from "api/client";
// import { API_URL, DEFAULT_NAMESPACE, NS_LOGIN } from "constant";
// import { HttpStatusCode, SupportedWallet } from "constant/enum";
// import { PhantomError } from "constant/types";
// import Image from "next/image";
import { Button } from "components/atoms";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { userSelector } from "selectors/user-selector";
// import { updateAuth, updateSnackbar, useAuth } from "store/app";
// import { useAppDispatch, useAppSelector } from "store/hooks";
// import { getSignMessage } from "utils";
import { buttonConnectStyle } from "pages/Home/home.style";
import { LoginLang } from '../../config/lang/LoginLang';

type ItemProps = {};

const ConnectButton: FC<ItemProps> = () => {
  // const { publicKey, wallet, connect, disconnect } = useWallet();
  const wallet:boolean = false;
  // const { setVisible } = useWalletModal();
  // const { isConnected } = useAuth();

  // const appReady = useAppSelector((state) => state.app.appReady);
  const { userLogin } = useSelector(userSelector);

  // const dispatch = useAppDispatch();

  const { t } = useTranslation();


  const onOpenWalletsModal = () => {
    // setVisible(true);
  };

  // const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  // const [signMessage, setSignMessage] = useState<string | null>(null);
  // const [error, setError] = useState<PhantomError | null>(null);


  // const onPostSignature = useCallback(async (wallet: string) => {
  //   if (!wallet) return;
  //   try {
  //     const response = await client.post(
  //       Endpoint.SIGNATURE_MESSAGE,
  //       {
  //         network: BLOCKCHAIN_NETWORK, // Default: Solana
  //         wallet,
  //       },
  //       { baseURL: API_URL },
  //     );

  //     if (response.status === HttpStatusCode.CREATED) {
  //       const _signMessage = response.data.signatureMessage;
  //       const signature = await getSignMessage(_signMessage);

  //       setSignMessage(signature);
  //     } else {
  //       // eslint-disable-next-line no-throw-literal
  //       throw { message: "Error", code: ERROR_API };
  //     }
  //   } catch (error) {
  //     console.error("onPostSignature: ", error);
  //     setError(error as unknown as PhantomError);
  //   }
  // }, []);

  // const onConnect = () => {
  //   if (base58 && wallet?.adapter?.name === SupportedWallet.PHANTOM) {
  //     onPostSignature(base58);
  //   } else {
  //     connect().catch(() => {
  //       //
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (
  //     !base58 ||
  //     wallet?.adapter?.name !== "Phantom" ||
  //     isConnected ||
  //     !appReady
  //   )
  //     return;

  //   onPostSignature(base58);
  // }, [base58, wallet?.adapter?.name, isConnected, onPostSignature, appReady]);

  // useEffect(() => {
  //   onPostAuth();
  // }, [onPostAuth]);

  // useEffect(() => {
  //   if (error) {
  //     disconnect();
  //     setError(null);
  //     dispatch(
  //       updateSnackbar({
  //         message: common("ErrorTryAgain"),
  //         severity: "error",
  //       }),
  //     );
  //   }
  // }, [error, disconnect, dispatch, common]);

  if (!wallet) {
    return (
      <Button sx={{ ...buttonConnectStyle }} handleClick={onOpenWalletsModal}>
        {t(LoginLang.General.ConnectButtonLabel)}
      </Button>
    );
  }

  // if (wallet) {
  //   const content =
  //     wallet.readyState === WalletReadyState.Installed
  //       ? login("ConnectButtonLabel")
  //       : login("InstallWallet");

  //   return (
  //     <Button
  //       sx={{ ...buttonConnectStyle }}
  //       handleClick={onConnect}
  //       startIcon={
  //         <Image
  //           width={20}
  //           height={20}
  //           src={wallet.adapter.icon}
  //           alt={wallet.adapter.name}
  //         />
  //       }
  //     >
  //       {content}
  //     </Button>
  //   );
  // }

  return <></>;
};

export default memo(ConnectButton);

const BLOCKCHAIN_NETWORK = "Solana";
const ERROR_API = 2109; // Assign 2109 is error code
