import React, { useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

// Interface pour définir le type de l'objet selectedFile
interface SelectedFile {
  name: string;
  type: string;
  size: number;
  uri?: string | undefined;
}
interface File {
  name: string;
  type: string;
  size: number;
  uri?: string | undefined;
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [simulatedFile, setSimulatedFile] = useState<File | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled) {
        console.log('Résultat DocumentPicker :', result);

        if (result.assets && result.assets.length > 0) {
          const selectedFile: SelectedFile = {
            name: result.assets[0].name || '',
            type: result.assets[0].mimeType || '',
            size: result.assets[0].size || 0,
            uri: result.assets[0].uri || '',
          };

          setSelectedFile(selectedFile);

          // Copier le fichier dans le dossier de l'application web (pour l'environnement web)
          const response = await fetch(selectedFile.uri );
          const blob = await response.blob();

          // Créer un objet de type File pour simuler un fichier dans l'environnement web
          const simulatedFile = new File([blob], selectedFile.name, { type: selectedFile.type });

          // Stocker le fichier simulé dans l'état
          setSimulatedFile(simulatedFile);
        } else {
          console.error('Aucun fichier sélectionné.');
        }
      }
    } catch (error) {
      console.error('Erreur lors du choix du document:', error);
    }
  };

  const uploadDocument = async () => {
    if (simulatedFile) {
      try {
        const backendUrl = 'https://localhost:8000/upload';
        const formData = new FormData();
        formData.append('document', simulatedFile);

        const response = await axios.post(backendUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Réponse du backend:', response.data);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du fichier au backend:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Envoyer un fichier à interroger :</Text>

      <Button title="Choisir un PDF" onPress={pickDocument}/>
      {selectedFile && (
        <View>
          <Text style={styles.infoText}>Nom du fichier: {selectedFile.name}</Text>
          <Text style={styles.infoText}>Type de fichier: {selectedFile.type}</Text>
          <Text style={styles.infoText}>Taille du fichier: {selectedFile.size} octets</Text>
        </View>
      )}
      {simulatedFile && (
        <View>
          <Text style={styles.infoText}>Simulated File: {simulatedFile.name}</Text>
          <Button title="Envoyer au Backend" onPress={uploadDocument}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#565656',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
  infoText: {
    color: '#fff',
    marginBottom: 5,
  },
});
