
import Button from "./DropdownTrigger";
import ExpandableElement from "./ExpandableElement";

type ExpandableListProps = {
  items: Array<{
    text: string;
    onClick: () => void;
  }>;
  title: string;
};

export default function ExpandableList({ items, title }: ExpandableListProps) {
  return (
    <>
      <ExpandableElement
        triggerRender={({ onClick, isOpen }) => (
          <Button
            onClick={onClick}
            arrowPosition={isOpen ? "bottom" : "top"}
            arrow
          >
            {title}
          </Button>
        )}
      >
        <ul className="w-full">
          {items.map((item, index) => (
            <li key={index}>
              <Button border onClick={item.onClick}>
                {item.text}
              </Button>
            </li>
          ))}
        </ul>
      </ExpandableElement>
    </>
  );
}
