import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    trainer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    reference_file_url: {
      type: DataTypes.TEXT,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tasks",  
    timestamps: true,    
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);