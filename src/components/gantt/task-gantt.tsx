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
  maxWidth: number;
  maxHeight: number;
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
  maxWidth,
  maxHeight,
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

      // スクロール位置が最大値を超えないようにする
      const x = Math.max(0, Math.min(maxWidth, newScrollX));
      const y = Math.max(0, Math.min(maxHeight, newScrollY));

      console.log(x, maxWidth, newScrollX);
      // スクロール位置を更新
      setXScroll(x);
      setYScroll(y);

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
  }, [
    isDragging,
    maxHeight,
    maxWidth,
    scrollX,
    scrollY,
    setXScroll,
    setYScroll,
    startX,
    startY,
  ]);

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
