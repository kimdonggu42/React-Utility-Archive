import { http, HttpResponse } from 'msw';
import { posts } from '@/mocks/dummyData';

export const handlers = [
  http.get('/posts', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page'));
    const size = Number(url.searchParams.get('size'));

    if (!page || !size) {
      return new HttpResponse(null, { status: 404 });
    }

    const dataStartIndex = (page - 1) * size;
    const dataEndIndex = dataStartIndex + size;
    const data = posts.slice(dataStartIndex, dataEndIndex);

    const response = {
      totalDataCount: posts.length,
      totalPageCount: Math.ceil(posts.length / size),
      data,
    };

    return HttpResponse.json(response);
  }),
];
