import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/posts', () => {
    return HttpResponse.json(['테스트1, 테스트2'], { status: 200 });
  }),
];
