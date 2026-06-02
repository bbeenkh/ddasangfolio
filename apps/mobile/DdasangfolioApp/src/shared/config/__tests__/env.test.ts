/**
 * # env 환경변수 모듈 테스트
 * ---
 * - 간단설명: 환경변수 접근 모듈이 Config 값을 올바르게 노출하는지 검증
 */

import { env } from '../env';

jest.mock('react-native-config', () => ({
  API_URL: 'http://localhost:3000',
  APP_ENV: 'local',
}));

describe('env 환경변수 모듈', () => {
  it('API_URL을 반환한다', () => {
    expect(env.API_URL).toBe('http://localhost:3000');
  });

  it('APP_ENV를 반환한다', () => {
    expect(env.APP_ENV).toBe('local');
  });
});
