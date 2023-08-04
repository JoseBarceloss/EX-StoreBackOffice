import './styles/App.css';
import ListProducts from './components/ListProducts';
import RegisterProduct from './components/RegisterProduct';

function App() {
  return (
    <div className="app">
      <header>
        <button>Cadastrar</button>
        <button>Ver produtos</button>
      </header>
      <RegisterProduct />
      <ListProducts products={ [] } />
    </div>
  );
}

export default App;
