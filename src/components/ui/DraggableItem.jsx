import { Reorder, useDragControls } from 'framer-motion';
import ReorderIcon from '../../assets/icons/reorder.svg';

export default function DraggableItem({
  item,
  renderSection,
  isReorderingEnabled,
}) {
  const dragControls = useDragControls();

  const handlePointerDown = (e) => {
    if (isReorderingEnabled) {
      e.stopPropagation(); // Prevent the event from bubbling up
      e.preventDefault();
      dragControls.start(e);
    }
  };

  return (
    <Reorder.Item
      value={item}
      id={item}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className={`flex items-start`}>
        {isReorderingEnabled && (
          <div className={`${isReorderingEnabled ? 'cursor-grab' : ''}`}>
            <img
              className={`touch-none relative z-10 p-1 left-2 top-1 bg-white rounded-lg rounded-r-none`}
              src={ReorderIcon}
              onPointerDown={handlePointerDown}
              draggable={false}
              alt="Reorder"
            />
          </div>
        )}
        <div className="flex-1">{renderSection(item)}</div>
      </div>
    </Reorder.Item>
  );
}
