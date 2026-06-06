import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableSectionItemProps {
  id: string
  children: (dragHandleProps: React.HTMLAttributes<HTMLElement>) => React.ReactNode
}

export function SortableSectionItem({ id, children }: SortableSectionItemProps) {
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
