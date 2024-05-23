import React from "react";
import { TaskItemProps } from "../task-item";
import styles from "./order.module.css";

export const Order: React.FC<TaskItemProps> = ({ task, isSelected }) => {
  const barColor = isSelected
    ? task.styles.backgroundSelectedColor
    : task.styles.backgroundColor;
  const processColor = isSelected
    ? task.styles.progressSelectedColor
    : task.styles.progressSelectedColor;
  const orderWidth = task.x2 - task.x1;

  return (
    <g tabIndex={0} className={styles.projectWrapper}>
      <rect
        fill={barColor}
        x={task.x1}
        width={orderWidth}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        className={styles.projectBackground}
      />
      <rect
        x={task.progressX}
        width={task.progressWidth}
        y={task.y}
        height={task.height}
        ry={task.barCornerRadius}
        rx={task.barCornerRadius}
        fill={processColor}
      />
    </g>
  );
};
