import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

const ChatComponent = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const fetchPreviousMessages = async () => {
    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDkyODEyNTYsImV4cCI6MTcwOTI4ODQ1Niwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGhvbWFzIn0.j1HG7pU6e7gxp7HsmeK25aqN3GFC0GJp1vRNdAKzpzFhOFE03IoFRTCZRoo1IaT6IE6IIL-tZCuK8b8ywrKOJTZHP0yrO0suFcYod_HkhIKgvb7dMXiMuBOh0y2ghbOHIuqEWcZY_PxoAj1Z_b1jqlHDnsorfNFu2cHFcB2jJ32BfoHbtztqedEmvMidR5Gh1flJ1_iDsywM4DbZbNdOzJuBM0vzUkSbUVzGExehQgEAgdrSB7U-nVvC5a5CtgT_1UqXpOrMeuo1jyKGBTTy6kkWNgSn-M9tEiQmhvNG-8RU-np4_EbJ15brcTm1yRLe4pQ5kIez4qK7wsPJJWSzGg';

      const response = await axios.get('https://localhost:8000/api/chat/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const previousMessages = response.data;

      if (Array.isArray(previousMessages)) {
        console.log('Messages précédents récupérés avec succès :', previousMessages);
        setConversation(previousMessages);
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
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDkyODEyNTYsImV4cCI6MTcwOTI4ODQ1Niwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGhvbWFzIn0.j1HG7pU6e7gxp7HsmeK25aqN3GFC0GJp1vRNdAKzpzFhOFE03IoFRTCZRoo1IaT6IE6IIL-tZCuK8b8ywrKOJTZHP0yrO0suFcYod_HkhIKgvb7dMXiMuBOh0y2ghbOHIuqEWcZY_PxoAj1Z_b1jqlHDnsorfNFu2cHFcB2jJ32BfoHbtztqedEmvMidR5Gh1flJ1_iDsywM4DbZbNdOzJuBM0vzUkSbUVzGExehQgEAgdrSB7U-nVvC5a5CtgT_1UqXpOrMeuo1jyKGBTTy6kkWNgSn-M9tEiQmhvNG-8RU-np4_EbJ15brcTm1yRLe4pQ5kIez4qK7wsPJJWSzGg';

      const backendResponse = await axios.post(
          backendUrl,
          { messages: [{ content: input }] },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
      );

      console.log('Question User:', backendResponse.data[0].question);
      console.log('Réponse du backend:', backendResponse.data[0].response);

      const question = input; // Utilisez la question que vous avez envoyée
      const response = backendResponse.data[0].response; // Utilisez la réponse du backend

      // Ajouter la question et la réponse à la conversation
      setConversation(prevConversation => [
        ...prevConversation,
        { type: 'question', content: question },
        { type: 'response', content: response },
      ]);

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
                          <Text style={styles.roleText}>IA</Text>
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
