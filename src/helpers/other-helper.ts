import { BarTask } from "../types/bar-task";
import { Task } from "../types/public-types";

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

interface TaskWithChildren extends Task {
  children: TaskWithChildren[];
}

export const sortTasks = (tasks: Task[]): Task[] => {
  const orderRecords: Record<string, TaskWithChildren> = {};
  const projectRecords: Record<string, TaskWithChildren> = {};
  const taskRecords: Task[] = [];

  tasks.forEach(task => {
    const taskWithChildren = task as TaskWithChildren;
    taskWithChildren.children = [];
    if (task.type === "order") {
      orderRecords[task.id] = taskWithChildren;
    } else if (task.type === "project") {
      projectRecords[task.id] = taskWithChildren;
    } else {
      taskRecords.push(task);
    }
  });

  // taskRecordsをstartとendでソート
  taskRecords.sort(
    (a, b) =>
      a.start.getTime() - b.start.getTime() || a.end.getTime() - b.end.getTime()
  );

  // taskRecordsをprojectRecordsのchildrenに追加
  taskRecords.forEach(task => {
    if (task.project) {
      if (projectRecords[task.project]) {
        projectRecords[task.project].children.push(task as TaskWithChildren);
      }
    } else {
      console.error("Task has no project", task);
    }
  });

  // projectRecordsをendでソート
  const sortedProjectRecords = Object.values(projectRecords).sort(
    (a, b) => a.end.getTime() - b.end.getTime()
  );

  // projectRecordsをorderRecordsのchildrenに追加
  sortedProjectRecords.forEach(project => {
    if (project.order) {
      if (orderRecords[project.order]) {
        orderRecords[project.order].children.push(project);
      }
    } else {
      console.error("Project has no order", project);
    }
  });

  // orderRecordsをendでソート
  const sortedOrder = Object.values(orderRecords).sort(
    (a, b) => a.end.getTime() - b.end.getTime()
  );

  // childrenをフラットにしてTask[]に変換
  const sortedTasks: Task[] = [];
  sortedOrder.forEach(order => {
    sortedTasks.push(order);
    order.children.forEach(project => {
      sortedTasks.push(project);
      sortedTasks.push(...project.children);
    });
  });

  return sortedTasks;
};
