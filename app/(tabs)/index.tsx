import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import axios from 'axios';

interface Joke {
  value: string;
}

export default function TabOneScreen() {
  const [apiResponse, setApiResponse] = useState<Joke | undefined>();

  const fetchApi = async () => {
    try {
      const response = await axios.get<Joke>('https://api.chucknorris.io/jokes/random');
      setApiResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const onPress = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    fetchApi();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{apiResponse?.value}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>refresh</Text>
      </Pressable>
      {/* D'autres éléments du composant... */}
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
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});
