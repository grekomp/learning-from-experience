import {
  TreeViewItem,
  type TreeViewItemProps,
} from "$/lib/components/tree-view/tree-view-item.component";
import {
  type TreeItemId,
  type TreeViewItemData,
  type TreeViewOptions,
} from "$/lib/components/tree-view/tree-view.model";
import { cn } from "$/lib/utils/shadcnui";

export interface TreeViewItemChildrenProps {
  item: TreeViewItemData;
  options?: TreeViewOptions;
  focusedItemId: TreeItemId | null;
  level: number;
  handlers: TreeViewItemProps["handlers"];
}

export const TreeViewItemChildren: React.FC<TreeViewItemChildrenProps> = ({
  item: { children, isExpanded },
  options,
  focusedItemId,
  level,
  handlers,
}) => {
  if (!children) return null;

  return (
    <ul
      role="group"
      className={cn("relative", {
        hidden: !isExpanded,
      })}
    >
      <div
        style={{
          left: `calc(${level} * var(--tree-view-level-indent) + 15px)`,
        }}
        className={
          "absolute left-0 h-full w-px bg-muted opacity-0 transition-opacity group-hover/treeview:opacity-100"
        }
      ></div>
      {children.map((child) => (
        <TreeViewItem
          key={child.id}
          data={child}
          focusedItemId={focusedItemId}
          level={level + 1}
          options={options}
          handlers={handlers}
        />
      ))}
    </ul>
  );
};
