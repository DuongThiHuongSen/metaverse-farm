import { UserState } from 'store/user';
import { AppLanguage } from './AppLanguage';

export interface ReduxState {
    language: {
      language: AppLanguage;
    };
    user: UserState;
  }