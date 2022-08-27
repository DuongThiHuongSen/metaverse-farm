import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { SOLANA_ENDPOINT } from "helpers/consts";
import React, {
  createContext,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AddressToken } from "types/AddressToken";

export interface BalanceState {
  SOLBalance: number | null;
  racefiBalance: number | null;
  onGetBalance?: () => Promise<void>;
  isFetching: boolean;
}

const initialState: BalanceState = {
  SOLBalance: null,
  racefiBalance: null,
  isFetching: false,
};

export const BalanceContext = createContext(initialState);

type BalanceProviderProps = {
  children: React.ReactNode;
};

const connection = new Connection(SOLANA_ENDPOINT, "confirmed");

const BalanceProvider = ({ children }: BalanceProviderProps) => {
  const { connected, publicKey } = useWallet();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [SOL, setSOL] = useState<number | null>(null);
  const [racefi, setRaceFi] = useState<number | null>(null);

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const onGetBalance = useCallback(async () => {
    try {
      if (!base58) return;
      setIsFetching(true);

      const SOLData = await connection.getBalance(new PublicKey(base58));
      setSOL(SOLData / LAMPORTS_PER_SOL);

      const res = await connection.getTokenAccountsByOwner(
        new PublicKey(base58),
        {
          mint: new PublicKey(AddressToken.RACEFI),
        },
      );
      if (res.value.length) {
        const racefiAmount = await connection.getTokenAccountBalance(
          new PublicKey(res.value[0].pubkey.toBase58()),
        );

        setRaceFi(Number(racefiAmount.value.amount) / Math.pow(10, 6));
      } else {
        setRaceFi(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }, [base58]);

  useEffect(() => {
    onGetBalance();
  }, [onGetBalance]);

  useEffect(() => {
    setSOL(null);
    setRaceFi(null);
  }, [connected]);

  return (
    <BalanceContext.Provider
      value={{ SOLBalance: SOL, racefiBalance: racefi, isFetching }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
export default memo(BalanceProvider);
