import {useState} from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import TaskList from "./TaskList";

function App(){
  const [token, setToken] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  // se estiver logado, mostra as tasks
  if(token){
    return <TaskList token={token} />
  }

  // senão
  // se estiver mostrando o botão de registrar
  if(showRegister){
    return (
      <div>
        <RegisterForm onRegister={() => setShowRegister(false)} />
        <button onClick={() => setShowRegister(false)}>
          Já tem uma conta? Login
        </button>
      </div>
    );
  } else { // se nao tiver mostrando o de registrar, tá mostrando o de login
    return (
      <div>
        <LoginForm onLogin={setToken} />
        <button onClick={() => setShowRegister(true)}>
          Precisa de uma conta? Se registre
        </button>
      </div>
    );
  }
}

export default App;