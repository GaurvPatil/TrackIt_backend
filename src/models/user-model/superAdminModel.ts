import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database-connection/databaseConnection";

export default class SuperAdmin extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public createdByRole!: string;
  public createdById!: number;
  public firstName!: string;
  public lastName!: string;
}

SuperAdmin.init(
  {
    id: {
      type: DataTypes.UUID, // Use PostgreSQL's UUID type
      defaultValue: DataTypes.UUIDV4, // Sequelize generates UUID v4
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
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
    createdByRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdById: {
      type: DataTypes.UUID, // Use PostgreSQL's UUID type
      allowNull: false,
    },
    updatedByRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedById: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "SuperAdmin",
    tableName: "superadmin",
    timestamps: true,
  }
);
