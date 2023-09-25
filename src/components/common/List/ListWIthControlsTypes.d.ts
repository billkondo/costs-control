type ListWithControlsSelectProps<T> = {
  selectable?: boolean;
  onSelect?: (item: T) => void;
};

type ListWithControlsProps<T extends withID> =
  ListWithControlsSelectProps<T> & {
    renderItem: (item: T) => React.ReactElement;
    title: string;
    controls?: React.ReactElement;
    items: T[];
    bodyHeader?: React.ReactElement;
    bodyFooter?: React.ReactElement;
  };
