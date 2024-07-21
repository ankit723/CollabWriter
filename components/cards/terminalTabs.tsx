import React from 'react'

const TerminalTabs = ({setCurrentTerminal, index}:any) => {
  return (
    <div onClick={()=>setCurrentTerminal(index)}>Terminal {index}</div>
  )
}

export default TerminalTabs;
