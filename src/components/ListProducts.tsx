import React from 'react';
import { ProductWithId } from '../types';
import Product from './Product';

type Props = {
  products: ProductWithId[]
  handleDelete: (() => void)
};

export default function ListProducts({ products, handleDelete }: Props) {
  return (
    <main>
      <h1>Lista de produtos</h1>
      <div className="list-container">
        {products.length === 0 && <h2>Nenhum produto cadastrado</h2>}
        {products.map((product) => (
          <Product
            key={ product.id }
            productInfo={ product }
            handleDelete={ handleDelete }
          />))}
      </div>
    </main>
  );
}
