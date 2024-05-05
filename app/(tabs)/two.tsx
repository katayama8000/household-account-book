import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Text>hello</Text>
      <Link
        href="/sample"
        style={{ color: 'blue', fontSize: 20, marginTop: 20 }}>
        sample
      </Link>
      <Link
        href="/auth/sign-in"
        style={{ color: 'blue', fontSize: 20, marginTop: 20 }}>
        sign-in
      </Link>
      <Link
        href="/auth/sign-up"
        style={{ color: 'blue', fontSize: 20, marginTop: 20 }}>
        sign-up
      </Link>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
