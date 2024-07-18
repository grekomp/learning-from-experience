import { defaultTreeViewHandlers } from "$/lib/components/tree-view/tree-view-handlers";
import { type TreeViewProps } from "$/lib/components/tree-view/tree-view.component";
import {
  type TreeViewHandlerContext,
  type TreeViewHandlers,
  type TreeViewHandlersWithBoundContext,
  type TreeViewItemData,
  type TreeViewOptions,
  type TreeViewState,
} from "$/lib/components/tree-view/tree-view.model";
import { flow } from "$/lib/utils/functions/flow";
import { tap } from "$/lib/utils/functions/tap";
import { type Writable } from "$/lib/utils/types/writable";
import { useEvent } from "$/lib/utils/use-event";
import { useEffect, useRef, useState } from "react";

export interface UseTreeViewProps {
  initialItems: TreeViewItemData[];
  options: TreeViewOptions;
  handlers?: Partial<TreeViewHandlers>;
}

export function useTreeView({
  initialItems,
  options,
  handlers,
}: UseTreeViewProps) {
  const treeStateRef = useRef<TreeViewState>({
    items: initialItems,
    focusedItemId: null,
  });
  const [treeState, __setTreeState] = useState<TreeViewState>(
    treeStateRef.current,
  );

  const setTreeState = useEvent((state: TreeViewState) => {
    if (Object.is(state, treeStateRef.current)) return;

    console.log("Setting tree state", state);
    treeStateRef.current = state;
    __setTreeState(state);
  });

  useEffect(() => {
    console.log("Tree state changed", treeState);
  }, [treeState]);

  const handlersWithDefaults = {
    ...defaultTreeViewHandlers,
    ...handlers,
  };

  const handlerContext: Writable<TreeViewHandlerContext> = {
    options,
    handlers: {} as TreeViewHandlersWithBoundContext,
    setState: setTreeState,
  };

  const boundHandlers = Object.fromEntries(
    Object.entries(handlersWithDefaults).map(([key, handler]) => [
      key,
      // eslint-disable-next-line @typescript-eslint/ban-types
      (handler as Function).bind(null, handlerContext),
    ]),
  ) as TreeViewHandlersWithBoundContext;

  const handleKeyDownWithBoundState = useEvent(
    flow(
      boundHandlers.handleKeyDown.bind(null, treeStateRef.current),
      tap(setTreeState),
    ),
  );
  const handleItemClickWithBoundState = useEvent(
    flow(
      (itemId: string, event: React.MouseEvent) =>
        boundHandlers.handleItemClick(treeStateRef.current, itemId, event),
      tap(setTreeState),
    ),
  );
  const handleExpandCollapseClickWithBoundState = useEvent(
    flow(
      (itemId: string, event: React.MouseEvent) =>
        boundHandlers.handleExpandCollapseClick(
          treeStateRef.current,
          itemId,
          event,
        ),
      tap(setTreeState),
    ),
  );

  handlerContext.handlers = boundHandlers;

  const getTreeViewProps = useEvent(
    (): TreeViewProps => ({
      items: treeStateRef.current.items,
      options,
      focusedItemId: treeStateRef.current.focusedItemId ?? null,

      handlers: {
        handleKeyDown: handleKeyDownWithBoundState,
        handleItemClick: handleItemClickWithBoundState,
        handleExpandCollapseClick: handleExpandCollapseClickWithBoundState,
      },
    }),
  );

  return {
    state: treeState,
    options,
    setTreeState: setTreeState,
    replaceSelected: boundHandlers.replaceSelected,
    setFocused: boundHandlers.setFocused,
    getTreeViewProps,
  };
}
