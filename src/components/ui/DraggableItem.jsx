import { Reorder, useDragControls } from 'framer-motion';
import { ArrowDownUp } from 'lucide-react';

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
            <ArrowDownUp
              className={`relative left-2 top-1 z-10 touch-none rounded-lg rounded-r-none bg-white p-1`}
              size={28}
              onPointerDown={handlePointerDown}
              draggable={false}
              alt="Reorder"
            ></ArrowDownUp>
          </div>
        )}
        <div className="flex-1">{renderSection(item)}</div>
      </div>
    </Reorder.Item>
  );
}
