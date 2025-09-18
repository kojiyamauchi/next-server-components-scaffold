const buildSuffix = (url?: {
  query?: Record<string, string | number | boolean | Array<string | number | boolean>>,
  hash?: string
}) => {
  const query = url?.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const search = (() => {
    if (!query) return '';

    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) =>
          params.append(key, String(item))
        );
      } else {
        params.set(key, String(value));
      }
    });

    return `?${params.toString()}`;
  })();
  return `${search}${hash ? `#${hash}` : ''}`;
};

export const pagesPath = {
  'secondary': {
    $url: (url?: { hash?: string }) => ({ pathname: '/secondary' as const, hash: url?.hash, path: `/secondary${buildSuffix(url)}` })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '' as const, hash: url?.hash, path: `${buildSuffix(url)}` }),
  'shopping': {
    $url: (url?: { hash?: string }) => ({ pathname: '/shopping' as const, hash: url?.hash, path: `/shopping${buildSuffix(url)}` })
  },
  'users': {
    _id: (id: string | number) => ({
      $url: (url?: { hash?: string }) => ({ pathname: '/users/[id]' as const, query: { id }, hash: url?.hash, path: `/users/${id}${buildSuffix(url)}` })
    }),
    'create': {
      $url: (url?: { hash?: string }) => ({ pathname: '/users/create' as const, hash: url?.hash, path: `/users/create${buildSuffix(url)}` })
    },
    $url: (url?: { hash?: string }) => ({ pathname: '/users' as const, hash: url?.hash, path: `/users${buildSuffix(url)}` })
  }
};

export type PagesPath = typeof pagesPath;
