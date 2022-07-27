import { RenderElementProps } from 'slate-react'

export type BahaCommentMentionElement = {
  type: 'mention'
  children: { text: string }[]
  label: string
}

const BahaCommentMentionSpan = (props: RenderElementProps) => {
  return (
    <span
      className="bg-blue-400 text-white rounded mr-1 px-1 before:content-['@']"
      contentEditable={false}
      {...props.attributes}>
      {props.element.label}
      {props.children}
    </span>
  )
}

export default BahaCommentMentionSpan
