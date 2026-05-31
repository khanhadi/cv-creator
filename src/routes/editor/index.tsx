import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/editor/')({
  beforeLoad: () => {
    throw redirect({ to: '/editor/$boardId', params: { boardId: 'local' } })
  },
})
