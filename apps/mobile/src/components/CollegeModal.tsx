// apps/mobile/src/components/CollegeModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { PROTOTYPE_COLLEGES } from '../services/mockData';
import { CloseIcon, CheckIcon } from './Icons';

interface CollegeModalProps {
  visible: boolean;
  currentCode: string;
  apiUrl: string;
  onClose: () => void;
  onSelectCollege: (code: string) => void;
  onSaveApiUrl: (url: string) => void;
}

export const CollegeModal: React.FC<CollegeModalProps> = ({
  visible,
  currentCode,
  apiUrl,
  onClose,
  onSelectCollege,
  onSaveApiUrl,
}) => {
  const [customCode, setCustomCode] = useState('');
  const [customApiUrl, setCustomApiUrl] = useState(apiUrl);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleApplyCustom = () => {
    if (customCode.trim().length >= 4) {
      onSelectCollege(customCode.trim());
      setCustomCode('');
      onClose();
    }
  };

  const handleSaveUrl = () => {
    onSaveApiUrl(customApiUrl);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Select College Campus</Text>
              <Text style={styles.subtitle}>Connects to your institution's isolated database</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <CloseIcon size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* College Cards */}
            <Text style={styles.sectionTitle}>Registered Partner Campuses</Text>
            {PROTOTYPE_COLLEGES.map((c) => {
              const isSelected = currentCode === c.code;
              return (
                <TouchableOpacity
                  key={c.code}
                  style={[styles.collegeCard, isSelected && styles.selectedCollegeCard]}
                  onPress={() => {
                    onSelectCollege(c.code);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardLeft}>
                    <View style={[styles.codeBadge, isSelected && styles.selectedCodeBadge]}>
                      <Text style={[styles.codeText, isSelected && styles.selectedCodeText]}>{c.code}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.collegeName}>{c.name}</Text>
                      <Text style={styles.collegeMeta}>
                        {c.city} &bull; DB: careeros_{c.shortName.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                      </Text>
                    </View>
                  </View>
                  {isSelected && <CheckIcon size={20} color="#4F46E5" />}
                </TouchableOpacity>
              );
            })}

            {/* Custom Code Input */}
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Or Enter 4-Digit College Code</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 4821"
                placeholderTextColor="#9CA3AF"
                value={customCode}
                onChangeText={setCustomCode}
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.connectBtn, customCode.trim().length < 4 && styles.disabledBtn]}
                onPress={handleApplyCustom}
                disabled={customCode.trim().length < 4}
              >
                <Text style={styles.connectBtnText}>Connect</Text>
              </TouchableOpacity>
            </View>

            {/* Advanced Settings Toggle */}
            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced(!showAdvanced)}
            >
              <Text style={styles.advancedToggleText}>
                {showAdvanced ? '▴ Hide Backend Settings' : '▾ Backend API Endpoint Settings'}
              </Text>
            </TouchableOpacity>

            {showAdvanced && (
              <View style={styles.advancedSection}>
                <Text style={styles.label}>Node.js API URL</Text>
                <TextInput
                  style={styles.apiInput}
                  value={customApiUrl}
                  onChangeText={setCustomApiUrl}
                  placeholder="http://localhost:5000/api"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.saveUrlBtn} onPress={handleSaveUrl}>
                  <Text style={styles.saveUrlBtnText}>Save API Endpoint</Text>
                </TouchableOpacity>
                <Text style={styles.helperText}>
                  Android Emulator: http://10.0.2.2:5000/api{'\n'}
                  Web / iOS Simulator: http://localhost:5000/api
                </Text>
              </View>
            )}

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  collegeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  selectedCollegeCard: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  codeBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  selectedCodeBadge: {
    backgroundColor: '#4F46E5',
  },
  codeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
  selectedCodeText: {
    color: '#FFFFFF',
  },
  cardInfo: {
    flex: 1,
  },
  collegeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  collegeMeta: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  textInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  connectBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#9CA3AF',
  },
  connectBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  advancedToggle: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  advancedToggleText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  advancedSection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 4,
  },
  apiInput: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#111827',
    marginBottom: 8,
  },
  saveUrlBtn: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  saveUrlBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 14,
  },
});
