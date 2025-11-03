import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, TextInput, Chip, Menu, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addNotification } from '../../store/notificationsSlice';
import { demoUsers } from '../../utils/demoData';

const SendMessageScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [recipientType, setRecipientType] = useState<'technician' | 'specific' | 'all'>('technician');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  // Получаем реальных пользователей из demoData
  const allUsers = Object.values(demoUsers);
  const technicians = allUsers.filter(u => u.role === 'technician');
  const availableRecipients = allUsers.filter(u => u.id !== user?.id); // Исключаем текущего пользователя

  const handleSendMessage = () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Ошибка', 'Заполните заголовок и текст сообщения');
      return;
    }

    let recipientId = '';
    let recipientDisplayName = '';

    if (recipientType === 'technician') {
      recipientId = 'technician';
      recipientDisplayName = 'всем техникам по эксплуатации';
    } else if (recipientType === 'specific' && selectedRecipient) {
      const selectedUser = availableRecipients.find(u => u.id === selectedRecipient);
      recipientId = selectedRecipient;
      recipientDisplayName = selectedUser ? selectedUser.name : 'выбранному сотруднику';
    } else if (recipientType === 'all') {
      recipientId = 'all';
      recipientDisplayName = 'всем сотрудникам';
    } else {
      Alert.alert('Ошибка', 'Выберите получателя');
      return;
    }

    const newNotification = {
      title: title,
      message: message,
      recipient: recipientId,
      sender: user?.id || 'quality_inspector',
      type: 'message' as const,
      data: { senderName: user?.name || 'Инспектор по качеству' }
    };

    dispatch(addNotification(newNotification));

    Alert.alert(
      'Сообщение отправлено',
      `Сообщение отправлено ${recipientDisplayName}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );

    // Очищаем форму после отправки
    setTitle('');
    setMessage('');
    setSelectedRecipient('');
    setRecipientType('technician');
  };

  const getRecipientText = () => {
    switch (recipientType) {
      case 'technician':
        return 'Всем техникам по эксплуатации';
      case 'specific':
        const selectedUser = availableRecipients.find(u => u.id === selectedRecipient);
        return selectedUser ? selectedUser.name : 'Выберите сотрудника';
      case 'all':
        return 'Всем сотрудникам';
      default:
        return 'Выберите получателя';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Отправка уведомления</Title>
          <Text style={styles.subtitle}>
            Отправка сообщений и уведомлений сотрудникам
          </Text>

          <TextInput
            label="Заголовок сообщения"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            placeholder="Например: Проверка системы отопления"
          />

          <TextInput
            label="Текст сообщения"
            value={message}
            onChangeText={setMessage}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Опишите задачу или проблему..."
          />

          <Divider style={styles.divider} />

          <Title style={styles.sectionTitle}>Получатель</Title>
          
          <View style={styles.recipientTypeContainer}>
            <Chip
              selected={recipientType === 'technician'}
              onPress={() => {
                setRecipientType('technician');
                setSelectedRecipient('');
              }}
              style={styles.recipientChip}
              icon="account-group"
            >
              Все техники
            </Chip>
            <Chip
              selected={recipientType === 'specific'}
              onPress={() => setRecipientType('specific')}
              style={styles.recipientChip}
              icon="account"
            >
              Конкретный сотрудник
            </Chip>
            <Chip
              selected={recipientType === 'all'}
              onPress={() => {
                setRecipientType('all');
                setSelectedRecipient('');
              }}
              style={styles.recipientChip}
              icon="account-multiple"
            >
              Все сотрудники
            </Chip>
          </View>

          {recipientType === 'specific' && (
            <View style={styles.specificRecipient}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button 
                    mode="outlined" 
                    onPress={() => setMenuVisible(true)}
                    style={styles.recipientButton}
                    icon="account"
                  >
                    {getRecipientText()}
                  </Button>
                }
              >
                {availableRecipients.map((user) => (
                  <Menu.Item
                    key={user.id}
                    onPress={() => {
                      setSelectedRecipient(user.id);
                      setMenuVisible(false);
                    }}
                    title={user.name}
                    description={user.role}
                  />
                ))}
              </Menu>
            </View>
          )}

          <View style={styles.selectedRecipient}>
            <Text style={styles.selectedRecipientText}>
              Получатель: {getRecipientText()}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.actions}>
            <Button 
              mode="contained" 
              onPress={handleSendMessage}
              style={styles.sendButton}
              icon="send"
              disabled={!title.trim() || !message.trim()}
            >
              Отправить сообщение
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              Отмена
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Стили остаются без изменений...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  card: {
    margin: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  recipientTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  recipientChip: {
    flex: 1,
    minWidth: '30%',
  },
  specificRecipient: {
    marginBottom: 16,
  },
  recipientButton: {
    marginBottom: 8,
  },
  selectedRecipient: {
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
  },
  selectedRecipientText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actions: {
    gap: 8,
  },
  sendButton: {
    marginTop: 8,
  },
  cancelButton: {
    borderColor: '#8B4513',
  },
});

export default SendMessageScreen;