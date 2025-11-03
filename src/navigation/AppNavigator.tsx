import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectIsAuthenticated, selectUser } from '../store/selectors';

// Импорты экранов
import LoginScreen from '../screens/LoginScreen';

// Жилец
import ResidentHomeScreen from '../screens/resident/ResidentHomeScreen';
import CounterReadingsScreen from '../screens/resident/CounterReadingsScreen';
import CreateRequestScreen from '../screens/resident/CreateRequestScreen';
import MyRequestsScreen from '../screens/resident/MyRequestsScreen';

// Диспетчер
import DispatcherHomeScreen from '../screens/dispatcher/DispatcherHomeScreen';
import UnprocessedRequestsScreen from '../screens/dispatcher/UnprocessedRequestsScreen';
import ProcessRequestScreen from '../screens/dispatcher/ProcessRequestScreen';
import InProgressRequestsScreen from '../screens/dispatcher/InProgressRequestsScreen';
import RequestArchiveScreen from '../screens/dispatcher/RequestArchiveScreen';

// Технический директор
import TechnicalDirectorHomeScreen from '../screens/technical-director/TechnicalDirectorHomeScreen';
import DistributionRequestsScreen from '../screens/technical-director/DistributionRequestsScreen';
import TechnicalReportsScreen from '../screens/technical-director/TechnicalReportsScreen';
import WorkReportsScreen from '../screens/technical-director/WorkReportsScreen';

// Охрана
import SecurityHomeScreen from '../screens/security/SecurityHomeScreen';
import CameraLiveScreen from '../screens/security/CameraLiveScreen';
import CameraArchiveScreen from '../screens/security/CameraArchiveScreen';
import LocksStatusScreen from '../screens/security/LocksStatusScreen';
import AlarmStatusScreen from '../screens/security/AlarmStatusScreen';

// Общие экраны
import NotificationsScreen from '../screens/common/NotificationsScreen';

// Техник
import TechnicianHomeScreen from '../screens/technician/TechnicianHomeScreen';
import DeviceStatusScreen from '../screens/technician/DeviceStatusScreen';
import CreateRequestScreenT from '../screens/technician/CreateRequestScreen';

// Инспектор по качеству
import QualityInspectorHomeScreen from '../screens/quality-inspector/QualityInspectorHomeScreen';
import TechnicalDataScreen from '../screens/quality-inspector/TechnicalDataScreen';
import CreateQualityReportScreen from '../screens/quality-inspector/CreateQualityReportScreen';

// Бухгалтер
import AccountantHomeScreen from '../screens/accountant/AccountantHomeScreen';
import WorkDataScreen from '../screens/accountant/WorkDataScreen';
import CreateWorkReportScreen from '../screens/accountant/CreateWorkReportScreen';
import CounterDataScreen from '../screens/accountant/CounterDataScreen';
import StatisticsScreen from '../screens/accountant/StatisticsScreen';

// Финансовый директор
import FinancialDirectorHomeScreen from '../screens/financial-director/FinancialDirectorHomeScreen';
import FinancialWorkReportsScreen from '../screens/financial-director/WorkReportsScreen';
import BudgetPlanningScreen from '../screens/financial-director/BudgetPlanningScreen';
import FinancialAnalyticsScreen from '../screens/financial-director/FinancialAnalyticsScreen';

// Главный директор
import MainDirectorHomeScreen from '../screens/main-director/MainDirectorHomeScreen';
import SendMessageScreen from '../screens/main-director/SendMessageScreen';
import UserEditorScreen from '../screens/main-director/UserEditorScreen';
import MainDirectorAnalyticsScreen from '../screens/main-director/MainDirectorAnalyticsScreen';
import SystemMonitoringScreen from '../screens/main-director/SystemMonitoringScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  
  // ДОБАВЬТЕ ЭТУ ПРОВЕРКУ ТИПА
