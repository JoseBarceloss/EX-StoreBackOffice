import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { ProductType } from '../types';

const LIST_TITLE = 'Lista de produtos';
const REGISTER_TITLE = 'Cadastrar novo produto';
const PRODUCT_TEST_ID = 'product-container';
const PRODUCTS = [
  {
    name: 'Teste',
    description: 'Descrição',
    price: 10,
    image: 'any_image.jpg',
    tags: 'tag1',
  },
  {
    name: 'Teste 2',
    description: 'Descrição 2',
    price: 20,
    image: 'any_image2.jpg',
    tags: 'tag2',
  },
  {
    name: 'Teste 3',
    description: 'Descrição 3',
    price: 30,
    image: 'any_image3.jpg',
    tags: 'tag3',
  },
];

beforeEach(() => {
  render(<App />);
});

const fillRegister = ({ name, description, price, image, tags }: ProductType) => {
  const nameInput = screen.getByLabelText('Nome');
  const descriptionInput = screen.getByLabelText('Descrição');
  const priceInput = screen.getByLabelText('Preço');
  const imageInput = screen.getByLabelText('Imagem');
  const tagsInput = screen.getByLabelText('Tags');

  userEvent.type(nameInput, name);
  userEvent.type(descriptionInput, description);
  userEvent.type(priceInput, price.toString());
  userEvent.type(imageInput, image as string);
  userEvent.type(tagsInput, tags as string);
};

describe('1 - Renderize apenas um dos componentes no App por vez', () => {
  it('Será validado que o componente `RegisterProduct` é renderizado', () => {
    const button = screen.getByText('Cadastrar');
    userEvent.click(button);

    const registerProduct = screen.getByText(REGISTER_TITLE);
    expect(registerProduct).toBeInTheDocument();

    const listProducts = screen.queryByText(LIST_TITLE);
    expect(listProducts).not.toBeInTheDocument();
  });

  it('Será validado que o componente `ListProducts` é renderizado', () => {
    expect(screen.queryByText(LIST_TITLE)).not.toBeInTheDocument();

    const button = screen.getByText('Ver produtos');
    userEvent.click(button);

    const listProducts = screen.getByText(LIST_TITLE);
    expect(listProducts).toBeInTheDocument();

    const registerProduct = screen.queryByText(REGISTER_TITLE);
    expect(registerProduct).not.toBeInTheDocument();
  });
});

describe('2 - Exiba o preview das informações enquanto o usuário cadastra um novo produto', () => {
  it('Será validado que o preview do produto é renderizado com as informações corretas', () => {
    fillRegister(PRODUCTS[0]);

    const preview = screen.getByTestId(PRODUCT_TEST_ID);
    expect(preview).toHaveTextContent(PRODUCTS[0].name);
    expect(preview).toHaveTextContent(PRODUCTS[0].description);
    expect(preview).toHaveTextContent(`R$ ${PRODUCTS[0].price}`);
    expect(within(preview).getByRole('img')).toHaveAttribute('src', PRODUCTS[0].image);
    expect(preview).toHaveTextContent(PRODUCTS[0].tags);
  });
});

describe('3 - Implemente a funcionalidade de cadastrar um novo produto', () => {
  it('Será validado que ao clicar no botão "Salvar" o formulário é limpo', () => {
    fillRegister(PRODUCTS[0]);

    const button = screen.getByRole('button', { name: 'Salvar' });
    userEvent.click(button);

    const nameInput = screen.getByLabelText('Nome');
    const descriptionInput = screen.getByLabelText('Descrição');
    const priceInput = screen.getByLabelText('Preço');
    const imageInput = screen.getByLabelText('Imagem');
    const tagsInput = screen.getByLabelText('Tags');

    expect(nameInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
    expect(priceInput).toHaveValue(0);
    expect(imageInput).toHaveValue('');
    expect(tagsInput).toHaveValue('');
  });
});

describe('4 - Exiba a lista de produtos cadastrados ao clicar no botão "Ver produtos"', () => {
  beforeEach(() => {
    PRODUCTS.forEach((product) => {
      fillRegister(product);

      const button = screen.getByText('Salvar');
      userEvent.click(button);
    });

    const button = screen.getByText('Ver produtos');
    userEvent.click(button);
  });

  it('Será validado que ao clicar no botão "Ver produtos" a lista de produtos é renderizada', () => {
    expect(screen.getAllByTestId(PRODUCT_TEST_ID)).toHaveLength(PRODUCTS.length);

    PRODUCTS.forEach((product) => {
      const productInfo = screen.getByText(product.name);
      expect(productInfo).toBeInTheDocument();
    });
  });

  it('Será validado que ao clicar no botão "X" de um produto, o produto é removido da lista', () => {
    const deleteButtons = screen.getAllByRole('button', { name: 'X' });
    userEvent.click(deleteButtons[1]);

    expect(screen.getAllByTestId(PRODUCT_TEST_ID)).toHaveLength(PRODUCTS.length - 1);

    const noProductInfo = screen.queryByText(PRODUCTS[1].name);
    expect(noProductInfo).not.toBeInTheDocument();

    PRODUCTS.forEach((product, index) => {
      if (index === 1) return;
      const productInfo = screen.getByText(product.name);
      expect(productInfo).toBeInTheDocument();
    });

    userEvent.click(deleteButtons[0]);

    expect(screen.getAllByTestId(PRODUCT_TEST_ID)).toHaveLength(PRODUCTS.length - 2);

    const noProductInfo2 = screen.queryByText(PRODUCTS[0].name);
    expect(noProductInfo2).not.toBeInTheDocument();
  });
});
