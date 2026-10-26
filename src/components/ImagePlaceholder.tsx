import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';

interface Props {
  height?: number;
  label?: string;
}

export const ImagePlaceholder: React.FC<Props> = ({ height = 150, label = 'Espaço para Imagem' }) => {
  return (
    <View style={[styles.container, { height }]}>
      <ImageIcon size={32} color="#2854B5" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F0FF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2854B5',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    width: '100%',
  },
  text: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#173B82',
    textAlign: 'center',
  },
});