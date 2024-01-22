import {ParamListBase} from '@react-navigation/native';

// Navigation Param Interface
export interface RootParamList extends ParamListBase {
  Login: undefined;
  Dashboard: undefined;
  RegisterUser: undefined;
}

// Drawer Param Interface
export interface DrawerParamList extends ParamListBase {
  Login: undefined;
  RegisterUser: undefined;
}

//NotificationCardItem
export interface INotificationCardItem {
  id: string;
  title: string;
  timestamp: IFirestoreTimestamp;
  message: string;
  isClosed: boolean;
  isRead: boolean;
}

export interface IFirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}
