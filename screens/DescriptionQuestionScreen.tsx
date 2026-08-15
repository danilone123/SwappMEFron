import React, { useLayoutEffect, useMemo, useState, useEffect } from 'react';
import {
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import ProductRow from '../components/ProductRow';
import { colors, textStyles } from '../styles';
import { itemTypes } from '../utils/constants';
import { RootStackParamList } from './DescriptionScreen';
import { createQuestionForItem, getQuestionsForItem } from '../hooks/createItemHook';
import { Question } from '../services/CreateUserService'




// Temporary response for GET /item/questions. Replace this with the API call
// when the endpoint is available.
// const mockedQuestions: Question[] = [
//   {
//     userName: 'daniel',
//     userID: 12,
//     userQuestion: '¿Probando el test?',
//     userQuestionDate: '2025-06-03',
//     sellerName: 'seller name',
//     reply: 'Así es, tienes razón.',
//     replyDate: '2025-06-04',
//   },
//   {
//     userName: 'maría',
//     userID: 18,
//     userQuestion: '¿Todavía está disponible?',
//     userQuestionDate: '2025-06-05',
//     sellerName: null,
//     reply: null,
//     replyDate: null,
//   },
// ];

type Props = NativeStackScreenProps<
  RootStackParamList,
  'DescriptionQuestion'
>;

const EMPTY_IMAGE =
  'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';

const getImageSource = (images: any) => {
  if (!images) return { uri: EMPTY_IMAGE };
  if (typeof images === 'number') return images;
  if (typeof images === 'string') return { uri: images };
  if (typeof images === 'object' && images.uri) return { uri: images.uri };

  if (typeof images === 'object') {
    const firstImage = images[Object.keys(images)[0]];
    if (typeof firstImage === 'string') return { uri: firstImage };
    if (firstImage) return firstImage;
  }

  return { uri: EMPTY_IMAGE };
};

export default function DescriptionQuestionScreen({ route, navigation }: Props) {
  const post = route.params.post;
  const [questions, setQuestions] = useState<Question[]>([]);//useState<PostItem[]>([]);
  const [questionText, setQuestionText] = useState('');
  const createQuestionMutation = createQuestionForItem();
  const getQuestionsMutation = getQuestionsForItem()
  const imageSource = useMemo(() => getImageSource(post.images), [post.images]);

  const fetchQuestions = async () => {
    try {
      const listOfQuestions = await getQuestionsMutation.mutateAsync(post.id)
      console.log("listOfquestions first date", listOfQuestions[0].userQuestionDate);
      setQuestions(listOfQuestions)

    } catch (error) {
      console.error('Error creating item question:', error);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('OfferParamItem', { post })}
          style={styles.offerButton}
        >
          <Text style={styles.offerButtonText}>Ofertar</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, post]);

  const sendQuestion = async () => {
    const trimmedQuestion = questionText.trim();
    if (!trimmedQuestion || createQuestionMutation.isPending) return;

    try {
      const response = await createQuestionMutation.mutateAsync({
        itemId: post.id,
        questionText: {questionText: trimmedQuestion},
      });
      console.log('Question created successfully:', response);

      setQuestions(currentQuestions => [
        ...currentQuestions,
        {
          userName: 'Tú',
          userID: 0,
          userQuestion: trimmedQuestion,
          userQuestionDate: new Date().toISOString().slice(0, 10),
          sellerName: null,
          reply: null,
          replyDate: null,
          itemDescription: post.description,
        },
      ]);
      setQuestionText('');
    } catch (error) {
      console.error('Error creating item question:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.postCard}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />

          {post.type === 'offers' && (
            <View style={styles.productRows}>
              <ProductRow
                icon={itemTypes.OFFERS_ICON}
                type={itemTypes.OFFERS_TAG}
                title={post.offer ?? ''}
                color={itemTypes.OFFERS_COLOR}
              />
              <ProductRow
                icon={itemTypes.SEARCHING_ICON}
                type={itemTypes.SEARCHING_TAG}
                title={post.search ?? ''}
                color={itemTypes.SEARCHING_COLOR}
              />
            </View>
          )}

          {post.type === 'donation' && (
            <View style={styles.productRows}>
              <ProductRow
                icon={itemTypes.DONATION_ICON}
                type={itemTypes.DONATION_TAG}
                title={post.offer ?? ''}
                color={itemTypes.DONATION_COLOR}
              />
            </View>
          )}

          <Text style={styles.description}>{post.description}</Text>
        </View>

        <Text style={styles.sectionTitle}>Preguntas</Text>

        {questions.map((question, index) => (
          <View style={styles.questionCard} key={`${question.userID}-${question.userQuestionDate}-${index}`}>
            <Text style={styles.questionAuthor}>{question.userName}</Text>
            <Text style={styles.questionText}>{question.userQuestion}</Text>
            <Text style={styles.date}>
              {new Date(question.userQuestionDate)
                       .toLocaleDateString('es-BO', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        })
                        .replace(/ de /g, ' ')}</Text>
            

            {question.reply && (
              <View style={styles.replyContainer}>
                <Text style={styles.replyAuthor}>{question.sellerName ?? 'Vendedor'}</Text>
                <Text style={styles.replyText}>{question.reply}</Text>
                {question.replyDate && <Text style={styles.date}>
                {new Date(question.replyDate)
                       .toLocaleDateString('es-BO', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        })
                        .replace(/ de /g, ' ')}
                  </Text>}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.questionInputContainer}>
        <TextInput
          value={questionText}
          onChangeText={setQuestionText}
          placeholder="pregunta lo que necesites saber!"
          placeholderTextColor="#8A8A8A"
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, createQuestionMutation.isPending && styles.sendButtonDisabled]}
          onPress={sendQuestion}
          disabled={createQuestionMutation.isPending}
        >
          {createQuestionMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Feather name="send" size={16} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Enviar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 24 },
  postCard: { backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: 260, backgroundColor: '#E6E6E6' },
  productRows: { paddingHorizontal: 12, paddingTop: 8 },
  description: { ...textStyles.pharagrah, color: colors.BLACK_LIGHT, padding: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#202020', marginTop: 24, marginBottom: 10 },
  questionCard: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 10 },
  questionAuthor: { fontSize: 15, fontWeight: '700', color: '#262626' },
  questionText: { fontSize: 16, color: '#262626', marginTop: 4 },
  date: { fontSize: 12, color: '#777777', marginTop: 6 },
  replyContainer: { borderLeftWidth: 3, borderLeftColor: colors.BLUE, marginTop: 12, paddingLeft: 10 },
  replyAuthor: { fontSize: 14, fontWeight: '700', color: colors.BLUE },
  replyText: { fontSize: 16, color: '#262626', marginTop: 4 },
  questionInputContainer: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5E5', padding: 10 },
  input: { flex: 1, minHeight: 42, maxHeight: 100, borderWidth: 1, borderColor: '#D5D5D5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, color: '#262626' },
  sendButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center', backgroundColor: colors.BLUE, borderRadius: 8, marginLeft: 8, paddingHorizontal: 12, gap: 5 },
  sendButtonText: { color: '#FFFFFF', fontWeight: '700' },
  sendButtonDisabled: { opacity: 0.7 },
  offerButton: { paddingHorizontal: 8, paddingVertical: 6 },
  offerButtonText: { ...textStyles.link, fontSize: 16 },
});
