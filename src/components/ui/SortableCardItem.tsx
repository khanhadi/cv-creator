import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableCardItemProps {
  id: string
  children: (dragHandleProps: React.HTMLAttributes<HTMLElement>) => React.ReactNode
}

export function SortableCardItem({ id, children }: SortableCardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {children({ ...attributes, ...listeners })}
    </div>
  )
}
