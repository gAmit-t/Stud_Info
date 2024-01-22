import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {INotificationCardItem} from '../../common/interfaces';
import moment from 'moment';

interface NotificationCardProps extends INotificationCardItem {
  onClose: (id: string) => void;
  isRead: boolean;
}

const NotificationCard = ({
  id,
  title,
  timestamp,
  message,
  isClosed,
  isRead,
  onClose,
}: NotificationCardProps) => {
  // Destructure the timestamp object
  const {seconds, nanoseconds} = timestamp;

  // Convert Firestore timestamp to JavaScript Date object
  const milliseconds = seconds * 1000 + nanoseconds / 1e6;
  const date = moment(milliseconds).toDate();

  // Format the date
  const formattedTimestamp = moment(date).format('hh:mm A | DD/MM');

  return (
    <View style={[styles.card, isRead ? styles.readCard : styles.unreadCard]}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.timestamp}>{formattedTimestamp}</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={() => onClose(id)}>
        <Text style={styles.closeIcon}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    position: 'relative',
  },
  readCard: {
    backgroundColor: '#f5f5f5',
  },
  unreadCard: {
    backgroundColor: 'red',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  timestamp: {
    fontSize: 16,
    // color: '#666',
    marginBottom: 10,
    color: 'black',
  },
  message: {
    fontSize: 14,
    marginBottom: 10,
    color: 'black',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeIcon: {
    fontSize: 20,
    color: '#f00',
  },
});

export default NotificationCard;
