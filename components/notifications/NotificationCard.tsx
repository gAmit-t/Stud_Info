import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {INotificationCardItem} from '../../common/interfaces';

interface NotificationCardProps extends INotificationCardItem {
  onClose: (id: string) => void;
}

const NotificationCard = ({
  id,
  title,
  timestamp,
  message,
  isClosed,
  onClose,
}: NotificationCardProps) => (
  <View style={styles.card}>
    <Text style={styles.header}>{title}</Text>
    <Text style={styles.timestamp}>{timestamp}</Text>
    <Text style={styles.message}>{message}</Text>
    <TouchableOpacity style={styles.closeButton} onPress={() => onClose(id)}>
      <Text style={styles.closeIcon}>X</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    marginBottom: 10,
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
