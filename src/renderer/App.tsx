import './App.css';
import IdForm from './components/idForm';
import Header from './components/header';

function App() {
  return (
    <div className="App-glutoes-extension" style={{ width: "300px" }}>
      <Header  />
      <div className="extBody">
        <IdForm/>
      </div>
    </div>
  );
}

export default App;
