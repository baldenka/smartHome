import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, TextInput, Text, RadioButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/selectors'; 
import { useDispatch } from 'react-redux';
import { submitReading } from '../../store/counterReadingsSlice';

const CounterReadingsScreen = () => {
  const [counterType, setCounterType] = useState<'water' | 'electricity'>('water');
  const [coldWater, setColdWater] = useState('');
  const [hotWater, setHotWater] = useState('');
  const [electricity, setElectricity] = useState('');
  const [electricityDay, setElectricityDay] = useState('');
  const [electricityNight, setElectricityNight] = useState('');

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (counterType === 'water') {
      if (!coldWater || !hotWater) {
        alert('Заполните все поля для счетчиков воды');
        return;
      }
      
      // ДЕБАГ: логируем перед dispatch
      console.log('🔄 DISPATCH COLD WATER:', {
        userId: user?.id,
        userFio: user?.name,
        userApartment: user?.apartment,
        readings: parseFloat(coldWater),
        period: new Date().toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
      });
      
      // Отправка данных воды
      dispatch(submitReading({
        userId: user?.id || '',
        userFio: user?.name || '',
        userApartment: user?.apartment || '',
        counterType: 'cold_water',
        readings: parseFloat(coldWater),
        period: new Date().toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
      }));
      
      dispatch(submitReading({
        userId: user?.id || '',
        userFio: user?.name || '',
        userApartment: user?.apartment || '',
        counterType: 'hot_water', 
        readings: parseFloat(hotWater),
        period: new Date().toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
      }));
    } else {
      if (!electricity || !electricityDay || !electricityNight) {
        alert('Заполните все поля для счетчиков электричества');
        return;
      }
      
      // 1. Общее электричество
      dispatch(submitReading({
        userId: user?.id || '',
        userFio: user?.name || '',
        userApartment: user?.apartment || '',
        counterType: 'electricity',
        readings: parseFloat(electricity),
        period: new Date().toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
      }));
      
      // 2. Электричество день 
      dispatch(submitReading({
        userId: user?.id || '',
        userFio: user?.name || '',
        userApartment: user?.apartment || '',
        counterType: 'electricity_day', 
        readings: parseFloat(electricityDay),
        period: new Date().toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
      }));
      
      // 3. Электричество ночь
      dispatch(submitReading({
        userId: user?.id || '',
        userFio: user?.name || '',
        userApartment: user?.apartment || '',
        counterType: 'electricity_night', 
        readings: parseFloat(electricityNight),
        period: new Date().toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
      }));
    }
    
    alert('Показания успешно переданы бухгалтеру!');
    
    // Очистка формы
    setColdWater('');
    setHotWater('');
    setElectricity('');
    setElectricityDay('');
    setElectricityNight('');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Передача показаний счетчиков</Title>
          
          <Text style={styles.sectionTitle}>Выберите тип счетчика:</Text>
          <RadioButton.Group 
            onValueChange={(value: string) => setCounterType(value as 'water' | 'electricity')} 
            value={counterType}
          > 
           <View style={styles.radioOption}>
              <RadioButton value="water" />
              <Text>Счетчики воды</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="electricity" />
              <Text>Счетчики электричества</Text>
            </View>
          </RadioButton.Group>

          {counterType === 'water' && (
            <View style={styles.counterForm}>
              <TextInput
                label="Холодная вода (м³)"
                value={coldWater}
                onChangeText={setColdWater}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Горячая вода (м³)"
                value={hotWater}
                onChangeText={setHotWater}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
            </View>
          )}

          {counterType === 'electricity' && (
            <View style={styles.counterForm}>
              <TextInput
                label="Электричество (кВт·ч) - общее"
                value={electricity}
                onChangeText={setElectricity}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Электричество день (кВт·ч)"
                value={electricityDay}
                onChangeText={setElectricityDay}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Электричество ночь (кВт·ч)"
                value={electricityNight}
                onChangeText={setElectricityNight}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
            </View>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            Подтвердить и передать
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
  sectionTitle: {
    fontSize: 16,
    marginVertical: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  counterForm: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});

export default CounterReadingsScreen;