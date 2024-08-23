import { http, HttpResponse } from 'msw';
import { paginationDummyData } from '@/mocks/dummyData';

export const handlers = [
  http.get('/posts', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page'));
    const parse = Number(url.searchParams.get('parse'));

    if (!page || !parse) {
      return new HttpResponse(null, { status: 404 });
    }

    const dataStartIndex = (page - 1) * parse;
    const dataEndIndex = dataStartIndex + parse;
    const data = paginationDummyData.slice(dataStartIndex, dataEndIndex);

    const response = {
      totalPageCount: Math.ceil(paginationDummyData.length / parse),
      data,
    };

    return HttpResponse.json(response);
  }),
];
