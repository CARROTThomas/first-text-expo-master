import React, { useState, useEffect } from 'react';
import {View, TextInput, Button, Text, ScrollView, StyleSheet, FlatList} from 'react-native';
import axios from 'axios';
import { ActivityIndicator } from 'react-native';



const ChatComponent = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPreviousMessages = async () => {
    setLoading(true);
    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDk3MDk1NjcsImV4cCI6MTcwOTcxNjc2Nywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGhvbWFzIn0.DG4JAEAK1l3bAuXmC2VlZJYQkup3WcFmBeTIaaw6NiTTvg2ygOI7Cw00af3G3tGZn6l_EKgZEJ3f0gz0lIQNTyeu9DP6LDynr30zbHAaQa_fEosTrsTTsswS6YJho6peNB-_lblZKa21H7tHvTdl82a17a7jQcKRSizBcTN8zJdkF8mNoTOnR-mGoM7E0nz2zmST6oPFGVqWaLDu-LhRILcYkG97g5YNSe-L-yCNxVYTv7xM51N0z5PV7TpBfxIkzOfs_M_cmzEWF90rGSPNIDJw83QBQK9OpESR3zM6nOK3p7a8YouXTThxDlXnMWKthOIyImEfwTU2JEZtLXVvWA';

      const response = await axios.get('https://askia.esdlyon.dev/api/chat/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      //const previousMessages = response.data;
      console.log('Messages précédents récupérés avec succès :', response.data);


      // @ts-ignore
      setConversation(prevConversation => [
        ...prevConversation,
        ...response.data.map((message) => [
          { type: 'question', content: message.question },
          { type: 'response', content: message.response },
        ]).flat(),
      ]);



      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages précédents :', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousMessages();
  }, []);

  if (loading) {
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

  const sendToIA = async () => {

    const backendUrl = 'https://askia.esdlyon.dev/api/chat/ask/pdf';

    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDk3MDk1NjcsImV4cCI6MTcwOTcxNjc2Nywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGhvbWFzIn0.DG4JAEAK1l3bAuXmC2VlZJYQkup3WcFmBeTIaaw6NiTTvg2ygOI7Cw00af3G3tGZn6l_EKgZEJ3f0gz0lIQNTyeu9DP6LDynr30zbHAaQa_fEosTrsTTsswS6YJho6peNB-_lblZKa21H7tHvTdl82a17a7jQcKRSizBcTN8zJdkF8mNoTOnR-mGoM7E0nz2zmST6oPFGVqWaLDu-LhRILcYkG97g5YNSe-L-yCNxVYTv7xM51N0z5PV7TpBfxIkzOfs_M_cmzEWF90rGSPNIDJw83QBQK9OpESR3zM6nOK3p7a8YouXTThxDlXnMWKthOIyImEfwTU2JEZtLXVvWA';

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

        // @ts-ignore
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
        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <FlatList
                data={conversation}
                keyExtractor={(item, index) => `${item.type}_${index}`}
                renderItem={({ item, index }) => (
                    <View style={styles.messageContainer}>
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
                )}
            />
        )}

        <TextInput
            style={styles.input}
            placeholder="Posez votre question"
            value={input}
            onChangeText={(text) => setInput(text)}
        />
        <Button title="Envoyer" onPress={sendToIA} />
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
