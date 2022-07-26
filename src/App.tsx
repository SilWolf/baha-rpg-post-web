import { useRoutes } from 'react-router-dom'
import routes from './routes'

function App() {
  const routeComponents = useRoutes(routes)
  return routeComponents
}

export default App
