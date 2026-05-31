import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/editor')({
  component: EditorLayout,
})

function EditorLayout() {
  return <Outlet />
}
