import {useState, type SubmitEvent} from "react";

interface RegisterFormProps {
    onRegister: () => void;
}

function RegisterForm({onRegister}: RegisterFormProps){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        setError(null);

        try{
            // Manda as credenciais de registro pro back
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password})
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error ?? "Erro ao registrar.");
            } else {
                onRegister();
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
            <button type="submit"> Registrar </button>
            {error && <p style={{color: "red"}}> {error} </p>}
        </form>
    );
}

export default RegisterForm;