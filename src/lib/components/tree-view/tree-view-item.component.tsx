import { TreeViewItemChildren } from "$/lib/components/tree-view/tree-view-item-children.component";
import {
  type TreeItemId,
  type TreeViewHandlersWithBoundContextAndState,
  type TreeViewItemData,
  type TreeViewOptions,
} from "$/lib/components/tree-view/tree-view.model";
import { Button } from "$/lib/components/ui/button";
import { cn } from "$/lib/utils/shadcnui";
import { Slot } from "@radix-ui/react-slot";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useLayoutEffect, useRef } from "react";

export interface TreeViewItemProps {
  data: TreeViewItemData;
  focusedItemId: TreeItemId | null;
  options?: TreeViewOptions;
  level: number;
  handlers: Pick<
    TreeViewHandlersWithBoundContextAndState,
    "handleItemClick" | "handleExpandCollapseClick"
  >;
}

export const TreeViewItem: React.FC<TreeViewItemProps> = React.memo(
  ({ data, focusedItemId, level, options, handlers }) => {
    const { handleItemClick, handleExpandCollapseClick } = handlers;
    const {
      content,
      children,
      isExpanded = false,
      isSelected = false,
      icon,
    } = data;
    const { defaultIcon } = options ?? {};
    const isFocused = focusedItemId === data.id;

    const ref = useRef<HTMLLIElement>(null);
    useLayoutEffect(() => {
      if (isFocused) {
        ref.current?.focus();
      }
    }, [isFocused]);

    return (
      <li
        role="treeitem"
        aria-expanded={children?.length ? !!isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={isFocused ? 0 : -1}
        ref={ref}
        className={"outline-none"}
      >
        <div
          style={{
            paddingLeft: `calc(${level} * var(--tree-view-level-indent))`,
          }}
          className={cn(
            "relative z-10 flex cursor-pointer select-none flex-row items-center gap-2 py-0.5",
            {
              "bg-accent text-accent-foreground": isSelected,
              "hover:bg-accent/50": !isSelected,
              "z-20 outline-1 group-focus-within/treeview:outline": isFocused,
            },
          )}
          onClick={(event) => {
            handleItemClick?.(data.id, event);
          }}
        >
          <div className="h-4 w-4">
            {children && (
              <Button
                tabIndex={-1}
                variant={"ghost"}
                size={"icon-sm"}
                onClick={(event) => handleExpandCollapseClick(data.id, event)}
              >
                {isExpanded ? <ChevronDown /> : <ChevronRight />}
                <span className={"sr-only"}>
                  {isExpanded ? "Collapse" : "Expand"}
                </span>
              </Button>
            )}
          </div>
          {(icon ?? defaultIcon) && (
            <Slot className={"h-4 w-4"} aria-hidden>
              {icon ?? defaultIcon}
            </Slot>
          )}
          {content}
        </div>
        <TreeViewItemChildren
          item={data}
          level={level}
          focusedItemId={focusedItemId}
          options={options}
          handlers={handlers}
        />
      </li>
    );
  },
);

TreeViewItem.displayName = "TreeViewItem";
