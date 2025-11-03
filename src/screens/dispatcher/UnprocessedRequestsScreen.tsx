import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Title, Button, Text, TextInput, List } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigation } from '@react-navigation/native';

const UnprocessedRequestsScreen = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const { requests } = useSelector((state: RootState) => state.requests);
  const navigation = useNavigation();
  
  // Исправляем фильтрацию - используем 'created' вместо 'new'
  const unprocessedRequests = requests.filter(r => r.status === 'created');

  const handleProcessRequest = () => {
    if (!selectedRequestId) {
      alert('Введите ID заявки');
      return;
    }
    
    const requestExists = unprocessedRequests.some(req => req.id === selectedRequestId);
    if (!requestExists) {
      alert('Заявка с таким ID не найдена');
      return;
    }
    
    // Навигация на экран обработки с передачей ID
    // @ts-ignore
    navigation.navigate('ProcessRequestScreen', { requestId: selectedRequestId });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Необработанные заявки</Title>
          <Text style={styles.subtitle}>
            Всего необработанных заявок: {unprocessedRequests.length}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Обработка заявки</Title>
          
          <TextInput
            label="ID заявки для обработки"
            value={selectedRequestId}
            onChangeText={setSelectedRequestId}
            mode="outlined"
            style={styles.input}
          />
          
          <Button
            mode="contained"
            onPress={handleProcessRequest}
            style={styles.processButton}
            disabled={!selectedRequestId}
          >
            Обработать заявку
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Список заявок</Title>
          {unprocessedRequests.length === 0 ? (
            <Text style={styles.noRequests}>Нет необработанных заявок</Text>
          ) : (
            <FlatList
              data={unprocessedRequests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.theme}
                  description={item.description}
                  left={props => <List.Icon {...props} icon="clipboard-text" />}
                  right={props => <Text style={styles.requestId}>#{item.id}</Text>}
                  style={styles.requestItem}
                  onPress={() => {
                    setSelectedRequestId(item.id);
                    // @ts-ignore
                    navigation.navigate('ProcessRequestScreen', { requestId: item.id });
                  }}
                />
              )}
            />
          )}
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Назад
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
    padding: 8,
  },
  card: {
    marginBottom: 8,
    elevation: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  input: {
    marginBottom: 16,
  },
  processButton: {
    marginTop: 8,
  },
  noRequests: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    padding: 16,
  },
  requestItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  requestId: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'center',
  },
  backButton: {
    marginTop: 16,
  },
});

export default UnprocessedRequestsScreen;