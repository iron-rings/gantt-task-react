import dayjs from "dayjs";
import React from "react";
import { Task } from "../../types/public-types";
import styles from "./task-list-table.module.css";
export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  onExpanderClick,
}) => {
  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = "-";
        } else if (t.hideChildren === true) {
          expanderSymbol = "+";
        }
        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
                cursor: t.hideChildren !== undefined ? "pointer" : "default",
                fontWeight: t.hideChildren !== undefined ? "bold" : "normal",
              }}
              title={t.name}
              onClick={() => onExpanderClick(t)}
            >
              <div className={styles.taskListNameWrapper}>
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                >
                  {t.type === "order" ? "" : null}
                  {t.type === "project" ? "　　" : null}
                  {t.type === "task" ? "　　　　" : null}
                  {t.type === "task_grps" ? "　　　　" : null}
                  {t.type === "milestone" ? "　　　　" : null}
                  {"　"}
                  {expanderSymbol ? (
                    <span className={styles.expander}>{expanderSymbol}</span>
                  ) : null}
                </div>
                <div>
                  {t.type === "task" || t.type === "task_grps" ? (
                    <div
                      className={
                        t.type === "task"
                          ? styles.taskTypeDotTask
                          : styles.taskTypeDotGrp
                      }
                    >
                      ●
                    </div>
                  ) : undefined}
                  {t.name}
                </div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              {"　"}
              <div className={styles.taskListDateChip}>
                &nbsp;{dayjs(t.start).format("YY.MM.DD")}
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              {"　"}
              <div className={styles.taskListDateChip}>
                &nbsp;{dayjs(t.end).format("YY.MM.DD")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
