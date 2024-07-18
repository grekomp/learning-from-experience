import {
  type TreeItemId,
  type TreeViewHandlers,
  type TreeViewItemData,
} from "$/lib/components/tree-view/tree-view.model";
import { pipe } from "$/lib/utils/functions/pipe";
import { produce } from "immer";

export function flatten(items: TreeViewItemData[]) {
  const result: TreeViewItemData[] = [];

  items.forEach((item) => {
    result.push(item);
    if (item.children) {
      result.push(...flatten(item.children));
    }
  });

  return result;
}

export function flatMap(
  items: TreeViewItemData[],
  callback: (item: TreeViewItemData) => void,
) {
  return items.map((item) => {
    const remappedItem = produce(item, callback);

    if (item.children) remappedItem.children = flatMap(item.children, callback);

    return remappedItem;
  });
}

export function get(
  items: TreeViewItemData[],
  id: TreeItemId,
): TreeViewItemData | null {
  return flatten(items).find((item) => item.id === id) ?? null;
}
export function getVisible(items: TreeViewItemData[]) {
  const result: TreeViewItemData[] = [];

  items.forEach((item) => {
    result.push(item);

    if (item.isExpanded && item.children) {
      result.push(...getVisible(item.children));
    }
  });

  return result;
}

function setExpandedRecursiveInner(
  items: TreeViewItemData[],
  expanded: boolean,
) {
  return produce(items, (draft) => {
    draft.forEach((item) => {
      if ("isExpanded" in item || item.children) {
        item.isExpanded = expanded;
      }
      if (item.children) {
        item.children = setExpandedRecursiveInner(item.children, expanded);
      }
    });
  });
}

export const defaultTreeViewHandlers: TreeViewHandlers = {
  replaceSelected(_context, state, selectedItemIds) {
    return produce(state, (draft) => {
      draft.items = flatMap(draft.items, (item) => {
        item.isSelected = selectedItemIds.includes(item.id);
      });
    });
  },
  setSelected(_context, state, itemIds, selected) {
    return produce(state, (draft) => {
      itemIds.forEach((itemId) => {
        const item = get(draft.items, itemId);

        if (!item) return;

        item.isSelected = selected;
      });
    });
  },
  addSelected(_context, state, itemIds) {
    return produce(state, (draft) => {
      itemIds.forEach((itemId) => {
        const item = get(draft.items, itemId);

        if (!item) return;

        item.isSelected = true;
      });
    });
  },
  toggleSelected(_context, state, itemIds) {
    return produce(state, (draft) => {
      itemIds.forEach((itemId) => {
        const item = get(draft.items, itemId);

        if (!item) return;

        item.isSelected = !item.isSelected;
      });
    });
  },

  toggleExpanded(_context, state, itemIds) {
    return produce(state, (draft) => {
      itemIds.forEach((itemId) => {
        const item = get(draft.items, itemId);

        if (!item) return;

        item.isExpanded = !item.isExpanded;
      });
    });
  },
  setExpandedRecursive(_context, state, itemId, expanded) {
    return produce(state, (draft) => {
      const item = get(draft.items, itemId);

      if (!item) return;

      item.isExpanded = expanded;

      if (item.children) {
        item.children = setExpandedRecursiveInner(item.children, expanded);
      }
    });
  },

  setFocused(_context, state, itemId) {
    return produce(state, (draft) => {
      draft.focusedItemId = itemId;
    });
  },

  handleItemClick: (context, state, itemId, event) => {
    return pipe(
      state,
      (s) => {
        if (event.ctrlKey || event.metaKey)
          return context.handlers.toggleSelected(s, [itemId]);
        return event.shiftKey
          ? context.handlers.addSelected(s, [itemId])
          : context.handlers.replaceSelected(s, [itemId]);
      },
      (s) => context.handlers.setFocused(s, itemId),
    );
  },
  handleExpandCollapseClick(context, state, itemId) {
    return context.handlers.toggleExpanded(state, [itemId]);
  },
  handleKeyDown: (context, state, event) => {
    if (
      [
        "ArrowDown",
        "ArrowUp",
        "ArrowRight",
        "ArrowLeft",
        "Enter",
        "Escape",
        "a",
      ].includes(event.key) == false
    )
      return state;

    return produce(state, (draft) => {
      const focusedItem =
        draft.focusedItemId && get(draft.items, draft.focusedItemId);

      if (!focusedItem) {
        draft.focusedItemId = draft.items[0]?.id ?? null;
        return;
      }

      const visibleItems = getVisible(draft.items);
      const currentIndex = visibleItems.findIndex(
        (item) => item.id === focusedItem.id,
      );

      switch (event.key) {
        case "ArrowDown":
          {
            const nextIndex = Math.min(
              currentIndex + 1,
              visibleItems.length - 1,
            );
            const nextItem = visibleItems[nextIndex];

            draft.focusedItemId = nextItem?.id ?? null;
          }
          break;
        case "ArrowUp":
          {
            const nextIndex = Math.max(currentIndex - 1, 0);
            const nextItem = visibleItems[nextIndex];

            draft.focusedItemId = nextItem?.id ?? null;
          }
          break;
        case "ArrowRight":
          {
            if (!focusedItem.children) return;
            if (!focusedItem.isExpanded) {
              focusedItem.isExpanded = true;
              return;
            }

            const nextItem = focusedItem.children[0];
            draft.focusedItemId = nextItem?.id ?? null;
          }
          break;
        case "ArrowLeft":
          {
            if (focusedItem.isExpanded) {
              focusedItem.isExpanded = false;
              return;
            }

            const parent = visibleItems.find((item) =>
              item.children?.some((child) => child.id === focusedItem.id),
            );

            if (!parent) return;

            draft.focusedItemId = parent.id;
          }
          break;
        case "Enter":
          {
            draft.items = context.handlers.toggleSelected(draft, [
              focusedItem.id,
            ]).items;
          }
          break;
        case "Escape":
          {
            draft.focusedItemId = null;
            draft.items = context.handlers.replaceSelected(draft, []).items;
          }
          break;
        case "a": {
          if (!event.ctrlKey && !event.metaKey) return;

          draft.items = context.handlers.setSelected(
            state,
            flatten(state.items).map((item) => item.id),
            true,
          ).items;

          event.preventDefault();
        }
      }
    });
  },
};
