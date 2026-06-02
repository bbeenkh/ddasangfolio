# 환경변수 설정 설계 (react-native-config)

**날짜**: 2026-06-02
**대상 앱**: `apps/mobile/DdasangfolioApp`
**상태**: 승인됨

---

## 개요

React Native 앱에서 `local`, `dev`, `prod` 3개 환경을 지원하는 환경변수 시스템을 구성한다.
`react-native-config` 라이브러리를 사용하여 JS 및 네이티브(iOS/Android) 레이어 모두에서 환경변수에 접근할 수 있도록 한다.

---

## 파일 구조

```
DdasangfolioApp/
├── .env.local       # 로컬 개발 환경 (개인 PC)
├── .env.dev         # 개발 서버 환경
├── .env.prod        # 프로덕션 환경
└── src/
    └── shared/
        └── config/
            └── env.ts   # 환경변수 타입 정의 및 접근 모듈
```

`.env.local`, `.env.dev`, `.env.prod`는 `.gitignore`에 추가하지 않는다.
민감 정보(시크릿 키 등)가 추가될 경우에는 별도 `.env.*.local` 파일을 사용하고 gitignore 처리한다.

---

## 환경변수 파일 예시

```dotenv
# .env.local
API_URL=http://localhost:3000
APP_ENV=local

# .env.dev
API_URL=https://api.dev.ddasangfolio.com
APP_ENV=dev

# .env.prod
API_URL=https://api.ddasangfolio.com
APP_ENV=prod
```

---

## 환경 선택 방식

`APP_ENV` 환경변수를 통해 빌드/실행 시 사용할 `.env` 파일을 선택한다.

### package.json scripts

```json
{
  "scripts": {
    "android:local": "APP_ENV=local react-native run-android",
    "android:dev":   "APP_ENV=dev react-native run-android",
    "android:prod":  "APP_ENV=prod react-native run-android",
    "ios:local":     "APP_ENV=local react-native run-ios",
    "ios:dev":       "APP_ENV=dev react-native run-ios",
    "ios:prod":      "APP_ENV=prod react-native run-ios"
  }
}
```

---

## 네이티브 연동

### Android (`android/app/build.gradle`)

`react-native-config`의 `envConfigFiles`를 사용하여 `APP_ENV` 값에 따라 `.env` 파일 경로를 지정한다.

```groovy
project.ext.envConfigFiles = [
    local: ".env.local",
    dev:   ".env.dev",
    prod:  ".env.prod",
]
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

### iOS (`.xcode.env` + scheme)

`.xcode.env`에 `APP_ENV` 기본값을 설정하고, `react-native-config`의 빌드 스크립트가 해당 값을 읽어 올바른 `.env` 파일을 선택한다.

---

## TypeScript 타입 (`src/shared/config/env.ts`)

`react-native-config`는 기본적으로 `Config` 객체를 제공하며, 타입 정의를 별도로 선언하여 자동완성을 지원한다.

```typescript
// src/shared/config/env.ts
import Config from 'react-native-config';

export type EnvConfig = {
  API_URL: string;
  APP_ENV: 'local' | 'dev' | 'prod';
};

export const env = Config as EnvConfig;
```

사용 시:
```typescript
import { env } from '@shared/config/env';
console.log(env.API_URL);
```

---

## 아키텍처 결정 사항

| 항목 | 결정 | 이유 |
|------|------|------|
| 라이브러리 | `react-native-config` | RN 생태계 표준, 네이티브 레이어 접근 가능 |
| 환경 선택 | `APP_ENV` 환경변수 | 스크립트 기반으로 명시적이고 단순 |
| 타입 정의 위치 | `src/shared/config/env.ts` | FSD 패턴의 shared 레이어 준수 |
| 파일 네이밍 | `.env.local` / `.env.dev` / `.env.prod` | 환경명을 명확히 구분 |

---

## 테스트 전략

- `env.ts` 모듈 유닛 테스트: `react-native-config` mock 처리 후 각 환경값 검증
- 빌드 스크립트 검증: `android:local`, `ios:dev` 등 각 명령어 실행 확인

---

## 구현 순서

1. `react-native-config` 패키지 설치
2. `.env.local`, `.env.dev`, `.env.prod` 파일 생성
3. Android `build.gradle` 수정
4. iOS `.xcode.env` 및 빌드 스크립트 설정
5. `src/shared/config/env.ts` 작성
6. `package.json` 스크립트 추가
7. 테스트 작성 및 검증
