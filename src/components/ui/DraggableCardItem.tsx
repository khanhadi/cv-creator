// @ts-nocheck
import { useDragControls, Reorder } from 'framer-motion';
import { ArrowDownUp } from 'lucide-react';

export function DraggableCardItem({ item, reorderToggle, children }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      key={item}
      value={item}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="flex items-start">
        {reorderToggle && (
          <div className="cursor-grab">
            <ArrowDownUp
              className="relative top-3 z-10 touch-none select-none rounded-lg rounded-r-none bg-zinc-200 p-1"
              size={28}
              onPointerDown={(e) => dragControls.start(e)}
              draggable={false}
              alt="Reorder"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </Reorder.Item>
  );
}
