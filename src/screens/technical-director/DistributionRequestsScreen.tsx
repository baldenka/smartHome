import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Title, Text, Button, TextInput, Menu, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { assignRequest } from '../../store/requestsSlice';
import { useNavigation } from '@react-navigation/native';

const DistributionRequestsScreen = () => {
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 0>(0);
  const [specialist, setSpecialist] = useState('');
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [specialistMenuVisible, setSpecialistMenuVisible] = useState(false);

  const { requests } = useSelector((state: RootState) => state.requests);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Заявки ожидающие распределения (status = 'processing')
  const pendingRequests = requests.filter(request => request.status === 'processing');

  const priorities = [1, 2, 3, 4, 5, 6, 7] as const;
  const specialists = ['Иванов А.Б.', 'Петров В.Г.', 'Сидоров Д.Е.', 'Кузнецов Ж.З.'];

  const handleAssign = () => {
    if (!selectedRequestId || !priority || !specialist) {
      alert('Заполните все поля');
      return;
    }

    const requestExists = pendingRequests.some(req => req.id === selectedRequestId);
    if (!requestExists) {
      alert('Заявка с таким ID не найдена или уже обработана');
      return;
    }

    if (user) {
      dispatch(assignRequest({
        id: selectedRequestId,
        priority: priority as 1 | 2 | 3 | 4 | 5 | 6 | 7,
        assignedSpecialist: specialist,
        technicalDirectorId: user.id
      }));
      
      alert(`Заявка ${selectedRequestId} назначена ${specialist} с приоритетом ${priority}`);
      
      // Очистка формы и возврат назад
      setSelectedRequestId('');
      setPriority(0);
      setSpecialist('');
      navigation.goBack();
    }
  };

  const getPriorityDescription = (priority: number) => {
    const descriptions = {
      1: 'Исполнение сразу',
      2: 'Исполнение в течение 3х часов',
      3: 'Исполнение в течение 8ми часов',
      4: 'Исполнение в течение 24х часов',
      5: 'Исполнение в течение 2х суток',
      6: 'Исполнение в течение 5и суток',
      7: 'Исполнение в течение 7и суток',
    };
    return descriptions[priority as keyof typeof descriptions] || '';
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Распределение заявок</Title>
          <Text style={styles.subtitle}>
            Ожидают распределения: {pendingRequests.length} заявок
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Выбор заявки</Title>
          
          <TextInput
            label="ID заявки для обработки"
            value={selectedRequestId}
            onChangeText={setSelectedRequestId}
            mode="outlined"
            style={styles.input}
            placeholder="REQ-001"
          />

          {/* Список доступных заявок */}
          {pendingRequests.length > 0 && (
            <>
              <Text style={styles.availableLabel}>Доступные заявки:</Text>
              <FlatList
                data={pendingRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Card 
                    style={[
                      styles.requestCard,
                      selectedRequestId === item.id && styles.selectedCard
                    ]}
                    onPress={() => setSelectedRequestId(item.id)}
                  >
                    <Card.Content>
                      <Text style={styles.requestId}>#{item.id}</Text>
                      <Text style={styles.requestTheme}>{item.theme}</Text>
                      <Text style={styles.requestDescription}>{item.description}</Text>
                      <Text style={styles.requestUser}>
                        От: {item.userFio} {item.userApartment ? `(кв. ${item.userApartment})` : ''}
                      </Text>
                    </Card.Content>
                  </Card>
                )}
                style={styles.requestsList}
                contentContainerStyle={styles.requestsListContent}
              />
            </>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Назначение параметров</Title>
          
          <Text style={styles.fieldLabel}>Приоритет заявки:</Text>
          <Menu
            visible={priorityMenuVisible}
            onDismiss={() => setPriorityMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setPriorityMenuVisible(true)}
                style={styles.menuButton}
              >
                {priority ? `Приоритет ${priority} - ${getPriorityDescription(priority)}` : 'Выберите приоритет'}
              </Button>
            }
          >
            {priorities.map((p) => (
              <Menu.Item
                key={p}
                onPress={() => {
                  setPriority(p);
                  setPriorityMenuVisible(false);
                }}
                title={`Приоритет ${p} - ${getPriorityDescription(p)}`}
              />
            ))}
          </Menu>

          <Text style={styles.fieldLabel}>Специалист-исполнитель:</Text>
          <Menu
            visible={specialistMenuVisible}
            onDismiss={() => setSpecialistMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setSpecialistMenuVisible(true)}
                style={styles.menuButton}
              >
                {specialist || 'Выберите специалиста'}
              </Button>
            }
          >
            {specialists.map((spec) => (
              <Menu.Item
                key={spec}
                onPress={() => {
                  setSpecialist(spec);
                  setSpecialistMenuVisible(false);
                }}
                title={spec}
              />
            ))}
          </Menu>

          <Button
            mode="contained"
            onPress={handleAssign}
            style={styles.assignButton}
            disabled={!selectedRequestId || !priority || !specialist}
          >
            Подтвердить назначение
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

// Стили остаются без изменений
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
    padding: 8,
  },
  card: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  input: {
    marginBottom: 16,
  },
  availableLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  requestCard: {
    marginBottom: 8,
    elevation: 1,
  },
  selectedCard: {
    borderColor: '#8B4513',
    borderWidth: 2,
  },
  requestId: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  requestTheme: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  requestDescription: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  requestUser: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  requestsList: {
    maxHeight: 200,
  },
  requestsListContent: {
    paddingBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  menuButton: {
    marginBottom: 16,
  },
  assignButton: {
    marginTop: 16,
  },
});

export default DistributionRequestsScreen;