import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

interface User extends FirebaseAuthTypes.User {}

interface UserContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  const retrieveUserFromStorage = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('user');
      if (userJSON) {
        const storedUser: User = JSON.parse(userJSON);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error retrieving user from storage:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        if (user) {
          AsyncStorage.setItem('userId', user.uid);
          AsyncStorage.setItem('userPhoneNumber', user.phoneNumber || '');
          setUser(user);
        } else {
          AsyncStorage.removeItem('userId');
          AsyncStorage.removeItem('userPhoneNumber');
          setUser(null);
        }
      },
    );

    retrieveUserFromStorage();

    return unsubscribe;
  }, []);

  const login = (userData: User) => {
    try {
      AsyncStorage.setItem('userId', userData.uid);
      AsyncStorage.setItem('userPhoneNumber', userData.phoneNumber || '');
      setUser(userData);
      console.log(`user set ${JSON.stringify(userData)}`);
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  const logout = () => {
    try {
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('userPhoneNumber');
      setUser(null);
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  };

  const contextValue: UserContextProps = {
    user,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
