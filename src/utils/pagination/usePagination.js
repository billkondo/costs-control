import { useEffect, useState } from 'react';

/**
 * @template T
 * @typedef {object} Params<T>
 * @property {number} [pageSize]
 * @property {(start: number) => Promise<T[]>} getItems
 * @property {() => Promise<number>} getTotal
 */

/**
 * @template T
 * @param {Params<T>} params
 */
const usePagination = (
  params = {
    pageSize: 5,
    getItems: async () => [],
    getTotal: async () => 0,
  }
) => {
  const {
    pageSize = 5,
    getItems = async () => [],
    getTotal = async () => 0,
  } = params;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(/** @type {T[]} */ ([]));

  const maxPages = Math.ceil(total / pageSize);
  const inLastPage = page + 1 === maxPages;
  const startItem = page * pageSize;
  const endItem = inLastPage ? total : (page + 1) * pageSize;

  const onNextPage = () => setPage(page + 1);
  const onBackPage = () => setPage(page - 1);

  useEffect(() => {
    const loadItems = async () => {
      setItems([]);

      const newItems = await getItems(startItem);

      setItems(newItems);
    };

    loadItems();
  }, [startItem, getItems]);

  useEffect(() => {
    const loadTotal = async () => {
      const total = await getTotal();

      setTotal(total);
    };

    loadTotal();
  }, [getTotal]);

  return {
    page,
    onNextPage,
    onBackPage,
    items,
    startItem,
    endItem,
    inLastPage,
    total,
  };
};

export default usePagination;
