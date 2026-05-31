import { Reorder, useDragControls } from 'framer-motion'
import { ArrowDownUp } from 'lucide-react'

interface DraggableItemProps {
  item: string
  renderSection: (item: string) => React.ReactNode
  isReorderingEnabled: boolean
}

export default function DraggableItem({
  item,
  renderSection,
  isReorderingEnabled,
}: DraggableItemProps) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      id={item}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="flex items-start">
        {isReorderingEnabled && (
          <div className="cursor-grab">
            <ArrowDownUp
              className="relative left-2 top-1 z-10 touch-none rounded-lg rounded-r-none bg-white p-1"
              size={28}
              onPointerDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
                dragControls.start(e)
              }}
            />
          </div>
        )}
        <div className="flex-1">{renderSection(item)}</div>
      </div>
    </Reorder.Item>
  )
}
