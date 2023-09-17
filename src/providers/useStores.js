import { useContext } from 'react';
import { StoresContext } from './StoresProvider';

const useStores = () => {
  return useContext(StoresContext);
};

export default useStores;
