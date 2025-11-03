import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Title, Text, Button, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { markAsRead, deleteNotification } from '../../store/notificationsSlice';

const NotificationsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const { user } = useSelector((state: RootState) => state.auth);

  // Функция для проверки, должно ли уведомление показываться текущему пользователю
  const shouldShowNotification = (notification: any) => {
    // Если пользователь главный директор - показываем все уведомления
    if (user?.role === 'main_director') {
      return true;
    }

    // Проверяем, предназначено ли уведомление текущему пользователю по ID
    if (notification.recipient === user?.id) {
      return true;
    }

    // Проверяем, предназначено ли уведомление роли текущего пользователя
    if (notification.recipient === user?.role) {
      return true;
    }

    // Проверяем, предназначено ли уведомление всем
    if (notification.recipient === 'all') {
      return true;
    }

    // Специальная логика для техников (если recipient = 'technician')
    if (notification.recipient === 'technician' && user?.role === 'technician') {
      return true;
    }

    return false;
  };

  // Фильтруем уведомления для текущего пользователя
  const filteredNotifications = notifications.filter(shouldShowNotification);

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Удаление уведомления',
      'Вы уверены, что хотите удалить это уведомление?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => dispatch(deleteNotification(notificationId))
        },
      ]
    );
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'emergency': return '#f44336';
      case 'system': return '#2196f3';
      case 'request': return '#4caf50';
      case 'message': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'emergency': return 'Экстренное';
      case 'system': return 'Системное';
      case 'request': return 'Заявка';
      case 'message': return 'Сообщение';
      default: return type;
    }
  };

  const getRecipientText = (recipient: string) => {
    switch (recipient) {
      case 'all': return 'Все сотрудники';
      case 'technician': return 'Все техники';
      default: return recipient;
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Уведомления</Title>
          <Text style={styles.subtitle}>
            {user?.role === 'main_director' 
              ? `Все уведомления: ${filteredNotifications.length}`
              : `Мои уведомления: ${filteredNotifications.length}`
            }
          </Text>
          
          {user?.role === 'main_director' && (
            <Button
              mode="contained"
              icon="send"
              onPress={() => navigation.navigate('SendMessageScreen' as never)}
              style={styles.sendMessageButton}
            >
              Отправить сообщение
            </Button>
          )}
        </Card.Content>
      </Card>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card 
            style={[
              styles.notificationCard,
              item.read ? styles.readNotification : styles.unreadNotification
            ]}
          >
            <Card.Content>
              <View style={styles.notificationHeader}>
                <View style={styles.notificationTitleRow}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Chip 
                    mode="outlined"
                    textStyle={{ 
                      fontSize: 10,
                      color: getNotificationColor(item.type)
                    }}
                    style={{ 
                      borderColor: getNotificationColor(item.type),
                      marginLeft: 8 
                    }}
                  >
                    {getTypeText(item.type)}
                  </Chip>
                </View>
                
                {!item.read && (
                  <Chip 
                    mode="flat"
                    textStyle={{ fontSize: 10 }}
                    style={{ backgroundColor: '#ffa000' }}
                  >
                    НОВОЕ
                  </Chip>
                )}
              </View>

              <Text style={styles.notificationMessage}>{item.message}</Text>
              
              <View style={styles.notificationFooter}>
                <Text style={styles.notificationDate}>
                  {new Date(item.sentAt).toLocaleString('ru-RU')}
                </Text>
                
                {user?.role === 'main_director' && (
                  <Text style={styles.recipientInfo}>
                    Для: {getRecipientText(item.recipient)}
                  </Text>
                )}
              </View>

              <View style={styles.notificationActions}>
                {!item.read && (
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => handleMarkAsRead(item.id)}
                    style={styles.actionButton}
                  >
                    Прочитано
                  </Button>
                )}
                
                <Button
                  mode="outlined"
                  compact
                  onPress={() => handleDeleteNotification(item.id)}
                  style={styles.actionButton}
                  textColor="#f44336"
                >
                  Удалить
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>Нет уведомлений</Text>
              <Text style={styles.emptySubtext}>
                {user?.role === 'main_director' 
                  ? 'Здесь будут отображаться все уведомления системы'
                  : 'Здесь будут появляться ваши уведомления'
                }
              </Text>
            </Card.Content>
          </Card>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
    padding: 8,
  },
  headerCard: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 12,
  },
  sendMessageButton: {
    marginTop: 8,
  },
  notificationCard: {
    marginBottom: 8,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: '#ffa000',
  },
  readNotification: {
    backgroundColor: '#FFFFFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#666',
  },
  recipientInfo: {
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyCard: {
    marginTop: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default NotificationsScreen;