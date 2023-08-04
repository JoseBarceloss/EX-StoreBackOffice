import { ProductType, ProductWithId } from '../types';
import imgNotFound from '../assets/imgNotFound.png';
import '../styles/Product.css';

type Props = {
  handleDelete?: (() => void) | undefined
  productInfo: ProductWithId | ProductType
};

export default function Product({
  handleDelete = undefined,
  productInfo,
}: Props) {
  const { name, description, price, image, tags, id } = productInfo as ProductWithId;
  const tagsList = tags ? tags.split(',').map((tag) => tag.trim()) : [];

  return (
    <div data-testid="product-container" className="product-container">
      {handleDelete && <button onClick={ handleDelete }>X</button>}
      <img src={ image || imgNotFound } alt={ name } />
      <h3>{name}</h3>
      <h4>
        R$
        {' '}
        {price}
      </h4>
      <ul>
        {tagsList.map((tag) => <li key={ tag }>{tag}</li>)}
      </ul>
      <p>{description}</p>
    </div>
  );
}
