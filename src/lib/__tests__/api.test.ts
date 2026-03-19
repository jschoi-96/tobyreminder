import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ApiError } from '../api';

describe('ApiError', () => {
  it('status와 message를 가진다', () => {
    const err = new ApiError(404, 'Not Found');
    expect(err.status).toBe(404);
    expect(err.message).toBe('Not Found');
  });

  it('Error를 상속한다', () => {
    const err = new ApiError(500, 'Server Error');
    expect(err).toBeInstanceOf(Error);
  });

  it('name이 ApiError이다', () => {
    const err = new ApiError(400, 'Bad Request');
    expect(err.name).toBe('ApiError');
  });

  it('404는 isNotFound()가 true이다', () => {
    const err = new ApiError(404, 'Not Found');
    expect(err.isNotFound()).toBe(true);
  });

  it('500은 isNotFound()가 false이다', () => {
    const err = new ApiError(500, 'Server Error');
    expect(err.isNotFound()).toBe(false);
  });

  it('400은 isClientError()가 true이다', () => {
    const err = new ApiError(400, 'Bad Request');
    expect(err.isClientError()).toBe(true);
  });

  it('500은 isClientError()가 false이다', () => {
    const err = new ApiError(500, 'Server Error');
    expect(err.isClientError()).toBe(false);
  });
});

describe('request() 에러 처리', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('4xx 응답이면 ApiError를 throw한다', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => 'Not Found',
    });

    const { getReminders } = await import('../api');
    await expect(getReminders({})).rejects.toBeInstanceOf(ApiError);
  });

  it('ApiError에 status가 포함된다', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 422,
      text: async () => 'Unprocessable',
    });

    const { getReminders } = await import('../api');
    try {
      await getReminders({});
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(422);
    }
  });
});
