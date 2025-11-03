import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text, TextInput } from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { sendToTechnicalDirector, rejectRequest } from '../../store/requestsSlice';

type ProcessRequestScreenRouteProp = RouteProp<{
  ProcessRequestScreen: { requestId: string };
}, 'ProcessRequestScreen'>;

const ProcessRequestScreen = () => {
  const route = useRoute<ProcessRequestScreenRouteProp>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { requestId } = route.params;
  const { requests } = useSelector((state: RootState) => state.requests);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [rejectionReason, setRejectionReason] = useState('');

  // Находим заявку по ID
  const request = requests.find(r => r.id === requestId);

  const handleApprove = () => {
    if (user) {
      dispatch(sendToTechnicalDirector({
        id: requestId,
        dispatcherId: user.id
      }));
      alert('Заявка направлена техническому директору');
      navigation.goBack();
    }
  };

  const handleReject = () => {
    if (!rejectionReason) {
      alert('Укажите причину отклонения');
      return;
    }
    
    if (user) {
      dispatch(rejectRequest({
        id: requestId,
        rejectedReason: rejectionReason,
        dispatcherId: user.id
      }));
      alert('Заявка отклонена');
      navigation.goBack();
    }
  };

  if (!request) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Заявка не найдена</Title>
            <Text>Заявка с ID {requestId} не существует</Text>
            <Button onPress={() => navigation.goBack()} style={styles.backButton}>
              Назад
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Обработка заявки #{request.id}</Title>
          <Text style={styles.subtitle}>
            Просмотр и обработка заявки от жильца
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Информация о заявке</Title>
          <Text style={styles.fieldLabel}>Тема:</Text>
          <Text style={styles.fieldValue}>{request.theme}</Text>
          
          <Text style={styles.fieldLabel}>Описание:</Text>
          <Text style={styles.fieldValue}>{request.description}</Text>
          
          <Text style={styles.fieldLabel}>От:</Text>
          <Text style={styles.fieldValue}>{request.userFio} {request.userApartment ? `(кв. ${request.userApartment})` : ''}</Text>
          
          <Text style={styles.fieldLabel}>Дата создания:</Text>
          <Text style={styles.fieldValue}>
            {new Date(request.createdAt).toLocaleDateString('ru-RU')} {new Date(request.createdAt).toLocaleTimeString('ru-RU')}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Действия</Title>
          
          <Button
            mode="contained"
            onPress={handleApprove}
            style={styles.approveButton}
            contentStyle={styles.buttonContent}
          >
            Направить заявку техническому директору
          </Button>

          <Text style={styles.rejectionSectionTitle}>Отклонение заявки:</Text>
          <TextInput
            label="Причина отклонения"
            value={rejectionReason}
            onChangeText={setRejectionReason}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.rejectionInput}
            placeholder="Укажите причину отклонения заявки..."
          />
          
          <Button
            mode="outlined"
            onPress={handleReject}
            style={styles.rejectButton}
            contentStyle={styles.buttonContent}
            disabled={!rejectionReason}
          >
            Отклонить заявку
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  approveButton: {
    marginBottom: 24,
  },
  rejectionSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  rejectionInput: {
    marginBottom: 16,
  },
  rejectButton: {
    borderColor: '#d32f2f',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 16,
  },
});

export default ProcessRequestScreen;