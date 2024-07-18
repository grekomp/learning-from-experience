import { type Tail } from "$/lib/utils/types/tail";

export type TreeItemId = string;

export interface TreeViewItemData {
  id: TreeItemId;
  content: string;
  children?: TreeViewItemData[];
  isExpanded?: boolean;
  isSelected?: boolean;
  icon?: React.ReactNode;
}

export interface TreeViewOptions {
  defaultIcon?: React.ReactNode;
}

export interface TreeViewState {
  items: TreeViewItemData[];
  focusedItemId: TreeItemId | null;
}
export interface TreeViewHandlerContext {
  readonly handlers: TreeViewHandlersWithBoundContext;
  readonly options: TreeViewOptions;
  readonly setState: (state: TreeViewState) => void;
}

export interface TreeViewHandlers {
  /**
   * Unselects all items and selects the specified items.
   */
  replaceSelected: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    selectedItemIds: TreeItemId[],
  ) => TreeViewState;
  /**
   * Sets the selection state of the specified items.
   */
  setSelected: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    itemIds: TreeItemId[],
    selected: boolean,
  ) => TreeViewState;
  /**
   * Adds the specified items to the selection.
   */
  addSelected: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    itemIds: TreeItemId[],
  ) => TreeViewState;
  /**
   * Toggles the selection state of the specified items.
   */
  toggleSelected: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    itemIds: TreeItemId[],
  ) => TreeViewState;

  /**
   * Toggles the expanded state of the specified items.
   */
  toggleExpanded: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    itemIds: TreeItemId[],
  ) => TreeViewState;
  /**
   * Sets the expanded state of the specified item and all its expandable children recursively.
   */
  setExpandedRecursive: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    itemId: TreeItemId,
    expanded: boolean,
  ) => TreeViewState;

  /**
   * Sets the focused item.
   */
  setFocused: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    itemId: TreeItemId | null,
  ) => TreeViewState;

  // #region Event handlers
  handleItemClick: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    itemId: TreeItemId,
    event: React.MouseEvent,
  ) => TreeViewState;
  handleExpandCollapseClick: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    itemId: TreeItemId,
    event: React.MouseEvent,
  ) => TreeViewState;
  handleKeyDown: (
    context: TreeViewHandlerContext,
    state: TreeViewState,
    event: React.KeyboardEvent,
  ) => TreeViewState;
  // #endregion Event handlers
}

export type TreeViewHandlersWithBoundContext = {
  [Key in keyof TreeViewHandlers]: (
    ...args: Tail<Parameters<TreeViewHandlers[Key]>>
  ) => ReturnType<TreeViewHandlers[Key]>;
};

export type TreeViewHandlersWithBoundContextAndState = {
  [Key in keyof TreeViewHandlersWithBoundContext]: (
    ...args: Tail<Parameters<TreeViewHandlersWithBoundContext[Key]>>
  ) => ReturnType<TreeViewHandlersWithBoundContext[Key]>;
};

export const defaultTreeViewLevelIndent = "20px";
