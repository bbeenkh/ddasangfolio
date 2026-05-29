import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * # SimpleForm
 * ---
 * - 간단설명: 빌드 테스트용 간단한 입력 폼 컴포넌트
 * - 제약사항 및 특이사항:
 *   - 이름, 이메일 필드 필수 입력 검증
 *   - 제출 시 Alert으로 결과 표시
 * ---
 * @example
 * <SimpleForm />
 */
export function SimpleForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('오류', '이름과 이메일을 모두 입력해주세요.');
      return;
    }
    Alert.alert('제출 완료', `이름: ${name}\n이메일: ${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>정보 입력</Text>

      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="이름을 입력하세요"
        autoCapitalize="none"
      />

      <Text style={styles.label}>이메일</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="이메일을 입력하세요"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>제출</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
