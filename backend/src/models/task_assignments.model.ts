import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export type TaskAssignmentStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETED";

export interface TaskAssignmentAttributes {
  id: string;
  task_id: string;
  student_id: string;
  trainer_id: string;
  status: TaskAssignmentStatus;
  assigned_at?: Date;
}

export interface TaskAssignmentCreationAttributes
  extends Optional<TaskAssignmentAttributes, "id" | "assigned_at"> {}

export interface TaskAssignmentInstance
  extends Model<
      TaskAssignmentAttributes,
      TaskAssignmentCreationAttributes
    >,
    TaskAssignmentAttributes {}

export const TaskAssignment = sequelize.define<
  TaskAssignmentInstance,
  TaskAssignmentAttributes
>(
  "TaskAssignment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    trainer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "ASSIGNED",
        "IN_PROGRESS",
        "SUBMITTED",
        "COMPLETED"
      ),
      allowNull: false,
      defaultValue: "ASSIGNED",
    },

    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "task_assignments",
    timestamps: false,
  }
);