import { Product } from '../types';
import { API_URL } from '../consts';

export const getAllProducts = async (): Promise<Product[]> => {
  return await fetch(`${API_URL}/products`).then((res) => res.json());
};
