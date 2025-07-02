
import AdditionallySectionButton from "./DropdownTrigger";
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
          <AdditionallySectionButton
            onClick={onClick}
            arrowPosition={isOpen ? "bottom" : "top"}
            arrow
          >
            {title}
          </AdditionallySectionButton>
        )}
      >
        <ul className="w-full">
          {items.map((item, index) => (
            <li key={index}>
              <AdditionallySectionButton border onClick={item.onClick}>
                {item.text}
              </AdditionallySectionButton>
            </li>
          ))}
        </ul>
      </ExpandableElement>
    </>
  );
}
