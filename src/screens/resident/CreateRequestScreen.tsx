import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, TextInput, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createRequest } from '../../store/requestsSlice';
import { selectUser } from '../../store/selectors';

const CreateRequestScreen = () => {
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  const handleSubmit = () => {
    if (!theme || !description) {
      alert('Заполните все поля');
      return;
    }

    if (user) {
      dispatch(createRequest({
        userId: user.id,
        userFio: user.name,
        userApartment: user.apartment,
        theme,
        description,
      }) as any);
      
      alert('Заявка успешно создана!');
      setTheme('');
      setDescription('');
      navigation.goBack();
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Создание заявки</Title>
          <Text style={styles.subtitle}>
            Опишите вашу проблему или предложение
          </Text>

          <TextInput
            label="Тема заявки"
            value={theme}
            onChangeText={setTheme}
            mode="outlined"
            style={styles.input}
            maxLength={100}
          />

          <TextInput
            label="Описание проблемы"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            maxLength={255}
          />

          <Text style={styles.charCount}>
            {description.length}/255 символов
          </Text>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            disabled={!theme || !description}
          >
            Создать заявку
          </Button>

          <Button
            mode="outlined"
            onPress={handleBack}
            style={styles.backButton}
          >
            Назад
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Стили остаются без изменений
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
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 8,
  },
});

export default CreateRequestScreen;