import { getPost } from '@/helpers/bahaApi/post.bahaApi'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const PostPage = () => {
  const { postId } = useParams()

  const {
    data: post,
    isLoading: isLoadingPost,
    error: postError,
  } = useQuery(['post', postId], () => getPost(postId as string), {
    enabled: !!postId,
  })

  if (isLoadingPost) {
    return <div className="container">Loading</div>
  }

  if (postError) {
    return <div className="container">Failed to load post</div>
  }

  return (
    <div>
      <div className="container">{postId}</div>
      <div></div>
    </div>
  )
}

export default PostPage
