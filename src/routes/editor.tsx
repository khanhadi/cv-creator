import { createFileRoute } from '@tanstack/react-router'
import App from '../components/App'

export const Route = createFileRoute('/editor')({
  ssr: false,
  component: App,
})
