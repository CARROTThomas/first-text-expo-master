import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

const ChatComponent = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const fetchPreviousMessages = async () => {
    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDkyODg1OTgsImV4cCI6MTcwOTM3NDk5OCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGhvbWFzIn0.igqz0PyiH1l3re0lu-HJ3_yC6AkFrYsqWaR9E5UA-HeKRO54n-XCJLqtjSz4TXsfBY5acOuEX1LTmC1_tjX42e4FTTM6KEFxdH7XUKrsgl5V2HFtCHE4bPWUPFRHaMykHLM-mEt15LHTPACnFveK7Gr6xOmo9f-RSjejZYXYEq7QfsK8fLEUBAOSktSNaAsjZusxjvAHLyQPrBdZ2NCc0A8QEK2rzrwU22MpGaZg8MqzI-uYYPqIjQLvLIBSdQif8wDjqPc5A4x-ZrTbkRPekSY3yvJUJnJ_gahlL3iyoqZjdYt_n5TZs6PIkDb7rWdBduCVM9PDBqRcW_iX0AeZ3Q';

      const response = await axios.get('https://localhost:8000/api/chat/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const previousMessages = response.data;

      if (Array.isArray(previousMessages)) {
        console.log('Messages précédents récupérés avec succès :', previousMessages);
        setConversation(response.data);
      } else {
        console.error('Les messages précédents ne sont pas un tableau valide :', previousMessages);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages précédents :', error);
    }
  };

  useEffect(() => {
    fetchPreviousMessages();
  }, []);

  const sendToIA = async () => {

    const backendUrl = 'https://localhost:8000/api/chat/ask/pdf';

    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDkyODg1OTgsImV4cCI6MTcwOTM3NDk5OCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGhvbWFzIn0.igqz0PyiH1l3re0lu-HJ3_yC6AkFrYsqWaR9E5UA-HeKRO54n-XCJLqtjSz4TXsfBY5acOuEX1LTmC1_tjX42e4FTTM6KEFxdH7XUKrsgl5V2HFtCHE4bPWUPFRHaMykHLM-mEt15LHTPACnFveK7Gr6xOmo9f-RSjejZYXYEq7QfsK8fLEUBAOSktSNaAsjZusxjvAHLyQPrBdZ2NCc0A8QEK2rzrwU22MpGaZg8MqzI-uYYPqIjQLvLIBSdQif8wDjqPc5A4x-ZrTbkRPekSY3yvJUJnJ_gahlL3iyoqZjdYt_n5TZs6PIkDb7rWdBduCVM9PDBqRcW_iX0AeZ3Q';

      const backendResponse = await axios.post(
          backendUrl,
          {
            "message": [
              { "role": "user", "content": input }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
      );

      console.log('Réponse complète du backend :', backendResponse.data);

      const lastMessage = backendResponse.data.lastMessage;

      if (lastMessage) {
        console.log('Question utilisateur :', lastMessage.question);
        console.log('Réponse du backend :', lastMessage.response);

        setConversation(prevConversation => [
          ...prevConversation,
          { type: 'question', content: lastMessage.question },
          { type: 'response', content: lastMessage.response },
        ]);
      } else {
        console.error('Réponse inattendue du backend :', backendResponse.data);
      }

      setInput('');
    } catch (error) {
      console.error('Erreur lors de la requête vers le backend:', error);
    }
  };



  return (
      <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder="Posez votre question"
            value={input}
            onChangeText={(text) => setInput(text)}
        />
        <Button title="Envoyer" onPress={sendToIA} />

        {conversation.length > 0 && (
            <ScrollView style={styles.responseContainer}>
              {conversation.map((item, index) => (
                  <View key={index} style={styles.messageContainer}>
                    {item.type === 'question' && (
                        <View style={[styles.message, styles.questionMessage]}>
                          <Text style={styles.questionText}>{item.content}</Text>
                        </View>
                    )}
                    {item.type === 'response' && (
                        <View style={[styles.message, styles.responseMessage]}>
                          <Text>IA</Text>
                          <Text style={styles.contentText}>{item.content}</Text>
                        </View>
                    )}
                  </View>
              ))}
            </ScrollView>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  responseContainer: {
    marginTop: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  message: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  questionMessage: {
    backgroundColor: '#e6e6e6',
    alignSelf: 'flex-end',
  },
  responseMessage: {
    backgroundColor: '#4da6ff',
    alignSelf: 'flex-start',
  },
  questionText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ChatComponent;
