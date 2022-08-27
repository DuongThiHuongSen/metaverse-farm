// import type {UserState} from 'src/store/user';

import { LanguageType } from "types/AppLanguage";
import { ReduxState } from "types/ReduxState";

export const languageSelector = (state: ReduxState): LanguageType => state.language