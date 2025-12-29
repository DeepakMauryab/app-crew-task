import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Metrics } from '../../theme/spacing';
import ff from '../../theme/fonts';
import Icon from '../layout/Icon';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NotesItemProps {
  note: Note;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export const NotesItem: React.FC<NotesItemProps> = ({
  note,
  index,
  onDelete,
  onEdit,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.content}>{note.content}</Text>
        <Text style={styles.date}>
          {new Date(note.created_at).toLocaleString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(note)}
          style={styles.iconButton}
        >
          <Icon
            type="Feather"
            name="edit"
            size={Metrics.ms20}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(note.id)}
          style={styles.iconButton}
        >
          <Icon name="trash-outline" size={Metrics.ms20} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Metrics.s8,
    padding: Metrics.s12,
    marginBottom: Metrics.s12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: ff.Medium,
    fontSize: Metrics.fs16,
    color: Colors.textPrimary,
  },
  content: {
    fontFamily: ff.Regular,
    fontSize: Metrics.fs14,
    color: Colors.textSecondary,
    marginTop: Metrics.s4,
  },
  date: {
    fontFamily: ff.Regular,
    fontSize: Metrics.fs12,
    color: Colors.textSecondary,
    marginTop: Metrics.s4,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: Metrics.s10,
  },
  iconButton: {
    marginLeft: Metrics.s12,
  },
});
