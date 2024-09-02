import { useDragControls, Reorder } from 'framer-motion';
import { ArrowDownUp } from 'lucide-react';

export function DraggableCardItem({ item, reorderToggle, children }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      key={item}
      value={item}
      layout
      dragListener={false}
      dragControls={dragControls}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start">
        {reorderToggle && (
          <div className="cursor-grab">
            <ArrowDownUp
              className={`touch-none select-none relative z-10 p-1 top-3 bg-base-200 rounded-lg rounded-r-none`}
              size={28}
              onPointerDown={(e) => dragControls.start(e)}
              draggable={false}
              alt="Reorder"
            ></ArrowDownUp>
          </div>
        )}
        {children}
      </div>
    </Reorder.Item>
  );
}
