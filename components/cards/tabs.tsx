import React from 'react'

const Tabs = ({filePath, isActive, setSelectedTabPath}:any) => {
    const fileName=filePath.split('/').pop()
  return (
    <div className={`editor-tab ${isActive?'editor-tab-active':''} px-10 py-[4px] cursor-pointer`} onClick={()=>setSelectedTabPath(filePath)}>
      {fileName}
    </div>
  )
}

export default Tabs
