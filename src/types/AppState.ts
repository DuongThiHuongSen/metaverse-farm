import { AlertColor } from '@mui/material';
import { ConnectedType } from './ConnectType';
import { UseCarNFT } from './UseCarNFT';
export type Snackbar = {
    message: string;
    severity?: AlertColor;
  };
  
  export type AuthData = {
    token: string | null;
    walletAddress: string | null;
    walletName: string | null;
  };
  
  export interface AppConfigs {
    name: string;
  }
  
  export type ConnectedData = {
    // token: string | null;
    walletAddress: string | null;
    walletName: string | null;
    typeConnected: ConnectedType;
  };
  
export interface AppState {
    snackbar?: Snackbar | null;
    configs?: AppConfigs;
    token?: string | null;
    walletAddress?: string | null;
    walletName?: string | null;
    typeConnected?: ConnectedType;
    isConnected?: boolean;
    appReady?: boolean;
    pages?: string[];
    carNFTs?: UseCarNFT[];
    chosenCar?: UseCarNFT | null;
  }