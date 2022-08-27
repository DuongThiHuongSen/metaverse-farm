import { UserState } from 'store/user';
import { LanguageType } from './AppLanguage';
import { AppState } from './AppState';

export interface ReduxState {
  language: LanguageType
  user: UserState;
  app: AppState
}