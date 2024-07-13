'use client'
import { useEffect, useState } from 'react';

const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001');

const FileTreeNode = ({ fileName, nodes, onSelect, path, searchSelectedPath, setSearchResult, searchResult }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [menuStyle, setMenuStyle] = useState<any>({ display: 'none', top: 0, left: 0 });
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
            display: 'block',
            top: event.clientY,
            left: event.clientX
        });
    };

    const handleMenuClick = (action: any, filePath: any) => {
        console.log(action, filePath);
        setMenuStyle({ display: 'none' });
        // Perform actions based on the selected option
    };

    const handleClick = () => {
        setMenuStyle({ display: 'none' });
    };

    return (
        <div className='' style={{ marginLeft: '17px', position: 'relative' }} onClick={handleClick}>
            {isFolder ? (
                <div style={{ borderLeft: "0.1px solid #7e7e7e" }}>
                    <span className='text-white-2 hover:text-blue font-thin text-small-regular' onClick={toggleExpansion} style={{ cursor: 'pointer' }}>
                        <span className='pr-2' style={{ fontSize: "10px" }}>{isExpanded ? '▼ 📂' : '▶ 📁'}</span>{fileName}
                    </span>
                    {isExpanded && (
                        <ul style={{ listStyleType: 'none' }}>
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
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="">
                    <span
                        className='cursor-pointer font-thin text-small-regular hover:text-blue'
                        onClick={() => onSelect(path)}
                        onContextMenu={(e) => handleRightClick(e, path)}
                    >
                        <span className='pr-2' style={{ fontSize: "10px" }}>📄</span> {fileName}
                    </span>
                </div>
            )}

            <div style={{ ...menuStyle, position: 'fixed', backgroundColor: 'white', border: '1px solid black', zIndex: 1000 }}>
                <div style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleMenuClick('download', path)}>Download</div>
                <div style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleMenuClick('rename', path)}>Rename</div>
                <div style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleMenuClick('delete', path)}>Delete</div>
                <div style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleMenuClick('openInEditor', path)}>Open in Editor</div>
            </div>
        </div>
    );
};

const FileStructureTree = ({ onSelect, pId, searchSelectedPath, setSearchResult, searchResult }: any) => {
    const [tree, setTree] = useState<any>(null);

    useEffect(() => {
        async function fetchFileTree() {
            try {
                const response = await fetch('http://localhost:5001/files');
                const fileTree = await response.json();
                setTree(fileTree);
            } catch (err) {
                console.log("error in fetching in the recently changed file", err);
            }
        }
        fetchFileTree();

        ws.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'file:refresh') {
                fetchFileTree();
            }
        }
    }, []);

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
    );
}

export default FileStructureTree;
