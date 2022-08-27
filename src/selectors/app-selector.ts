import { ReduxState } from "types/ReduxState";
import { AppState } from '../types/AppState';

export const appSelector = (state: ReduxState): AppState => state.app;