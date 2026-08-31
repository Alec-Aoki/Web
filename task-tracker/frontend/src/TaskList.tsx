import {useState, useEffect, type SubmitEvent} from "react";
import type {Task} from "./types";

// Esse componente precisa que o usuário esteja
// autenticado pra fazer uma requisição, então
// vai receber esse token do pai ao invés de fazer
// a requisição si mesmo
interface TaskListProps {
    token: string;
}

function TaskList({token}: TaskListProps){
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Como precisamos fazer o fetch quando o componente
    // for montar (e pra cada token), temos que usar useEffect
    useEffect(() => {
        async function fetchTasks(){
            try{
                const response = await fetch("http://localhost:3000/tasks", {
                    method: "GET",
                    headers: {Authorization: `Bearer ${token}`}
                });

                const data = await response.json();

                if(!response.ok){
                    throw new Error(data.error ?? "Falha ao carregar dados.");
                } else{
                    setTasks(data);
                }
            } catch(err){
                setError(err instanceof Error ? err.message : "Algo deu errado.");
            }
        }

        fetchTasks();
    }, [token]); // Re-roda no setup e quando o token 
    
    async function handleCreate(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        // todo objeto evento (e) carrega informação sobre o que acionou ele
        // currentTarget especificamente referencia o elemento DOM que o handler
        // do evento estava acoplado
        // e.target referencia o elemento específico dentro do form que acionou
        // o evento (tipo um botão/input + Enter)
        const form = e.currentTarget;
        
        // uncontrolled input
        // um elemento DOM <form> tem uma propriedade .elements já existente,
        // que é uma coleção de todos os controles do form dentro dele (todos
        // <input>, <select> etc.) automaticamente
        // .elements suporta pesquisar um controle específico pelo seu atributo
        // "name"
        // é por isso que escrevemos <input name="title" ... />
        // logo, forms.element.namedtem("title") acha o <input> específico cujo
        // "name" é "title" e etorna ele
        const titleInput = form.elements.namedItem("title") as HTMLInputElement;
        
        // agora que temos o elemento DOM <input> que queremos, .value é o
        // conteúdo de texto atual do elemento
        const title = titleInput.value;

        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({title})
        });

        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        titleInput.value = "";
    }

    async function handleToggle(task: Task){
        const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            } ,
            body: JSON.stringify({completed: !task.completed})
        });

        const updated = await response.json();

        if(!response.ok){
            throw new Error(updated.error ?? "Failed to update task");
        } else{
            // atualiza um item de um array de estado
            // map sobre todo item, e para o item que bater, substitui a versão atualizada
            // define como tasks o novo array retornado pelo map
            setTasks(tasks.map((t) => (t.id === task.id ? updated: t)));
        }
    }

    async function handleDelete(id: number){
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // define como tasks o array retornado pelo filter,
        // que remove a task com o id que acabamos de remover
        setTasks(tasks.filter((t) => t.id !== id));
    }

    if(error) return <p style={{color: "red"}}> {error} </p>;

    return (
        <>
        <form onSubmit={handleCreate}>
            <input name="title" placeholder="Nova tarefa" />
            <button type="submit"> Adicionar </button>
        </form>
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>
                    {task.title} - {task.completed ? "Done" : "Pending"}
                    <button onClick={() => handleToggle(task)}> Toggle </button>
                    <button onClick={() => handleDelete(task.id)}> Delete </button>
                </li>
            ))}
        </ul>
        </>
    );
}

// OBS: é usado arrow function no onClick aqui porque precisa chamar uma função
// com argumentos específicos.

export default TaskList;