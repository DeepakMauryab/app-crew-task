import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Button, { Variant } from './Button';
import { Metrics } from '../../theme/spacing';
import ff from '../../theme/fonts';
import { Colors } from '../../theme/colors';
import { Note } from './NotesItem';

interface AddNoteModalProps {
  visible: boolean;
  isLoading: boolean;
  selectedNote?: Note;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading,
  selectedNote,
}) => {
  const [title, setTitle] = useState(selectedNote?.title ?? '');
  const [content, setContent] = useState(selectedNote?.content ?? '');

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !content.trim()) return;
    onSubmit(title, content);
    setTitle('');
    setContent('');
  }, [title, content, onSubmit]);

  const handleClose = useCallback(() => {
    setTitle('');
    setContent('');
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modal}>
          <Text style={styles.header}>Add New Note</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={Colors.textPrimary}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            placeholderTextColor={Colors.textPrimary}
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttons}>
            <Button
              isLoading={isLoading}
              onPress={handleSubmit}
              style={{ flex: 1, marginRight: Metrics.s8 }}
            >
              Submit
            </Button>
            <Button
              onPress={handleClose}
              style={{ flex: 1 }}
              variant={Variant.Outlined}
            >
              Close
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: Metrics.s16,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: Metrics.s12,
    padding: Metrics.s16,
  },
  header: {
    fontFamily: ff.Medium,
    fontSize: Metrics.fs18,
    marginBottom: Metrics.s12,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Metrics.s6,
    padding: Metrics.s8,
    fontFamily: ff.Regular,
    marginBottom: Metrics.s12,
  },
  textArea: {
    height: Metrics.s80,
    textAlignVertical: 'top',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: Metrics.s8,
  },
});
