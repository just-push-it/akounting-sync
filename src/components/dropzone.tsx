'use client'

import { useRef } from "react"

export type DropzoneProps = {
  onFileAccepted: (file: File) => void
  extensions?: string[]
}

export const Dropzone = (props: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const checkFileExtension = (file: File) => {
    if (!props.extensions) return true;
    
    const extension = file.name.split(".").pop()
    if (!extension) return false;

    return props.extensions.includes("." + extension.toLowerCase())
  }

  const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files.length > 0 && checkFileExtension(event.dataTransfer.files[0])) {
      props.onFileAccepted(event.dataTransfer.files[0])
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div
      className="flex flex-col items-center justify-center bg-slate-300 p-1 rounded-md cursor-pointer"
      onDrop={handleOnDrop}
      onDragOver={handleDragOver}
      onClick={() => inputRef.current?.click()}
    >
      <div className="w-full items-center justify-center bg-none p-10 rounded-md border-dashed border-slate-400 border-2 text-center">
        <input 
          type="file" 
          className="hidden" 
          accept={props.extensions?.join(",")} 
          ref={inputRef}
          multiple={false}
          onChange={(event) => {
            if (event.target.files) {
              props.onFileAccepted(event.target.files[0])
            }
          }}
        />
        <p className="text-slate-700 select-none">Drag and drop a file, or select one</p>
      </div>
    </div>
  )
}