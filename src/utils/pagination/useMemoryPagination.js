import { useCallback, useMemo } from 'react';
import usePagination from './usePagination';

/**
 * @template T
 * @typedef {object} Params<T>
 * @property {T[]} items
 * @property {number} [pageSize]
 */

/**
 * @template T
 * @param {Params<T>} params
 */
const useMemoryPagination = (params) => {
  const { items, pageSize = 5 } = params;
  const total = items.length;

  const pages = useMemo(() => {
    /** @type {{ [start: number]: T[]}} */
    const pages = {};

    const totalPages = Math.ceil(total / pageSize);

    for (let i = 0; i < totalPages; i++) {
      /** @type {T[]} */
      const itemsInPage = [];
      const startAt = i * pageSize;
      const endBefore = Math.min((i + 1) * pageSize, items.length);

      for (let j = startAt; j < endBefore; j++) {
        itemsInPage.push(items[j]);
      }

      pages[startAt] = itemsInPage;
    }

    return pages;
  }, [items, pageSize, total]);

  const getItems = useCallback(
    /**
     * @param {number} starItem
     */
    async (starItem) => {
      return pages[starItem] ?? [];
    },
    [pages]
  );

  return usePagination({
    total,
    pageSize,
    getItems,
  });
};

export default useMemoryPagination;
