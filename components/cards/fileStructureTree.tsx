'use client'
import {useEffect, useState} from 'react'


const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001');

const FileTreeNode = ({ fileName, nodes, onSelect, path, searchSelectedPath, setSearchResult, searchResult}: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isFolder = nodes !== null;

    useEffect(()=>{
        if(searchSelectedPath===""){
            setSearchResult([])
        }
        if(searchSelectedPath!==""){
            setIsExpanded(true)
        }
        if(path.includes(searchSelectedPath) && !isFolder){
            if (!searchResult.includes(path)) {
                setSearchResult([...searchResult, path])
            }
            if(searchSelectedPath === ""){
                setSearchResult([])
            }
        }
        
        return () => {
            if (searchSelectedPath === "") {
              setIsExpanded(false);
            }
        };

    }, [searchSelectedPath])

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    


    return (
        <div className='' style={{ marginLeft: '17px'}} >
            {isFolder ? (
                <div style={{borderLeft:"0.1px solid #7e7e7e"}}>
                    <span className='text-white-2 hover:text-blue font-thin text-small-regular' onClick={toggleExpansion} style={{ cursor: 'pointer'}}>
                        <span className='pr-2' style={{fontSize:"10px"}}>{isExpanded ? '▼ 📂' : '▶ 📁'}</span>{fileName}
                    </span>
                    {isExpanded && (
                        <ul style={{ listStyleType: 'none'}}>
                            {Object.keys(nodes).map((child) => (
                                <li key={child} style={{lineHeight:"20px"}}>
                                    <FileTreeNode fileName={child} nodes={nodes[child]} onSelect={onSelect} path={path+'/'+child} searchSelectedPath={searchSelectedPath} setSearchResult={setSearchResult} searchResult={searchResult}/>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="">
                    <span className='cursor-pointer font-thin text-small-regular hover:text-blue' onClick={(e)=>{
                        onSelect(path)
                    }}> <span className='pr-2 ' style={{fontSize:"10px"}}>📄</span> {fileName}</span>
                </div>
            )}
        </div>
    );
};


const FileStructureTree = ({onSelect, pId, searchSelectedPath, setSearchResult, searchResult}:any) => {
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
                nodes={tree?.tree[pId]}
                onSelect={onSelect}
                path={""}
                searchSelectedPath={searchSelectedPath}
                setSearchResult={setSearchResult}
                searchResult={searchResult}
            />
        </div>
    )
}

export default FileStructureTree
