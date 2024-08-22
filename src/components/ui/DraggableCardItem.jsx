import { useDragControls, Reorder } from 'framer-motion';
import ReorderIcon from '../../assets/icons/reorder.svg';

export function DraggableCardItem({ item, reorderToggle, children }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      key={item.companyName}
      value={item}
      layout
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="flex items-start">
        {reorderToggle && (
          <div className="cursor-grab">
            <img
              className="touch-none relative z-10 p-1 top-3 bg-base-200 rounded-lg rounded-r-none"
              src={ReorderIcon}
              onPointerDown={(e) => dragControls.start(e)}
              draggable={false}
              alt="Reorder"
            />
          </div>
        )}
        {children}
      </div>
    </Reorder.Item>
  );
}
