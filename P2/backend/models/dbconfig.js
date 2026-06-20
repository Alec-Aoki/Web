import {Sequelize} from "sequelize";

// cria conexão com banco em memória
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
});

export default sequelize;