import { describe, it, expect } from 'vitest'
import { HttpError } from './http-error'

describe('HttpError', () => {
  it('상태코드와 메시지를 포함한 에러를 생성한다', () => {
    const error = new HttpError(400, '잘못된 요청입니다')

    expect(error).toBeInstanceOf(Error)
    expect(error.statusCode).toBe(400)
    expect(error.message).toBe('잘못된 요청입니다')
  })

  it('Error를 상속한다', () => {
    const error = new HttpError(404, '찾을 수 없습니다')

    expect(error).toBeInstanceOf(HttpError)
    expect(error).toBeInstanceOf(Error)
  })
})
