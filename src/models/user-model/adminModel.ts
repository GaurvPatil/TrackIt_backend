import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database-connection/databaseConnection";

export default class Admin extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public department_id!: number;
  public createdByRole!: string;
  public createdById!: number;
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdByRole: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "admin",
    timestamps: true,
  }
);
