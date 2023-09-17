import { useEffect, useState } from 'react';

/**
 * @template T
 * @typedef {object} Params<T>
 * @property {number} [pageSize]
 * @property {number} total
 * @property {(start: number) => Promise<T[]>} getItems
 */

/**
 * @template T
 * @param {Params<T>} params
 */
const useTable = (
  params = {
    pageSize: 5,
    getItems: async () => [],
    total: 0,
  }
) => {
  const { pageSize = 5, getItems = async () => [], total = 0 } = params;
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(/** @type {T[]} */ ([]));

  const maxPages = Math.ceil(total / pageSize);
  const inLastPage = page + 1 === maxPages;
  const startItem = page * pageSize;
  const endItem = inLastPage ? total : (page + 1) * pageSize;

  const onNextPage = () => setPage(page + 1);
  const onBackPage = () => setPage(page - 1);

  useEffect(() => {
    const load = async () => {
      setItems([]);

      const newItems = await getItems(startItem);

      setItems(newItems);
    };

    load();
  }, [startItem, getItems]);

  return {
    page,
    onNextPage,
    onBackPage,
    items,
    startItem,
    endItem,
    inLastPage,
  };
};

export default useTable;
