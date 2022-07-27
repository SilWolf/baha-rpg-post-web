import { useCallback, useState } from 'react'

const generateTagDiv = () => {
  const newElement = document.createElement('div')
  newElement.setAttribute('contenteditable', 'true')
  newElement.classList.add(
    'name-tag',
    'inline-block',
    'rounded-lg',
    'bg-gray-500',
    'text-white',
    'mx-1',
    'px-2',
    "before:content-['@']"
  )

  newElement.addEventListener('input', (e) => {
    e.stopPropagation()
    console.log(e)
  })

  return newElement
}

const Editor = () => {
  const [text, setText] = useState('')

  const handleSubmit = useCallback(() => {
    // TODO: Submit
  }, [])

  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    document.execCommand('insertText', false, e.clipboardData.getData('text'))
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    // console.log(e)
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      handleSubmit()
      return
    }

    if ((e.key === 'b' || e.key === 'u' || e.key === 'i') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      return
    }

    if (e.key === '@') {
      e.preventDefault()

      console.log(window.getSelection())
      console.log(window.getSelection()?.getRangeAt(0))

      const range = window.getSelection()?.getRangeAt(0)
      if (range && (range.startContainer as HTMLElement)?.id === 'main') {
        // delete whatever is on the range
        range.deleteContents()

        // place your span
        const nameTag = document.createElement('div')
        nameTag.setAttribute('contenteditable', 'true')
        nameTag.classList.add(
          'name-tag',
          'inline-block',
          'rounded-lg',
          'bg-gray-500',
          'text-white',
          'mx-1',
          'px-2',
          "before:content-['@']"
        )

        nameTag.addEventListener('keydown', (e) => {
          e.stopPropagation()
          console.log(e)
        })

        range.insertNode(nameTag)
        range.setStartAfter(nameTag)
        range.collapse(true)
        range.insertNode(document.createTextNode(' '))
        range.collapse(true)
      }

      return
    }
  }

  const handleInput: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    setText(e.target.innerText)
  }

  const handleChange: React.FormEventHandler<HTMLDivElement> = (e) => {
    console.log(e)
  }

  const handleClickInsert = () => {
    const range = window.getSelection()?.getRangeAt(0)
    if (range && (range.startContainer.parentNode as HTMLElement)?.id === 'main') {
      // delete whatever is on the range
      range.deleteContents()
      // place your span

      const tag = generateTagDiv()

      range.insertNode(tag)
      range.setStartAfter(tag)
      range.collapse(true)
      range.insertNode(document.createTextNode(' '))
      range.collapse(true)
    }
  }

  return (
    <div>
      <div
        className="px-2 py-4 rounded bg-gray-200"
        contentEditable
        id="main"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
        onChange={handleChange}
      />
    </div>
  )
}

export default Editor
