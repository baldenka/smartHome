import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8B4513', // SaddleBrown
    accent: '#DEB887', // BurlyWood  
    background: '#FAEBD7', // AntiqueWhite
    surface: '#FAEBD7', // Добавьте это
    text: '#000000',
  },
  roundness: 4, // 4mm скругление как в требованиях
};