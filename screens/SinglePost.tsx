import React, {
    FC,
    useEffect,
    useLayoutEffect,
    useState,
  } from 'react';
  import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  
  import {
    NativeStackScreenProps,
  } from '@react-navigation/native-stack';
  
  import LoadingIndicator from '../components/LoadingIndicator';
  import Post from '../components/Post';
  
  import { colors, textStyles } from '../styles';
  import { getQuestionsForItem } from '../hooks/createItemHook';
  import { Question } from '../services/CreateUserService';
  
  import { PostItem } from './HomeScreen';
  
  //
  // Navigation Types
  //
  
  export type RootStackParamList = {
    SinglePost: {
      post: PostItem;
      isOffertable: boolean;
      hideActions?: boolean;
      showQuestions?: boolean;
    };
  };
  
  type Props = NativeStackScreenProps<
    RootStackParamList,
    'SinglePost'
  >;
  
  //
  // Models
  //
  
  const SinglePostScreen: FC<Props> = ({
    navigation,
    route,
  }) => {
  
    const [itemSelected, setItemSelected] =
      useState<PostItem | null>(null);
  
    const [isMessagesModalOpen, setIsMessagesModalOpen] =
      useState(false);
  
    const [isOffertable, setIsOffertable] =
      useState(false);

    const [questions, setQuestions] = useState<Question[]>([]);
    const getQuestionsMutation = getQuestionsForItem();
  
    //
    // Initial Data
    //
    useEffect(() => {
      setItemSelected(route.params.post);
      setIsOffertable(route.params.isOffertable);
    }, [route.params]);

    useEffect(() => {
      if (!route.params.showQuestions || !route.params.post?.id) {
        setQuestions([]);
        return;
      }

      getQuestionsMutation.mutateAsync(route.params.post.id)
        .then(list => setQuestions(list))
        .catch(error => {
          console.error('Error loading item questions:', error);
          setQuestions([]);
        });
    }, [route.params.post?.id, route.params.showQuestions]);
  
    //
    // Header Actions
    //
    // useLayoutEffect(() => {
    //   navigation.setOptions({
    //     headerRight: () => (
    //       <TouchableOpacity
    //         style={styles.offerButton}
    //         onPress={() => {
    //           // TODO: implement submit offer
    //           console.log('Offer clicked');
    //         }}
    //       >
    //         <Text
    //           style={[
    //             textStyles.link,
    //             { fontSize: 16 },
    //           ]}
    //         >
    //           Ofertar
    //         </Text>
    //       </TouchableOpacity>
    //     ),
    //   });
    // }, [navigation]);
  
    const handleCloseMessages = (
      numberComments: number,
    ) => {
      setIsMessagesModalOpen(false);
  
      setItemSelected(prev =>
        prev
          ? {
              ...prev,
              numberComments,
            }
          : prev,
      );
    };
  
    return (
      <ScrollView style={styles.container}>
        {/* <ChatModal
          currentUser={userSettings.settings}
          itemId={itemSelected?.id ?? ''}
          isOpen={isMessagesModalOpen}
          onClose={handleCloseMessages}
        /> */}
  
        <View style={styles.postSelectedContainer}>
          {!itemSelected ? (
            <LoadingIndicator />
          ) : (
            <>
              <Post
                post={itemSelected}
                navigation={navigation}
                isOffertable={isOffertable}
                hideActions={route.params.hideActions === true}
                token="mock-token"
                refreshToken="mock-refresh-token"
              //   openMessagesModal={() =>
              //     setIsMessagesModalOpen(true)
              //   }
              />

              {route.params.showQuestions && (
                <View style={styles.questionsSection}>
                  <Text style={styles.sectionTitle}>Preguntas</Text>

                  {getQuestionsMutation.isPending ? (
                    <LoadingIndicator />
                  ) : questions.length === 0 ? (
                    <Text style={styles.emptyQuestionsText}>
                      Aún no hay preguntas para este artículo.
                    </Text>
                  ) : (
                    questions.map((question, index) => (
                      <View
                        style={styles.questionCard}
                        key={String(question.id ?? `${question.userID}-${question.userQuestionDate}-${index}`)}
                      >
                        <Text style={styles.questionAuthor}>{question.userName}</Text>
                        <Text style={styles.questionText}>{question.userQuestion}</Text>
                        <Text style={styles.date}>{formatQuestionDate(question.userQuestionDate)}</Text>

                        {question.reply && (
                          <View style={styles.replyContainer}>
                            <Text style={styles.replyAuthor}>{question.sellerName ?? 'Vendedor'}</Text>
                            <Text style={styles.replyText}>{question.reply}</Text>
                            {question.replyDate && (
                              <Text style={styles.date}>{formatQuestionDate(question.replyDate)}</Text>
                            )}
                          </View>
                        )}
                      </View>
                    ))
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    );
  };
  
  export default SinglePostScreen;

  const formatQuestionDate = (date: string) => {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate
      .toLocaleDateString('es-BO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
      .replace(/ de /g, ' ');
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
  
    postSelectedContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: 'white',
      marginBottom: 5,
    },

    questionsSection: {
      backgroundColor: '#F5F5F5',
      padding: 16,
      paddingBottom: 32,
    },

    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#202020',
      marginBottom: 10,
    },

    emptyQuestionsText: {
      ...textStyles.pharagrah,
      color: '#777777',
    },

    questionCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
    },

    questionAuthor: { fontSize: 15, fontWeight: '700', color: '#262626' },
    questionText: { fontSize: 16, color: '#262626', marginTop: 4 },
    date: { fontSize: 12, color: '#777777', marginTop: 6 },
    replyContainer: { borderLeftWidth: 3, borderLeftColor: colors.BLUE, marginTop: 12, paddingLeft: 10 },
    replyAuthor: { fontSize: 14, fontWeight: '700', color: colors.BLUE },
    replyText: { fontSize: 16, color: '#262626', marginTop: 4 },
  
    offerButton: {
      paddingRight: 20,
    },
  });
