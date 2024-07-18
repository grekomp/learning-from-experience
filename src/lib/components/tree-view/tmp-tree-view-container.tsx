import { TreeView } from "$/lib/components/tree-view/tree-view.component";
import { useTreeView } from "$/lib/components/tree-view/use-tree-view";
import { uuid } from "$/lib/utils/uuid";
import { Bird, File } from "lucide-react";
import { useMemo } from "react";

export const TreeViewContainer: React.FC = () => {
  const { getTreeViewProps } = useTreeView({
    initialItems: [
      {
        id: uuid(),
        content: "Project 1",
        isExpanded: true,
        icon: <Bird className={"text-primary"} />,
        children: [
          { id: uuid(), content: "Child 1" },
          { id: uuid(), content: "Child 2" },
          {
            id: uuid(),
            content: "Child 3",
            isExpanded: true,
            isSelected: true,
            children: [
              { id: uuid(), content: "Grandchild 1" },
              { id: uuid(), content: "Grandchild 2" },
            ],
          },
          { id: uuid(), content: "Child 4" },
          { id: uuid(), content: "Child 5" },
          {
            id: uuid(),
            content: "Child 6",
            isExpanded: false,
            isSelected: false,
            children: [
              { id: uuid(), content: "Grandchild 1" },
              { id: uuid(), content: "Grandchild 2" },
            ],
          },
        ],
      },
    ],
    options: useMemo(
      () => ({
        defaultIcon: <File />,
      }),
      [],
    ),
  });

  return <TreeView {...getTreeViewProps()} />;
};
