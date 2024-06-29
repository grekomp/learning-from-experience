import { EditableGridContext } from "$/lib/components/editable-grid/editable-grid.context";
import { type EditableGridCellData } from "$/lib/components/editable-grid/editable-grid.model";
import { cn } from "$/lib/utils/shadcnui";
import { motion } from "framer-motion";
import React, { useCallback, useContext } from "react";

export interface EditableGridCellProps {
  cell: EditableGridCellData;
  className?: string;
  children?: React.ReactNode;
}

export const EditableGridCell = React.forwardRef<
  HTMLDivElement,
  EditableGridCellProps
>(({ cell, className, children }, ref) => {
  const grid = useContext(EditableGridContext);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      grid?.events.cell.mouseEnter.emit({ cell, originalEvent: event });
    },
    [cell, grid],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      grid?.events.cell.mouseMove.emit({ cell, originalEvent: event });
    },
    [cell, grid],
  );
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      grid?.events.cell.click.emit({ cell, originalEvent: event });
    },
    [cell, grid],
  );
  const handleMouseLeave = useCallback(
    (event: React.MouseEvent) => {
      grid?.events.cell.mouseLeave.emit({ cell, originalEvent: event });
    },
    [cell, grid],
  );

  return (
    <motion.div
      ref={ref}
      layoutId={cell.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 0.8,
        zIndex: -1,
        transition: { ease: "linear", duration: 0.1 },
      }}
      transition={{
        type: "spring",
        mass: 0.5,
        damping: 20,
        stiffness: 300,
      }}
      role="cell"
      tabIndex={0}
      className={cn(
        "bg-grid-cell group relative m-[calc(var(--grid-gap)/2)] min-h-0 min-w-0 overflow-auto rounded-sm",
        className,
      )}
      style={{
        gridColumnStart: cell.bounds.col.start.name,
        gridColumnEnd: cell.bounds.col.end.name,
        gridRowStart: cell.bounds.row.start.name,
        gridRowEnd: cell.bounds.row.end.name,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      {cell.title && (
        <div className="absolute bottom-0 left-0 right-0 top-0 my-auto h-fit text-center text-5xl font-extrabold text-muted-foreground opacity-20">
          {cell.title}
        </div>
      )}
      {/* TODO: Render cell component */}
      {children}
    </motion.div>
  );
});

EditableGridCell.displayName = "EditableGridCell";
