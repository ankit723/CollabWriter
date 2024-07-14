"use client";
import { useEffect, useState } from "react";

const ws = new WebSocket(
  process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || "ws://localhost:5001"
);

const FileTreeNode = ({fileName,nodes,onSelect,path,searchSelectedPath,setSearchResult,searchResult,pId, newFolderCreatedPath, setNewFolderCreatedPath, newFileCreatedPath, setNewFileCreatedPath}: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuStyle, setMenuStyle] = useState<any>({display: "none",top: 0,left: 0,});
  const [folderMenuStyle, setFolderMenuStyle] = useState<any>({display: "none",top: 0,left: 0,});
  const [isRenaming, setIsRenaming] = useState(false);
  const [isFolderRenaming, setIsFolderRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState(fileName);
  const [newFolderName, setNewFolderName] = useState(fileName);
  const isFolder = nodes !== null;

  useEffect(() => {
    if (searchSelectedPath === "") {
      setSearchResult([]);
    }
    if (searchSelectedPath !== "") {
      setIsExpanded(true);
    }
    if (path.includes(searchSelectedPath) && !isFolder) {
      if (!searchResult.includes(path)) {
        setSearchResult([...searchResult, path]);
      }
      if (searchSelectedPath === "") {
        setSearchResult([]);
      }
    }

    return () => {
      if (searchSelectedPath === "") {
        setIsExpanded(false);
      }
    };
  }, [searchSelectedPath]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRightClick = (event: any, filePath: any) => {
    event.preventDefault();
    setMenuStyle({
      display: "block",
      top: event.clientY,
      left: event.clientX,
    });
  };

  const handleFolderRightClick = (event: any, filePath: any) => {
    event.preventDefault();
    setFolderMenuStyle({
      display: "block",
      top: event.clientY,
      left: event.clientX,
    });
  };
  
  const handleMenuClick = (action: any, filePath: any) => {
    console.log(action, filePath);
    switch (action) {
      case "rename":
        setIsRenaming(true);
        break;
      case "delete":
        console.log("Delete", filePath);
        handleDeleteFile(filePath);
        break;
      default:
        break;
    }
  };
  
  const handleFolderMenuClick = (action: any, filePath: any) => {
    console.log(action, filePath);
    switch (action) {
        case "rename":
            setIsFolderRenaming(true);
            break;
        case "delete":
            console.log("Delete", filePath);
            handleDeleteFolder(filePath);
            break;
        case "create-folder":
            console.log("Delete", filePath);
            handleCreateFolder(filePath);
            break;
        case "create-file":
            console.log("Delete", filePath);
            handleCreateFile(filePath);
            break;
      default:
        break;
    }
  };

  const handleCreateFile=(filePath:string)=>{
    ws.send(JSON.stringify({type: "file:create", data:{ filePath: `user/${pId}${filePath}/new-file`}}));
    setNewFileCreatedPath(`${filePath}/new-file`)
  }
  
  const handleCreateFolder=(filePath:string)=>{
    ws.send(JSON.stringify({type: "folder:create", data:{ filePath: `user/${pId}${filePath}/new-folder`}}));
    setNewFolderCreatedPath(`${filePath}/new-folder`)
  }

  const handleDeleteFile = (filePath: string) => {
    ws.send(
      JSON.stringify({
        type: "file:delete",
        data: { filePath: `user/${pId}${filePath}` },
      })
    );
  };

  const handleDeleteFolder = (filePath: string) => {
    ws.send(
      JSON.stringify({
        type: "folder:delete",
        data: { filePath: `user/${pId}${filePath}` },
      })
    );
  };

  const handleRename = (path: any) => {
    let dupPath = path;
    let newPath = dupPath.replace(fileName, newFileName);
    console.log(`user/${pId}${path}`);
    console.log(`user/${pId}${newPath}`);
    if (pId) {
      ws.send(
        JSON.stringify({
          type: "file:rename",
          data: {
            oldPath: `user/${pId}${path}`,
            newPath: `user/${pId}${newPath}`,
          },
        })
      );
    }
    setIsRenaming(false);
    
  };

  const handleFolderRename = (path: any) => {
    let dupPath = path;
    let newPath = dupPath.replace(fileName, newFolderName);
    console.log(`user/${pId}${path}`);
    console.log(`user/${pId}${newPath}`);
    if (pId) {
      ws.send(
        JSON.stringify({
          type: "file:rename",
          data: {
            oldPath: `user/${pId}${path}`,
            newPath: `user/${pId}${newPath}`,
          },
        })
      );
    }
    setIsFolderRenaming(false);
  };

  const handleClick = () => {
    setMenuStyle({ display: "none" });
    setFolderMenuStyle({ display: "none" });
  };

  useEffect(()=>{
    if(path===newFolderCreatedPath){
        handleFolderMenuClick('rename', newFolderCreatedPath)
    }
  }, [newFolderCreatedPath])

  useEffect(()=>{
    if(path===newFileCreatedPath){
        handleMenuClick('rename', newFileCreatedPath)
    }
  }, [newFileCreatedPath])

  return (
    <div
      className=""
      style={{ marginLeft: "17px", position: "relative" }}
      onClick={handleClick}
    >
      {isFolder && fileName != "node_modules" ? (
        <div style={{ borderLeft: "0.1px solid #7e7e7e" }}>
            {isFolderRenaming?(
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onBlur={() => handleFolderRename(path)}
                        onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleFolderRename(path);
                        }
                        }}
                        className="bg-black-3"
                        autoFocus
                    />
                ):(
                    <span className="text-white-2 hover:text-blue font-thin text-small-regular"onClick={toggleExpansion}style={{ cursor: "pointer" }} onContextMenu={(e) => handleFolderRightClick(e, path)}>
                        <span className="pr-2" style={{ fontSize: "10px" }}>{isExpanded ? "▼ 📂" : "▶ 📁"}</span>
                        {newFolderName}
                    </span>
                )
            }
            {isExpanded && (
                <ul style={{ listStyleType: "none" }}>
                {Object.keys(nodes).map((child) => (
                    <li key={child} style={{ lineHeight: "20px" }}>
                    <FileTreeNode
                        fileName={child}
                        nodes={nodes[child]}
                        onSelect={onSelect}
                        path={`${path}/${child}`}
                        searchSelectedPath={searchSelectedPath}
                        setSearchResult={setSearchResult}
                        searchResult={searchResult}
                        pId={pId}
                        newFolderCreatedPath={newFolderCreatedPath} 
                        setNewFolderCreatedPath={setNewFolderCreatedPath}
                        newFileCreatedPath={newFileCreatedPath} 
                        setNewFileCreatedPath={setNewFileCreatedPath}
                    />
                    </li>
                ))}
                </ul>
            )}
        </div>
      ) : (
        <>
          {fileName !== "node_modules" ? (
            <div className="">
              {isRenaming ? (
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onBlur={() => handleRename(path)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRename(path);
                    }
                  }}
                  className="bg-black-3"
                  autoFocus
                />
              ) : (
                <span
                  className="cursor-pointer font-thin text-small-regular hover:text-blue"
                  onClick={() => onSelect(path)}
                  onContextMenu={(e) => handleRightClick(e, path)}
                >
                  <span className="pr-2" style={{ fontSize: "10px" }}>
                    📄
                  </span>{" "}
                  {newFileName}
                </span>
              )}
            </div>
          ) : (
            ""
          )}
        </>
      )}

      <div className="bg-black-4 p-1 rounded-lg w-52"style={{...menuStyle,position: "fixed",border: "1px solid black",zIndex: 1000,}}>
        <div className="px-2 py-[1px] my-1 hover:bg-orange-1 rounded-md"style={{ cursor: "pointer", fontSize: "13px" }}onClick={() => handleMenuClick("rename", path)}>Rename</div>
        <div className="px-2 py-[1px] my-1 hover:bg-orange-1 rounded-md"style={{ cursor: "pointer", fontSize: "13px" }}onClick={() => handleMenuClick("delete", path)}>Delete</div>
      </div>
      
      <div className="bg-black-4 p-1 rounded-lg w-52"style={{...folderMenuStyle,position: "fixed",border: "1px solid black",zIndex: 1000,}}>
        <div className="px-2 py-[1px] my-1 hover:bg-orange-1 rounded-md"style={{ cursor: "pointer", fontSize: "13px" }}onClick={() => handleFolderMenuClick("create-folder", path)}>New Folder...</div>
        <div className="px-2 py-[1px] my-1 hover:bg-orange-1 rounded-md"style={{ cursor: "pointer", fontSize: "13px" }}onClick={() => handleFolderMenuClick("create-file", path)}>New File...</div>
        <div className="px-2 py-[1px] my-1 hover:bg-orange-1 rounded-md"style={{ cursor: "pointer", fontSize: "13px" }}onClick={() => handleFolderMenuClick("rename", path)}>Rename</div>
        <div className="px-2 py-[1px] my-1 hover:bg-orange-1 rounded-md"style={{ cursor: "pointer", fontSize: "13px" }}onClick={() => handleFolderMenuClick("delete", path)}>Delete</div>
      </div>
    </div>
  );
};

