// apps/mobile/src/screens/TacieChatScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ChatMessage, TacieQuota } from '../types/student.types';
import { SparklesIcon, SendIcon } from '../components/Icons';

interface TacieChatScreenProps {
  messages: ChatMessage[];
  quota: TacieQuota;
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onActionClick?: (actionType: string, title: string) => void;
}

export const TacieChatScreen: React.FC<TacieChatScreenProps> = ({
  messages,
  quota,
  isLoading,
  onSendMessage,
  onActionClick,
}) => {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const quickPrompts = [
    '🎯 How do I crack Google SDE-1 OA?',
    '📄 Check my resume ATS score for Barclays',
    '⚡ Top Redis questions in campus interviews',
    '🎙️ Start a 5-min mock technical interview',
    '📊 Compare CTC breakdown: Barclays vs TCS',
  ];

  useEffect(() => {
    // Auto-scroll to bottom on new message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    // Strip leading emoji
    const cleanPrompt = prompt.replace(/^[\u{1F300}-\u{1F9FF}\s]+/u, '').trim();
    onSendMessage(cleanPrompt);
  };

  const totalCredits = quota.totalCredits ?? quota.monthlyLimit ?? 50;
  const quotaPercent = Math.round((quota.remainingCredits / totalCredits) * 100);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Top AI Quota & Context Header */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderRow}>
          <View style={styles.aiPill}>
            <SparklesIcon size={14} color="#6366F1" />
            <Text style={styles.aiPillText}>TACIE Placement Copilot</Text>
          </View>

          <View style={styles.quotaPill}>
            <Text style={styles.quotaText}>
              {quota.remainingCredits}/{totalCredits} Credits
            </Text>
          </View>
        </View>

        {/* Quota Progress Bar */}
        <View style={styles.quotaBarTrack}>
          <View style={[styles.quotaBarFill, { width: `${quotaPercent}%` }]} />
        </View>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesScroll}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user' || msg.sender === 'student';
          const content = msg.content || msg.text || '';

          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isUser ? styles.userMessageRow : styles.assistantMessageRow,
              ]}
            >
              {!isUser && (
                <View style={styles.aiAvatar}>
                  <SparklesIcon size={14} color="#FFFFFF" />
                </View>
              )}

              <View
                style={[
                  styles.bubble,
                  isUser ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    isUser ? styles.userBubbleText : styles.assistantBubbleText,
                  ]}
                >
                  {content}
                </Text>

                {/* Recommended Action Pills inside message */}
                {msg.metadata?.recommendedActions && msg.metadata.recommendedActions.length > 0 && (
                  <View style={styles.actionPillsContainer}>
                    {msg.metadata.recommendedActions.map((action: { title: string; actionType: string }, idx: number) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.actionPill}
                        onPress={() => onActionClick && onActionClick(action.actionType, action.title)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.actionPillText}>⚡ {action.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text
                  style={[
                    styles.timeText,
                    isUser ? styles.userTimeText : styles.assistantTimeText,
                  ]}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Generating Indicator */}
        {isLoading && (
          <View style={[styles.messageRow, styles.assistantMessageRow]}>
            <View style={styles.aiAvatar}>
              <SparklesIcon size={14} color="#FFFFFF" />
            </View>
            <View style={[styles.bubble, styles.assistantBubble, styles.loadingBubble]}>
              <ActivityIndicator size="small" color="#4F46E5" />
              <Text style={styles.loadingText}>TACIE is analyzing your profile...</Text>
            </View>
          </View>
        )}

        <View style={{ height: 12 }} />
      </ScrollView>

      {/* Quick Prompts Bar */}
      <View style={styles.quickPromptsBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickPromptsScroll}
        >
          {quickPrompts.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.quickPromptChip}
              onPress={() => handleQuickPrompt(p)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickPromptText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask TACIE about interviews, DSA, or resumes..."
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
          activeOpacity={0.7}
        >
          <SendIcon size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  aiPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4338CA',
  },
  quotaPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quotaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  quotaBarTrack: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  quotaBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 2,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  assistantMessageRow: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  assistantBubbleText: {
    color: '#1E293B',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: '#C7D2FE',
  },
  assistantTimeText: {
    color: '#94A3B8',
  },
  actionPillsContainer: {
    marginTop: 10,
    gap: 6,
  },
  actionPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  quickPromptsBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 8,
  },
  quickPromptsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickPromptChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickPromptText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    maxHeight: 90,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
