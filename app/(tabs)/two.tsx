import {FlatList, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import axios from "axios";
import {useEffect, useState} from "react";

interface Message {
  value: string;
}
interface ResponseApi {
  "role":string,
  "content":string
}
export default function TabTwoScreen() {

  const [apiResponse, setApiResponse] = useState<ResponseApi | undefined>();
  const [input, setInput] = useState('');

  const fetchApi = async () => {

    try {
      const response = await axios.post('https://api.chucknorris.io/jokes/random');
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
  const messages = [
    { id: '1', text: 'Salut!', sender: 'John' },
    { id: '2', text: 'Bonjour!', sender: 'Jane' },
    // ... autres messages
  ];

  const renderItem = ({ item }) => (
    <View style={item.sender === 'John' ? styles.messageSent : styles.messageReceived}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  messageSent: {
    backgroundColor: '#DCF8C6',
    padding: 8,
    alignSelf: 'flex-end',
    borderRadius: 8,
    marginBottom: 8,
  },
  messageReceived: {
    backgroundColor: '#EFEFEF',
    padding: 8,
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
