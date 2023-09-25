import { useCallback, useEffect, useState } from 'react';

/**
 * @template T
 * @typedef {object} Params<T>
 * @property {number} [pageSize]
 * @property {(start: number) => Promise<T[]>} getItems
 * @property {() => Promise<number>} getTotal
 * @property {import('../EventEmitter').default} [emmiter]
 * @property {string} [eventName]
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
    emmiter,
    eventName,
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

  const loadTotal = useCallback(async () => {
    const total = await getTotal();

    setTotal(total);
  }, [getTotal]);

  const loadPage = useCallback(async () => {
    setItems([]);

    const newItems = await getItems(startItem);

    setItems(newItems);
  }, [startItem, getItems]);

  const onUpdate = useCallback(() => {
    loadTotal();
    setPage(0);
    loadPage();
  }, [loadTotal, loadPage]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  useEffect(() => {
    loadTotal();
  }, [loadTotal]);

  useEffect(() => {
    if (!eventName || !emmiter) {
      return;
    }

    emmiter.on(eventName, onUpdate);

    return () => {
      emmiter.off(eventName, onUpdate);
    };
  }, [eventName, emmiter, onUpdate]);

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
