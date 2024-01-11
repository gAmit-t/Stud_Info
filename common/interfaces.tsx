import {ParamListBase} from '@react-navigation/native';

// Navigation Param Interface
export interface RootParamList extends ParamListBase {
  Login: undefined;
  Dashboard: undefined;
}

// Drawer Param Interface
export interface DrawerParamList extends ParamListBase {
  Login: undefined;
}

//NotificationCardItem
export interface INotificationCardItem {
  id: string;
  title: string;
  timestamp: string;
  message: string;
  isClosed: boolean;
}
