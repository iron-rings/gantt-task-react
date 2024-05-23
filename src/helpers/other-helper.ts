import { BarTask } from "../types/bar-task";
import { Task, TaskType } from "../types/public-types";

export function isKeyboardEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.KeyboardEvent {
  return (event as React.KeyboardEvent).key !== undefined;
}

export function isMouseEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.MouseEvent {
  return (event as React.MouseEvent).clientX !== undefined;
}

export function isBarTask(task: Task | BarTask): task is BarTask {
  return (task as BarTask).x1 !== undefined;
}

export function removeHiddenTasks(tasks: Task[]) {
  const groupedTasks = tasks.filter(
    t => t.hideChildren && (t.type === "project" || t.type === "order")
  );
  console.log("g", groupedTasks);
  if (groupedTasks.length > 0) {
    for (let i = 0; groupedTasks.length > i; i++) {
      const groupedTask = groupedTasks[i];
      const children = getChildren(tasks, groupedTask);
      tasks = tasks.filter(t => children.indexOf(t) === -1);
    }
  }
  return tasks;
}

function getChildren(taskList: Task[], task: Task): Task[] {
  let tasks: Task[] = [];

  // 依存関係に基づくタスクの取得
  tasks = taskList.filter(
    t => t.dependencies && t.dependencies.indexOf(task.id) !== -1
  );

  // プロジェクトに紐づくタスクの取得
  if (task.type === "project") {
    const projectTasks = taskList.filter(
      t => t.project && t.project === task.id
    );
    tasks.push(...projectTasks);
  }

  // Orderに紐づくプロジェクトとそのタスクの取得
  if (task.type === "order") {
    const orderProjects = taskList.filter(t => t.order && t.order === task.id);
    tasks.push(...orderProjects);
    orderProjects.forEach(project => {
      const projectTasks = taskList.filter(
        t => t.project && t.project === project.id
      );
      tasks.push(...projectTasks);
    });
  }

  var taskChildren: Task[] = [];
  tasks.forEach(t => {
    taskChildren.push(...getChildren(taskList, t));
  });

  tasks = tasks.concat(taskChildren);

  console.log(tasks); // デバッグ用にタスクリストを表示
  return tasks;
}
const typeOrder: { [key in TaskType]: number } = {
  order: 1,
  project: 2,
  task: 3,
  task_grps: 3,
  milestone: 4,
};

export const sortTasks = (taskA: Task, taskB: Task) => {
  const typeOrderA = typeOrder[taskA.type];
  const typeOrderB = typeOrder[taskB.type];

  if (typeOrderA !== typeOrderB) {
    return typeOrderA - typeOrderB;
  }

  const orderA = taskA.displayOrder ?? Number.MAX_VALUE;
  const orderB = taskB.displayOrder ?? Number.MAX_VALUE;

  return orderA - orderB;
};
