import { TreeViewItem } from "$/lib/components/tree-view/tree-view-item.component";
import {
  defaultTreeViewLevelIndent,
  type TreeItemId,
  type TreeViewHandlersWithBoundContextAndState,
  type TreeViewItemData,
  type TreeViewOptions,
} from "$/lib/components/tree-view/tree-view.model";

export interface TreeViewProps {
  items: TreeViewItemData[];
  focusedItemId: TreeItemId | null;
  options: TreeViewOptions;
  handlers: Pick<
    TreeViewHandlersWithBoundContextAndState,
    "handleExpandCollapseClick" | "handleItemClick" | "handleKeyDown"
  >;
}

export const TreeView: React.FC<TreeViewProps> = ({
  items,
  focusedItemId,
  options,
  handlers,
}) => {
  return (
    <ul
      style={{
        "--tree-view-level-indent": defaultTreeViewLevelIndent,
      }}
      role="tree"
      aria-labelledby="tree_label"
      className={"group/treeview"}
      onKeyDown={handlers.handleKeyDown}
    >
      {items.map((item) => {
        return (
          <TreeViewItem
            key={item.id}
            level={0}
            data={item}
            options={options}
            focusedItemId={focusedItemId}
            handlers={handlers}
          />
        );
      })}
    </ul>
  );
};
