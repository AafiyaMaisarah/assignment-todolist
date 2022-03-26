import {DataTypes} from "sequelize"
import sequelize from "../db-connection.js";
const Todo = sequelize.define('todos', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            len : [5,25]
        }
    },
    description:{
        type:DataTypes.STRING,
     defaultValue:'na'
    }
   },   
    {
timestamps:false
})
export default Todo;