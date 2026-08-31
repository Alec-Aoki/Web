export interface Task {
    id: number;
    title: string;
    completed: boolean;
    // a conversão do completed de 0/1
    // pra booleano já tá rolando no back
    userId: number;
}