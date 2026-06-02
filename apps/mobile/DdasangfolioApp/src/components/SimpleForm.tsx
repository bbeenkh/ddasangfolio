import React, { useState } from 'react';
import {
  Alert,
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
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-8 text-center">정보 입력</Text>

      <Text className="text-sm font-semibold mb-1.5 text-gray-700">이름</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2.5 text-base mb-5"
        value={name}
        onChangeText={setName}
        placeholder="이름을 입력하세요"
        autoCapitalize="none"
      />

      <Text className="text-sm font-semibold mb-1.5 text-gray-700">이메일</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2.5 text-base mb-5"
        value={email}
        onChangeText={setEmail}
        placeholder="이메일을 입력하세요"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity className="bg-[#4A90E2] rounded-lg py-3.5 items-center mt-2" onPress={handleSubmit}>
        <Text className="text-white text-base font-semibold">제출</Text>
      </TouchableOpacity>
    </View>
  );
}
