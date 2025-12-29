import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { supabase } from '../supabase/supabase';
import { Layout } from '../components/layout/Layout';
import { Note, NotesItem } from '../components/ui/NotesItem';
import { AddNoteModal } from '../components/ui/AddNoteModal';
import Button from '../components/ui/Button';
import { height, Metrics } from '../theme/spacing';
import ff from '../theme/fonts';
import { Colors } from '../theme/colors';
import { ScreenComponentType } from '../@types/navigation';
import appString from '../constants/strings';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import screenName from '../constants/screens';
import { useAppDispatch } from '../store';
import { logoutUser } from '../store/slices/auth.slice';

const Notes: ScreenComponentType = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [mutationLoading, setMutationLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);

  const selectedNote = notes?.find(n => n.id === selectedNoteId);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data ?? []);
    } catch {
      ToastAndroid.show(
        'Failed to load notes. Please try again.',
        ToastAndroid.SHORT,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddOrUpdate = useCallback(
    async (title: string, content: string) => {
      try {
        setMutationLoading(true);

        if (selectedNoteId) {
          const { error } = await supabase
            .from('notes')
            .update({ title, content })
            .eq('id', selectedNoteId);

          if (error) throw error;

          setNotes(prev =>
            prev.map(n =>
              n.id === selectedNoteId ? { ...n, title, content } : n,
            ),
          );
        } else {
          const user = (await supabase.auth.getUser()).data.user;
          if (!user) throw new Error('session expired, login again');

          const { data, error } = await supabase
            .from('notes')
            .insert({ title, content, user_id: user.id })
            .select()
            .single();

          if (error) throw error;
          setNotes(prev => [data, ...prev]);
        }
      } catch (e: any) {
        console.log(e.message);

        ToastAndroid.show(
          e.message || 'Unable to save note. Please try again.',
          ToastAndroid.SHORT,
        );
        if (e.message === 'user not found') {
          logout();
        }
      } finally {
        setModalVisible(false);
        setSelectedNoteId(null);
        setMutationLoading(false);
      }
    },
    [selectedNoteId],
  );

  const handleDelete = useCallback(async () => {
    if (!selectedNoteId) return;

    try {
      setMutationLoading(true);
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', selectedNoteId);

      if (error) throw error;
      setNotes(prev => prev.filter(n => n.id !== selectedNoteId));
    } catch {
      ToastAndroid.show(
        'Failed to delete note. Try again.',
        ToastAndroid.SHORT,
      );
    } finally {
      setDeleteConfirmation(false);
      setSelectedNoteId(null);
      setMutationLoading(false);
    }
  }, [selectedNoteId]);

  const logout = useCallback(async () => {
    try {
      setMutationLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      dispatch(logoutUser());
      navigation.reset({
        index: 0,
        routes: [{ name: screenName.login }],
      });
    } catch {
      ToastAndroid.show('Logout failed. Please try again.', ToastAndroid.SHORT);
    } finally {
      setLogoutConfirmation(false);
      setMutationLoading(false);
    }
  }, [dispatch, navigation]);

  return (
    <Layout
      scrollable={false}
      showHeader
      title="Notes"
      leftNode={
        <Button
          onPress={() => setLogoutConfirmation(true)}
          style={styles.headerBtn}
          textStyle={styles.headerBtnText}
        >
          Logout
        </Button>
      }
      headerRight={
        <Button
          onPress={() => setModalVisible(true)}
          style={styles.headerBtn}
          textStyle={styles.headerBtnText}
        >
          + Add Note
        </Button>
      }
      outSideNodes={
        <>
          {deleteConfirmation && (
            <ConfirmationDialog
              visible
              title={appString.delete_confirmation}
              description={appString.delete_confirmation_description}
              isLoading={mutationLoading}
              onNegetivePress={() => setDeleteConfirmation(false)}
              onPositivePress={handleDelete}
            />
          )}

          {logoutConfirmation && (
            <ConfirmationDialog
              visible
              title={appString.logout_confirmation}
              description={appString.logout_confirmation_description}
              isLoading={mutationLoading}
              onNegetivePress={() => setLogoutConfirmation(false)}
              onPositivePress={logout}
            />
          )}
        </>
      }
    >
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <NotesItem
              note={item}
              index={index}
              onEdit={() => {
                setSelectedNoteId(item.id);
                setModalVisible(true);
              }}
              onDelete={() => {
                setSelectedNoteId(item.id);
                setDeleteConfirmation(true);
              }}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Notes Yet</Text>
              <Text style={styles.emptyDescription}>
                Tap "+ Add Note" to create your first note.
              </Text>
            </View>
          }
        />
      )}

      {modalVisible && (
        <AddNoteModal
          visible
          isLoading={mutationLoading}
          selectedNote={selectedNote}
          onClose={() => {
            setModalVisible(false);
            setSelectedNoteId(null);
          }}
          onSubmit={handleAddOrUpdate}
        />
      )}
    </Layout>
  );
};

export default Notes;

const styles = StyleSheet.create({
  headerBtn: {
    paddingVertical: Metrics.vs4,
    paddingHorizontal: Metrics.s10,
  },
  headerBtnText: {
    fontSize: Metrics.fs12,
  },

  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.s20,
    height: height * 0.8,
  },

  list: {
    paddingTop: Metrics.vs25,
    paddingHorizontal: Metrics.s20,
    paddingBottom: Metrics.vs30,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.s20,
    height: height * 0.7,
  },
  emptyTitle: {
    fontFamily: ff.Medium,
    fontSize: Metrics.fs22,
    color: Colors.textPrimary,
    marginBottom: Metrics.s8,
  },
  emptyDescription: {
    fontFamily: ff.Regular,
    fontSize: Metrics.fs14,
    color: Colors.textSecondary ?? Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Metrics.s20,
    paddingHorizontal: Metrics.s10,
  },
});
