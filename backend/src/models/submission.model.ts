import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export type SubmissionStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REVIEWED"
  | "RESUBMIT_REQUIRED";

export interface SubmissionAttributes {
  id: string;
  assignment_id: string;
  file_url: string;
  status: SubmissionStatus;
  submitted_at?: Date;
  marks?: number | null;
  remarks?: string | null;
  reviewed_at?: Date | null;
  reviewed_by?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface SubmissionCreationAttributes
  extends Optional<
    SubmissionAttributes,
    | "id"
    | "submitted_at"
    | "marks"
    | "remarks"
    | "reviewed_at"
    | "reviewed_by"
    | "created_at"
    | "updated_at"
  > {}

export interface SubmissionInstance
  extends Model<SubmissionAttributes, SubmissionCreationAttributes>,
    SubmissionAttributes {}

export const Submission = sequelize.define<
  SubmissionInstance,
  SubmissionAttributes
>(
  "Submission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    assignment_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    file_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "SUBMITTED",
        "UNDER_REVIEW",
        "REVIEWED",
        "RESUBMIT_REQUIRED"
      ),
      allowNull: false,
      defaultValue: "SUBMITTED",
    },

    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    reviewed_by: {
      type: DataTypes.UUID,
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
    tableName: "submissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);