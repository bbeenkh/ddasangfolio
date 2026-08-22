1. POST /api/auth/signup — 400 Bad Request
  URL: http://localhost:8080/api/auth/signup
  Request Body: { "email": "testuser@example.com", "password": "test1234", "name": "테스트유저" }
  Response Body: { "success": false, "error": "Unexpected token '<', \"<!DOCTYPE \"... is not valid JSON" }

2. POST /api/auth/callback/credentials — 401 Unauthorized
  URL: http://localhost:3000/api/auth/callback/credentials
  실제 호출: NextAuth 서버사이드에서 http://localhost:8080/api/auth/login 호출
  Request Body: email=testuser@example.com&password=test1234&redirect=false&csrfToken=...&callbackUrl=http://localhost:3000/login&json=true
  Response Body: { "url": "http://localhost:3000/api/auth/error?error=CredentialsSignin&provider=credentials" }

3. GET /api/watchlist — 401 Unauthorized
  URL: http://localhost:8080/api/watchlist
  Request Body: 없음 (GET)
  Response Body: { "success": false, "error": "인증 토큰이 필요합니다" }
