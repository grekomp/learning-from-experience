import GripDownLeft from "$/lib/assets/icons/grip-down-left.svg";
import GripDownRight from "$/lib/assets/icons/grip-down-right.svg";
import GripUpRight from "$/lib/assets/icons/grip-up-right.svg";
import { type CellOverlayProps } from "$/lib/components/editable-grid/editable-grid-overlay.model";
import { useGrid } from "$/lib/components/editable-grid/editable-grid.context";
import { GripPosition } from "$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split-drag-interaction.model";
import { EditableGridCellMergeDragInteraction } from "$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split-drag.interaction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "$/lib/components/ui/tooltip";
import { useLayoutEffect } from "react";

export const CellMergeSplitGripOverlay: React.FC<CellOverlayProps> = ({
  cell,
}) => {
  const grid = useGrid();
  const interactionStack = grid.interactionStack;

  const handleMouseDown = (
    event: React.MouseEvent,
    gripPosition: GripPosition,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const existingInteraction = interactionStack.getByType(
      EditableGridCellMergeDragInteraction,
    );
    if (existingInteraction) existingInteraction.cancel();

    const newInteraction = new EditableGridCellMergeDragInteraction({
      stack: interactionStack,
      initialData: {
        grid,
        fromCell: cell,
        splitGripCorner: gripPosition,
        startX: event.clientX,
        startY: event.clientY,
      },
    });
    newInteraction.start();
  };

  useLayoutEffect(() => {
    const handleMouseUp = () => {
      interactionStack
        .getByType(EditableGridCellMergeDragInteraction)
        ?.complete();
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [interactionStack]);

  return (
    <div className={"pointer-events-none contents"}>
      <TooltipProvider disableHoverableContent>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="pointer-events-auto invisible absolute right-0 top-0 z-[60] inline-flex cursor-crosshair select-none items-center justify-center whitespace-nowrap rounded-md p-1 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-muted/50 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:visible"
              onMouseDown={(event) =>
                handleMouseDown(event, GripPosition.TopRight)
              }
            >
              <GripUpRight width={16} height={16} />
              <span className={"sr-only"}>Merge or split cell</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Merge or split cell</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider disableHoverableContent>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="pointer-events-auto invisible absolute bottom-0 right-0 z-[60] inline-flex cursor-crosshair select-none items-center justify-center whitespace-nowrap rounded-md p-1 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-muted/50 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:visible"
              onMouseDown={(event) =>
                handleMouseDown(event, GripPosition.BottomRight)
              }
            >
              <GripDownRight width={16} height={16} />
              <span className={"sr-only"}>Merge or split cell</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Merge or split cell</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider disableHoverableContent>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="pointer-events-auto invisible absolute bottom-0 left-0 z-[60] inline-flex cursor-crosshair select-none items-center justify-center whitespace-nowrap rounded-md p-1 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-muted/50 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:visible"
              onMouseDown={(event) =>
                handleMouseDown(event, GripPosition.BottomLeft)
              }
            >
              <GripDownLeft width={16} height={16} />
              <span className={"sr-only"}>Merge or split cell</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Merge or split cell</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
