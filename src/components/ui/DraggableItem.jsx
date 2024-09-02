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
              className={`touch-none relative z-10 p-1 left-2 top-1 bg-white rounded-lg rounded-r-none`}
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
