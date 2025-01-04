import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: parseInt(process.env.DB_PORT as string, 10), // Convert port to number
    logging: false,
  }
);


const connectDB = async()=>{
    try{
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        
    }catch(err){
        console.error("Unable to connect to the database:", err);
        process.exit(1); // Failure
    }
}

export {sequelize , connectDB};