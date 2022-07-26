import { RouteObject } from 'react-router-dom'
import PostPage from './pages/post'

const routes: RouteObject[] = [
  {
    path: '/post/:postId',
    element: <PostPage />,
  },
]

export default routes
