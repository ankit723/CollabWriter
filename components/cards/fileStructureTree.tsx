'use client'
import {useEffect, useState} from 'react'
import {io} from 'socket.io-client'

const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001');

const FileTreeNode = ({ fileName, nodes, onSelect, path }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const isFolder = nodes !== null;

    return (
        <div className='' style={{ marginLeft: '17px'}} >
            {isFolder ? (
                <div style={{borderLeft:"0.1px solid #7e7e7e"}}>
                    <span className='text-white-2 font-thin text-small-regular' onClick={toggleExpansion} style={{ cursor: 'pointer'}}>
                        <span className='pr-2' style={{fontSize:"10px"}}>{isExpanded ? '▼ 📂' : '▶ 📁'}</span>{fileName}
                    </span>
                    {isExpanded && (
                        <ul style={{ listStyleType: 'none'}}>
                            {Object.keys(nodes).map((child) => (
                                <li key={child} style={{lineHeight:"20px"}}>
                                    <FileTreeNode fileName={child} nodes={nodes[child]} onSelect={onSelect} path={path+'/'+child}/>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <span className='cursor-pointer font-thin text-small-regular' onClick={(e)=>{
                    onSelect(path)
                }}> <span className='pr-2' style={{fontSize:"10px"}}>📄</span> {fileName}</span>
            )}
        </div>
    );
};


const FileStructureTree = ({onSelect}:any) => {
    const[tree, setTree]=useState<any>(null)

    useEffect(()=>{
        async function fetchFileTree(){
            try{
                const response=await fetch('http://localhost:5001/files')
                const fileTree=await response.json()
                
                setTree(fileTree)
            }catch(err){
                console.log("error in fetching in the recently changed file", err)
            }
        }
        fetchFileTree()

        ws.onmessage=async(event)=>{
            const message=JSON.parse(event.data)
            if(message.type==='file:refresh'){
                fetchFileTree()
            }
        }
    })
    return (
        <div>
            <FileTreeNode 
                fileName={'/'}
                nodes={tree?.tree}
                onSelect={onSelect}
                path={""}
            />
        </div>
    )
}

export default FileStructureTree
