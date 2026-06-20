import {Model, DataTypes} from 'sequelize';
import sequelize from './dbconfig.js';

class Pocao extends Model{};

Pocao.init(
    {
        slugNome: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT
        },
        imagem: {
            type: DataTypes.TEXT
        },
        preco: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: sequelize,
        timestamps: false
    }
);

export default Pocao;