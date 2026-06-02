/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SimpleForm } from './src/components/SimpleForm';

/**
 * # App
 * ---
 * - 간단설명: 앱 루트 컴포넌트
 */
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View className="flex-1">
        <SimpleForm />
      </View>
    </SafeAreaProvider>
  );
}

export default App;