console.log('=== TYPE CHECK ===');
console.log('isAuthenticated type:', typeof isAuthenticated);
console.log('isAuthenticated value:', isAuthenticated);
console.log('==================');

  // ДОБАВЬ ЭТИ СТРОКИ ДЛЯ ДИАГНОСТИКИ
  console.log('=== DEBUG AppNavigator ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);
  console.log('user role:', user?.role);
  console.log('======================');

  const getRoleBasedScreens = () => {
    switch (user?.role) {
      case 'resident':
        return (
          <>
            <Stack.Screen name="ResidentHomeScreen" component={ResidentHomeScreen} />
            <Stack.Screen name="CounterReadingsScreen" component={CounterReadingsScreen} />
            <Stack.Screen name="CreateRequestScreen" component={CreateRequestScreen} />
            <Stack.Screen name="MyRequestsScreen" component={MyRequestsScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
          </>
        );
      
      case 'dispatcher':
        return (
          <>
            <Stack.Screen name="DispatcherHomeScreen" component={DispatcherHomeScreen} />
            <Stack.Screen name="UnprocessedRequestsScreen" component={UnprocessedRequestsScreen} />
            <Stack.Screen name="ProcessRequestScreen" component={ProcessRequestScreen} />
            <Stack.Screen name="InProgressRequestsScreen" component={InProgressRequestsScreen} />
            <Stack.Screen name="RequestArchiveScreen" component={RequestArchiveScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
          </>
        );
      
      case 'technical_director':
        return (
          <>
            <Stack.Screen name="TechnicalDirectorHomeScreen" component={TechnicalDirectorHomeScreen} />
            <Stack.Screen name="DistributionRequestsScreen" component={DistributionRequestsScreen} />
            <Stack.Screen name="TechnicalReportsScreen" component={TechnicalReportsScreen} />
            <Stack.Screen name="WorkReportsScreen" component={WorkReportsScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
          </>
        );
      
      case 'quality_inspector':
        return (
          <>
            <Stack.Screen name="QualityInspectorHomeScreen" component={QualityInspectorHomeScreen} />
            <Stack.Screen name="TechnicalDataScreen" component={TechnicalDataScreen} />
            <Stack.Screen name="CreateQualityReportScreen" component={CreateQualityReportScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
            <Stack.Screen name="SendMessageScreen" component={SendMessageScreen} />
          </>
        );
      
        case 'technician':
          return (
            <>
              <Stack.Screen name="TechnicianHomeScreen" component={TechnicianHomeScreen} />
              <Stack.Screen name="DeviceStatusScreen" component={DeviceStatusScreen} />
              <Stack.Screen name="CreateRequestScreenT" component={CreateRequestScreenT} />
              <Stack.Screen name="TechnicalDataScreen" component={TechnicalDataScreen} />
              <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
            </>
          );
      
      case 'accountant':
        return (
          <>
            <Stack.Screen name="AccountantHomeScreen" component={AccountantHomeScreen} />
            <Stack.Screen name="WorkDataScreen" component={WorkDataScreen} />
            <Stack.Screen name="CounterDataScreen" component={CounterDataScreen} />
            <Stack.Screen name="CreateWorkReportScreen" component={CreateWorkReportScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
            <Stack.Screen name="StatisticsScreen" component={StatisticsScreen} /> 
          </>
        );
      
      case 'financial_director':
        return (
          <>
            <Stack.Screen name="FinancialDirectorHomeScreen" component={FinancialDirectorHomeScreen} />
            <Stack.Screen name="FinancialWorkReportsScreen" component={FinancialWorkReportsScreen} />
            <Stack.Screen name="FinancialAnalyticsScreen" component={FinancialAnalyticsScreen} />
            <Stack.Screen name="BudgetPlanningScreen" component={BudgetPlanningScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
          </>
        );
      
      case 'main_director':
        return (
          <>
            <Stack.Screen name="MainDirectorHomeScreen" component={MainDirectorHomeScreen} />
            <Stack.Screen name="SendMessageScreen" component={SendMessageScreen} />
            <Stack.Screen name="WorkReportsScreen" component={WorkReportsScreen} />
            <Stack.Screen name="TechnicalReportsScreen" component={TechnicalReportsScreen} />
            <Stack.Screen name="UserEditorScreen" component={UserEditorScreen} />
            <Stack.Screen name="MainDirectorAnalyticsScreen" component={MainDirectorAnalyticsScreen} />
            <Stack.Screen name="SystemMonitoringScreen" component={SystemMonitoringScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
          </>
        );
      
      case 'security_guard':
        return (
          <>
            <Stack.Screen name="SecurityHomeScreen" component={SecurityHomeScreen} />
            <Stack.Screen name="CameraLiveScreen" component={CameraLiveScreen} />
            <Stack.Screen name="CameraArchiveScreen" component={CameraArchiveScreen} />
            <Stack.Screen name="LocksStatusScreen" component={LocksStatusScreen} />
            <Stack.Screen name="AlarmStatusScreen" component={AlarmStatusScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
          </>
        );
      
      default:
        return <Stack.Screen name="ResidentHomeScreen" component={ResidentHomeScreen} />;
    }
  };

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        getRoleBasedScreens()
      )}
    </Stack.Navigator>
  );

  //return (
    //<Stack.Navigator>
      //<Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      //<Stack.Screen name="ResidentHomeScreen" component={ResidentHomeScreen} />
      //<Stack.Screen name="DispatcherHomeScreen" component={DispatcherHomeScreen} />
      //<Stack.Screen name="TechnicalDirectorHomeScreen" component={TechnicalDirectorHomeScreen} />
      //{/* Добавь остальные основные экраны по необходимости */}
    //</Stack.Navigator>
  //);
};

export default AppNavigator;