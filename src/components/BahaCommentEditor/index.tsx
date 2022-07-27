import React, { useCallback, useMemo, useState } from 'react'
// Import the Slate editor factory.
import { createEditor, BaseEditor, Transforms, Editor, Range, Location } from 'slate'
import { ReactEditor, Slate, Editable, withReact, RenderElementProps } from 'slate-react'
import { HistoryEditor, withHistory } from 'slate-history'
import BahaEditorMention from './components/BahaCommentMentionSpan'

type CustomText = { text: string }
type CustomElement =
  | { type: 'paragraph'; children: CustomText[]; label?: string }
  | { type: 'mention'; children: CustomText[]; label?: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>
}

// Import the Slate components and React plugin.
const initialValue: any[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const withCustom = (editor: Editor) => {
  const { isInline, isVoid } = editor

  editor.isInline = (element) => ['mention'].includes(element.type) || isInline(element)
  editor.isVoid = (element) => ['mention'].includes(element.type) || isVoid(element)

  return editor
}

const BahaCommentEditor = () => {
  const [editor] = useState(() => withCustom(withReact(withHistory(createEditor()))))
  const [mentionTarget, setMentionTarget] = useState<Location | null>(null)
  const [mentionSearch, setMentionSearch] = useState<string | undefined>()

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'mention':
        return <BahaEditorMention {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const handleChangeForMention = useCallback(() => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)
      const wordBefore = Editor.before(editor, start, { unit: 'word' })
      const before = wordBefore && Editor.before(editor, wordBefore)
      const beforeRange = before && Editor.range(editor, before, start)
      const beforeText = beforeRange && Editor.string(editor, beforeRange)
      const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
      const after = Editor.after(editor, start)
      const afterRange = Editor.range(editor, start, after)
      const afterText = Editor.string(editor, afterRange)
      const afterMatch = afterText.match(/^(\s|$)/)

      if (beforeMatch && afterMatch) {
        setMentionTarget(beforeRange)
        setMentionSearch(beforeMatch[1])
        return
      }
    }

    setMentionTarget(null)

    // if (!editor.selection) {
    //   setMentionSearch(undefined)
    //   return
    // }
    // const start = Range.start(editor.selection)
    // const element = editor.children[start.path[0]] as CustomElement

    // if (element.type !== 'paragraph') {
    //   setMentionSearch(undefined)
    //   return
    // }

    // const matched = (element.children[0].text ?? '')
    //   .substring(0, start.offset)
    //   .match(/(?<!\S)@(\S+)$/)
    // setMentionSearch(matched?.[1])
  }, [editor])

  const handleChange = useCallback(() => {
    handleChangeForMention()
  }, [handleChangeForMention])

  const handleKeydownForMention = useCallback<React.KeyboardEventHandler<HTMLDivElement>>(
    (event) => {
      if (mentionSearch && mentionTarget && event.key === 'Enter') {
        event.preventDefault()

        Transforms.select(editor, mentionTarget)
        Transforms.insertNodes(editor, {
          type: 'mention',
          children: [{ text: '' }],
          label: mentionSearch,
        })
        Transforms.move(editor)

        setMentionSearch('')
        setMentionTarget(null)
      }
    },
    [editor, mentionSearch, mentionTarget]
  )

  const handleKeydown = useCallback<React.KeyboardEventHandler<HTMLDivElement>>(
    (event) => {
      if (mentionSearch) {
        handleKeydownForMention(event)
      }
    },
    [mentionSearch, handleKeydownForMention]
  )

  const handleBlur = useCallback(() => {
    setMentionSearch(undefined)
  }, [])

  return (
    <>
      <div className="p-4 bg-gray-100 rounded-md">
        <Slate editor={editor} value={initialValue} onChange={handleChange}>
          <Editable
            className="min-h-[192px]"
            renderElement={renderElement}
            onKeyDown={handleKeydown}
            onBlur={handleBlur}
          />
        </Slate>
      </div>
      {!!mentionSearch && <div className="text-green-600">Mention Search ON ({mentionSearch})</div>}
    </>
  )
}

export default BahaCommentEditor
