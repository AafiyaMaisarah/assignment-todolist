// const {Sequelize} = require ('sequelize')
import {Sequelize} from "sequelize"
const sequelize = new Sequelize("access","root","root",{
    host :"localhost",
    dialect:"mysql",
    port:3306
});
export default sequelize;