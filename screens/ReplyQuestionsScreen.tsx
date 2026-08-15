import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../styles';
import {
  getPendingItemQuestions,
  Question,
  replyToQuestion,
} from '../services/CreateUserService';

type QuestionWithDraft = Question & { draftReply: string };

export default function ReplyQuestionsScreen() {
  const [questions, setQuestions] = useState<QuestionWithDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const pendingQuestions = await getPendingItemQuestions();
        setQuestions(
          pendingQuestions.map(question => ({
            ...question,
            draftReply: question.reply ?? '',
          })),
        );
      } catch (error) {
        console.error('Unable to load pending questions:', error);
        Alert.alert('Error', 'No se pudieron cargar las preguntas pendientes.');
      } finally {
        setIsLoading(false);
      }
    };

    // This endpoint is intentionally called once when this screen is mounted.
    loadQuestions();
  }, []);

  const updateDraft = (questionId: string | number, draftReply: string) => {
    setQuestions(current =>
      current.map(question =>
        question.id === questionId ? { ...question, draftReply } : question,
      ),
    );
  };

  const reply = async (question: QuestionWithDraft) => {
    const replyText = question.draftReply.trim();
    if (!replyText) {
      Alert.alert('Respuesta requerida', 'Escribe una respuesta antes de continuar.');
      return;
    }

    if (question.id === undefined || question.id === null) {
      Alert.alert('Error', 'No se encontró el identificador de esta pregunta.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await replyToQuestion(question.id, replyText);
      setQuestions(current =>
        current.map(currentQuestion =>
          currentQuestion.id === question.id
            ? {
                ...currentQuestion,
                reply: response.reply ?? replyText,
                replyDate: response.replyDate ?? new Date().toISOString(),
                sellerName: response.sellerName ?? currentQuestion.sellerName,
                draftReply: '',
              }
            : currentQuestion,
        ),
      );
    } catch (error) {
      console.error('Unable to reply to question:', error);
      Alert.alert('Error', 'No se pudo enviar la respuesta. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {questions.length === 0 && !isLoading ? (
          <Text style={styles.emptyText}>No tienes preguntas pendientes.</Text>
        ) : (
          questions.map(question => (
            <View
              key={String(question.id ?? `${question.userID}-${question.userQuestionDate}-${question.userQuestion}`)}
              style={styles.card}
            >
              <Text style={styles.itemDescription}>{question.itemDescription ?? 'Artículo sin descripción'}</Text>
              <Text style={styles.userName}>{question.userName}</Text>
              <Text style={styles.userQuestion}>{question.userQuestion}</Text>

              {question.reply ? <Text style={styles.replyText}>{question.reply}</Text> : null}

              <View style={styles.replyRow}>
                <TextInput
                  value={question.draftReply}
                  onChangeText={text =>
                    question.id !== undefined && updateDraft(question.id, text)
                  }
                  placeholder="Escribe tu respuesta"
                  placeholderTextColor="#8A8A8A"
                  multiline
                  style={styles.input}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => reply(question)}
                  style={styles.replyButton}
                  disabled={isLoading}
                >
                  <Text style={styles.replyButtonText}>Responder</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {isLoading ? (
        <View style={styles.loadingOverlay} accessibilityLabel="Cargando">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 12 },
  itemDescription: { color: '#262626', fontSize: 17, fontWeight: '700' },
  userName: { color: '#6B6B6B', fontSize: 14, marginTop: 4 },
  userQuestion: { color: '#262626', fontSize: 16, marginTop: 14 },
  replyText: { borderLeftColor: colors.BLUE, borderLeftWidth: 3, color: colors.BLUE, fontSize: 16, marginTop: 12, paddingLeft: 10 },
  replyRow: { alignItems: 'flex-end', flexDirection: 'row', marginTop: 12 },
  input: { borderColor: '#D5D5D5', borderRadius: 8, borderWidth: 1, color: '#262626', flex: 1, maxHeight: 100, minHeight: 42, paddingHorizontal: 10, paddingVertical: 8 },
  replyButton: { alignSelf: 'stretch', backgroundColor: colors.BLUE, borderRadius: 8, justifyContent: 'center', marginLeft: 8, paddingHorizontal: 10 },
  replyButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  emptyText: { color: '#6B6B6B', fontSize: 16, textAlign: 'center', marginTop: 32 },
  loadingOverlay: { alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.45)', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0 },
});
