import React, { useEffect, useRef, useState } from "react";
import { Calendar, CalendarProps } from "../calendar/calendar";
import { Grid, GridProps } from "../grid/grid";
import styles from "./gantt.module.css";
import { TaskGanttContent, TaskGanttContentProps } from "./task-gantt-content";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
  setXScroll: (scroll: number) => void;
  setYScroll: (scroll: number) => void;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
  setXScroll,
  setYScroll,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const onDragStart = (e: any) => {
      setIsDragging(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
      e.preventDefault(); // ドラッグ中のテキスト選択を防止
    };

    const onDragMove = (e: any) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // 新しいスクロール位置を計算
      const newScrollX = scrollX + dx;
      const newScrollY = scrollY + dy;

      // スクロール位置を更新
      setXScroll(newScrollX);
      setYScroll(newScrollY);

      // ドラッグの基準点を更新
      setStartX(e.clientX);
      setStartY(e.clientY);
    };

    const onDragEnd = () => {
      setIsDragging(false);
    };

    // イベントリスナーを設定
    window.addEventListener("mousedown", onDragStart);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);

    // イベントリスナーのクリーンアップ
    return () => {
      window.removeEventListener("mousedown", onDragStart);
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
    };
  }, [isDragging, startX, startY, scrollX, scrollY, setXScroll, setYScroll]);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
      dir="ltr"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={barProps.rowHeight * barProps.tasks.length}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
          <TaskGanttContent {...newBarProps} />
        </svg>
      </div>
    </div>
  );
};
