import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Chip, DataTable, Searchbar, Button, Menu, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { demoWorkData } from '../../utils/demoData';

const WorkReportsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>(['all']);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>(['all']);
    const [periodMenuVisible, setPeriodMenuVisible] = useState(false);
    const [employeeMenuVisible, setEmployeeMenuVisible] = useState(false);

    const allWorkData = demoWorkData; // В будущем из store

    // Получаем уникальные периоды из данных
    const availablePeriods = useMemo(() => {
        const periodsSet = new Set(allWorkData.map(work => 
            new Date(work.period.start).toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
        ));
        const periodsArray = Array.from(periodsSet).sort((a, b) => {
            const [monthA, yearA] = a.split('.').map(Number);
            const [monthB, yearB] = b.split('.').map(Number);
            return new Date(yearB, monthB - 1) - new Date(yearA, monthA - 1);
        });
        return ['all', ...periodsArray];
    }, [allWorkData]);

    // Получаем уникальных сотрудников
    const availableEmployees = useMemo(() => {
        const employeesSet = new Set(allWorkData.map(work => work.employee));
        return ['all', ...Array.from(employeesSet)];
    }, [allWorkData]);

    // Функции для множественного выбора (аналогичные предыдущим)
    const togglePeriod = (period: string) => {
        if (period === 'all') setSelectedPeriods(['all']);
        else {
            setSelectedPeriods(prev => {
                const newPeriods = prev.filter(p => p !== 'all');
                return newPeriods.includes(period) 
                    ? newPeriods.filter(p => p !== period)
                    : [...newPeriods, period];
            });
        }
    };

    const toggleEmployee = (employee: string) => {
        if (employee === 'all') setSelectedEmployees(['all']);
        else {
            setSelectedEmployees(prev => {
                const newEmployees = prev.filter(e => e !== 'all');
                return newEmployees.includes(employee) 
                    ? newEmployees.filter(e => e !== employee)
                    : [...newEmployees, employee];
            });
        }
    };

    const selectAllPeriods = () => setSelectedPeriods(['all']);
    const selectAllEmployees = () => setSelectedEmployees(['all']);

    const isPeriodSelected = (period: string) => selectedPeriods.includes(period);
    const isEmployeeSelected = (employee: string) => selectedEmployees.includes(employee);

    // Фильтрация данных
    const filteredWorkData = allWorkData.filter(work => {
        const workPeriod = new Date(work.period.start).toLocaleDateString('ru-RU', { 
            month: '2-digit', year: 'numeric' 
        });
        
        const matchesPeriod = selectedPeriods.includes('all') || selectedPeriods.includes(workPeriod);
        const matchesEmployee = selectedEmployees.includes('all') || selectedEmployees.includes(work.employee);
        const matchesSearch = work.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            work.employee.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesPeriod && matchesEmployee && matchesSearch;
    });

    // Финансовая аналитика
    const financialStats = useMemo(() => {
        const totalCost = filteredWorkData.reduce((sum, work) => sum + work.cost, 0);
        const avgCostPerWork = filteredWorkData.length > 0 ? totalCost / filteredWorkData.length : 0;
        
        // Группировка по сотрудникам
        const costByEmployee: { [employee: string]: number } = {};
        filteredWorkData.forEach(work => {
            if (!costByEmployee[work.employee]) costByEmployee[work.employee] = 0;
            costByEmployee[work.employee] += work.cost;
        });

        // Группировка по периодам
        const costByPeriod: { [period: string]: number } = {};
        filteredWorkData.forEach(work => {
            const period = new Date(work.period.start).toLocaleDateString('ru-RU', { 
                month: '2-digit', year: 'numeric' 
            });
            if (!costByPeriod[period]) costByPeriod[period] = 0;
            costByPeriod[period] += work.cost;
        });

        return {
            totalCost,
            avgCostPerWork,
            workCount: filteredWorkData.length,
            costByEmployee,
            costByPeriod
        };
    }, [filteredWorkData]);

    const handleExportToExcel = () => {
        console.log('Экспорт финансовых данных:', filteredWorkData);
        alert('Финансовый отчет экспортирован в Excel!');
    };

    const getPeriodFromDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', { 
            month: '2-digit', year: 'numeric' 
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Финансовые отчеты по работам</Title>
                    <Text style={styles.subtitle}>
                        Анализ затрат и эффективности выполненных работ
                    </Text>

                    <Searchbar
                        placeholder="Поиск по задаче или сотруднику..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                    />

                    {/* Фильтры */}
                    <View style={styles.filtersRow}>
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Периоды:</Text>
                            <Menu
                                visible={periodMenuVisible}
                                onDismiss={() => setPeriodMenuVisible(false)}
                                anchor={
                                    <Chip mode="outlined" onPress={() => setPeriodMenuVisible(true)}>
                                        {selectedPeriods.includes('all') ? 'Все периоды' : `Периоды: ${selectedPeriods.length}`}
                                    </Chip>
                                }
                            >
                                <Menu.Item onPress={selectAllPeriods} title="Все периоды" />
                                <Divider />
                                {availablePeriods.filter(p => p !== 'all').map((period) => (
                                    <Menu.Item
                                        key={period}
                                        onPress={() => togglePeriod(period)}
                                        title={period}
                                        leadingIcon={isPeriodSelected(period) ? "check" : undefined}
                                    />
                                ))}
                            </Menu>
                        </View>

                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Сотрудники:</Text>
                            <Menu
                                visible={employeeMenuVisible}
                                onDismiss={() => setEmployeeMenuVisible(false)}
                                anchor={
                                    <Chip mode="outlined" onPress={() => setEmployeeMenuVisible(true)}>
                                        {selectedEmployees.includes('all') ? 'Все сотрудники' : `Сотрудники: ${selectedEmployees.length}`}
                                    </Chip>
                                }
                            >
                                <Menu.Item onPress={selectAllEmployees} title="Все сотрудники" />
                                <Divider />
                                {availableEmployees.filter(e => e !== 'all').map((employee) => (
                                    <Menu.Item
                                        key={employee}
                                        onPress={() => toggleEmployee(employee)}
                                        title={employee}
                                        leadingIcon={isEmployeeSelected(employee) ? "check" : undefined}
                                    />
                                ))}
                            </Menu>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            {/* Финансовая сводка */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Финансовая сводка</Title>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Общие затраты</Text>
                            <Text style={styles.statValue}>{financialStats.totalCost.toLocaleString()} ₽</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Количество работ</Text>
                            <Text style={styles.statValue}>{financialStats.workCount}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Средняя стоимость</Text>
                            <Text style={styles.statValue}>{Math.round(financialStats.avgCostPerWork)} ₽</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            {/* Затраты по сотрудникам */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Затраты по сотрудникам</Title>
                    <View style={styles.employeeCosts}>
                        {Object.entries(financialStats.costByEmployee)
                            .sort(([,a], [,b]) => b - a)
                            .map(([employee, cost]) => (
                                <View key={employee} style={styles.employeeCostItem}>
                                    <Text style={styles.employeeName}>{employee}</Text>
                                    <Text style={styles.employeeCost}>{cost.toLocaleString()} ₽</Text>
                                </View>
                            ))}
                    </View>
                </Card.Content>
            </Card>

            {/* Детальная таблица работ */}
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Title>Детализация работ</Title>
                        <Button mode="outlined" icon="file-export" onPress={handleExportToExcel}>
                            Экспорт
                        </Button>
                    </View>

                    <ScrollView horizontal>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Задача</DataTable.Title>
                                <DataTable.Title>Сотрудник</DataTable.Title>
                                <DataTable.Title>Период</DataTable.Title>
                                <DataTable.Title>Время работы</DataTable.Title>
                                <DataTable.Title numeric>Стоимость</DataTable.Title>
                                <DataTable.Title>Материалы</DataTable.Title>
                            </DataTable.Header>

                            {filteredWorkData.map((work) => (
                                <DataTable.Row key={work.id}>
                                    <DataTable.Cell>
                                        <Text style={styles.taskText}>{work.task}</Text>
                                        {work.requestId && (
                                            <Text style={styles.requestId}>Заявка: {work.requestId}</Text>
                                        )}
                                    </DataTable.Cell>
                                    <DataTable.Cell>{work.employee}</DataTable.Cell>
                                    <DataTable.Cell>{getPeriodFromDate(work.period.start)}</DataTable.Cell>
                                    <DataTable.Cell>{work.executionTime}</DataTable.Cell>
                                    <DataTable.Cell numeric>
                                        <Text style={styles.costText}>{work.cost.toLocaleString()} ₽</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={styles.materialsText}>
                                            {work.materialsUsed || 'Не указаны'}
                                        </Text>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </ScrollView>

                    {filteredWorkData.length === 0 && (
                        <Text style={styles.noDataText}>Данные не найдены</Text>
                    )}
                </Card.Content>
            </Card>

            {/* Аналитика эффективности */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Аналитика эффективности</Title>
                    <Text style={styles.analysisText}>
                        • Самые затратные работы: {(() => {
                            const maxCost = Math.max(...filteredWorkData.map(w => w.cost));
                            const expensiveWork = filteredWorkData.find(w => w.cost === maxCost);
                            return expensiveWork ? `${expensiveWork.task} (${maxCost.toLocaleString()} ₽)` : 'нет данных';
                        })()}
                    </Text>
                    <Text style={styles.analysisText}>
                        • Наиболее продуктивный сотрудник: {(() => {
                            const employeeWorkCount: { [employee: string]: number } = {};
                            filteredWorkData.forEach(work => {
                                employeeWorkCount[work.employee] = (employeeWorkCount[work.employee] || 0) + 1;
                            });
                            const maxWorks = Math.max(...Object.values(employeeWorkCount));
                            const productiveEmployee = Object.keys(employeeWorkCount).find(emp => 
                                employeeWorkCount[emp] === maxWorks
                            );
                            return productiveEmployee || 'нет данных';
                        })()}
                    </Text>
                    <Text style={styles.analysisText}>
                        • Общая эффективность: {financialStats.workCount > 0 ? '📊 Анализ завершен' : 'нет данных'}
                    </Text>
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
        marginBottom: 16,
    },
    searchBar: {
        marginBottom: 16,
    },
    filtersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    filterSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        flex: 1,
        minWidth: '45%',
    },
    filterLabel: {
        fontSize: 14,
        marginRight: 8,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
        minWidth: '30%',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8B4513',
    },
    employeeCosts: {
        marginTop: 8,
    },
    employeeCostItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    employeeName: {
        fontSize: 14,
        fontWeight: '500',
    },
    employeeCost: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8B4513',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    taskText: {
        fontSize: 12,
        fontWeight: '500',
    },
    requestId: {
        fontSize: 10,
        color: '#666',
        fontStyle: 'italic',
    },
    costText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#8B4513',
    },
    materialsText: {
        fontSize: 11,
        color: '#666',
        fontStyle: 'italic',
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: 16,
        color: '#666',
        fontStyle: 'italic',
    },
    analysisText: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333',
    },
});

export default WorkReportsScreen;