const FileStructureTree = ({
  onSelect,
  pId,
  searchSelectedPath,
  setSearchResult,
  searchResult,
  docName,
}: any) => {
    const [tree, setTree] = useState<any>(null);
    const [newFolderCreatedPath, setNewFolderCreatedPath]=useState<any>(null)
    const [newFileCreatedPath, setNewFileCreatedPath]=useState<any>(null)

  useEffect(() => {
    async function fetchFileTree() {
      try {
        const response = await fetch("http://localhost:5001/files");
        const fileTree = await response.json();
        setTree(fileTree);
      } catch (err) {
        console.log("error in fetching in the recently changed file", err);
      }
    }
    fetchFileTree();

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "file:refresh") {
        fetchFileTree();
      }
    };
  }, []);

  return (
    <div>
      <FileTreeNode
        fileName={docName}
        nodes={tree?.tree[pId]}
        onSelect={onSelect}
        path={""}
        searchSelectedPath={searchSelectedPath}
        setSearchResult={setSearchResult}
        searchResult={searchResult}
        pId={pId}
        newFolderCreatedPath={newFolderCreatedPath} 
        setNewFolderCreatedPath={setNewFolderCreatedPath}
        newFileCreatedPath={newFileCreatedPath} 
        setNewFileCreatedPath={setNewFileCreatedPath}
      />
    </div>
  );
};

export default FileStructureTree;
