// import type {UserState} from 'src/store/user';

import { UserState } from "store/user";
import { ReduxState } from "types/ReduxState";

export const userSelector = (state: ReduxState): UserState => state.user;