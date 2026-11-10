import { RouterProvider } from 'react-router'
import { router } from './routes'
import { GlobalEffects } from '../components/Effects'

export default function App() {
  return (
    <>
      <GlobalEffects />
      <RouterProvider router={router} />
    </>
  )
}
