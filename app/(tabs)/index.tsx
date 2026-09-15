import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <Text className="text-2xl font-bold text-foreground">Home Tab</Text>
      <Text className="text-muted-foreground mt-2">Welcome to Pam!</Text>
    </SafeAreaView>
  );
}
