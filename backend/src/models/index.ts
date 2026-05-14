import { User } from "./user.model";
import { Task } from "./task.model";
import { TaskAssignment } from "./task_assignments.model";
import { Submission } from "./submission.model";


// One trainer can create many tasks
User.hasMany(Task, {
  foreignKey: "trainer_id",
  as: "createdTasks",
});

// Each task belongs to one trainer
Task.belongsTo(User, {
  foreignKey: "trainer_id",
  as: "trainer",
});




// One task can have many assignments
Task.hasMany(TaskAssignment, {
  foreignKey: "task_id",
  as: "assignments",
});

// Each assignment belongs to one task
TaskAssignment.belongsTo(Task, {
  foreignKey: "task_id",
  as: "task",
});



// One student can have many assignments
User.hasMany(TaskAssignment, {
  foreignKey: "student_id",
  as: "studentAssignments",
});

// Each assignment belongs to one student
TaskAssignment.belongsTo(User, {
  foreignKey: "student_id",
  as: "student",
});


// One trainer can assign many tasks
User.hasMany(TaskAssignment, {
  foreignKey: "trainer_id",
  as: "trainerAssignments",
});

// Each assignment belongs to one trainer
TaskAssignment.belongsTo(User, {
  foreignKey: "trainer_id",
  as: "trainer",
});


// One assignment can have many submissions
TaskAssignment.hasMany(Submission, {
  foreignKey: "assignment_id",
  as: "submissions",
});

// Each submission belongs to one assignment
Submission.belongsTo(TaskAssignment, {
  foreignKey: "assignment_id",
  as: "assignment",
});


// One trainer can review many submissions
User.hasMany(Submission, {
  foreignKey: "reviewed_by",
  as: "reviewedSubmissions",
});

// Each submission reviewed by one trainer
Submission.belongsTo(User, {
  foreignKey: "reviewed_by",
  as: "reviewer",
});



export {
  User,
  Task,
  TaskAssignment,
  Submission,
};