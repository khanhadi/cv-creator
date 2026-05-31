import { useDragControls, Reorder } from 'framer-motion'
import { ArrowDownUp } from 'lucide-react'

interface DraggableCardItemProps {
  item: unknown
  reorderToggle: boolean
  children: React.ReactNode
}

export function DraggableCardItem({ item, reorderToggle, children }: DraggableCardItemProps) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item value={item} dragListener={false} dragControls={dragControls}>
      <div className="flex items-start">
        {reorderToggle && (
          <div className="cursor-grab">
            <ArrowDownUp
              className="relative top-3 z-10 touch-none select-none rounded-lg rounded-r-none bg-zinc-200 p-1"
              size={28}
              onPointerDown={(e) => dragControls.start(e)}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Reorder.Item>
  )
}
