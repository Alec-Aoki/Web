import {useState, type SubmitEvent} from "react";

interface LoginFormProps {
    // O prop chamado onLogin vai ser uma função
    // que vai receber uma string e retornar um void
    onLogin: (token:string) => void;
}

function LoginForm({onLogin}: LoginFormProps){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // error pode conter um erro ou nada, por isso
    // string ou null
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        setError(null); // Limpando erros prévios

        try{
            // Manda as credenciais de login pro back (rota /auth/login c/ POST)
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password})
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error ?? "Erro no login.");
            } else {
                // Não sabemos o que onLogin faz, só damos o token pra ele
                // e ele passa o token pro componente pai
                onLogin(data.token);
            }
        } catch(err){
            setError(err instanceof Error ? err.message : "Algo deu errado.");
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
            />
            <button type="submit"> Login </button>
            {error && <p style={{color: "red"}}> {error} </p>}
        </form>
    );
}

export default LoginForm;