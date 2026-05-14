import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface TaskAttributes {
  id: string;
  title: string;
  description?: string | null;
  deadline: Date;
  trainer_id: string;
  reference_file_url?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface TaskCreationAttributes
  extends Optional<
    TaskAttributes,
    "id" | "description" | "reference_file_url" | "created_at" | "updated_at"
  > {}

export interface TaskInstance
  extends Model<TaskAttributes, TaskCreationAttributes>,
    TaskAttributes {}

export const Task = sequelize.define<TaskInstance, TaskAttributes>(
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
      allowNull: true,
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
      allowNull: true,
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