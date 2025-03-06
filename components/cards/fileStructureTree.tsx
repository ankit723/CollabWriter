"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import 'devicon/devicon.min.css';
import { useWebSocket } from '@/providers/WebSocketContext';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderIcon, FileIcon, ChevronRightIcon, ChevronDownIcon,
  MoreVerticalIcon, PlusIcon, TrashIcon, EditIcon, FolderPlusIcon
} from 'lucide-react';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const iconMapping: { [key: string]: string } = {
  js: 'devicon-javascript-plain colored',
  py: 'devicon-python-plain colored',
  java: 'devicon-java-plain colored',
  html: 'devicon-html5-plain colored',
  css: 'devicon-css3-plain colored',
  json: 'devicon-json-plain colored',
  jsx: 'devicon-react-plain colored',
  ts: 'devicon-typescript-plain colored',
  tsx: 'devicon-typescript-plain colored',
  md: 'devicon-markdown-plain colored',
  php: 'devicon-php-plain colored',
  sql: 'devicon-mysql-plain colored',
  ruby: 'devicon-ruby-plain colored',
  go: 'devicon-go-plain colored',
  c: 'devicon-c-plain colored',
  cpp: 'devicon-cplusplus-plain colored',
  'c++': 'devicon-cplusplus-plain colored',
  abap: 'devicon-devicon-plain colored',
  abc: 'devicon-devicon-plain colored',
  actionscript: 'devicon-devicon-plain colored',
  ada: 'devicon-devicon-plain colored',
  alda: 'devicon-devicon-plain colored',
  apache_conf: 'devicon-apache-plain colored',
  apex: 'devicon-devicon-plain colored',
  applescript: 'devicon-apple-plain colored',
  aql: 'devicon-devicon-plain colored',
  asciidoc: 'devicon-devicon-plain colored',
  asl: 'devicon-devicon-plain colored',
  assembly_arm32: 'devicon-devicon-plain colored',
  assembly_x86: 'devicon-devicon-plain colored',
  astro: 'devicon-devicon-plain colored',
  autohotkey: 'devicon-devicon-plain colored',
  batchfile: 'devicon-windows8-original',
  bibtex: 'devicon-devicon-plain colored',
  c9search: 'devicon-devicon-plain colored',
  c_cpp: 'devicon-cplusplus-plain colored',
  cirru: 'devicon-devicon-plain colored',
  clojure: 'devicon-clojure-plain colored',
  cobol: 'devicon-devicon-plain colored',
  coffee: 'devicon-coffeescript-plain colored',
  coldfusion: 'devicon-devicon-plain colored',
  crystal: 'devicon-devicon-plain colored',
  csharp: 'devicon-csharp-plain colored',
  csound_document: 'devicon-devicon-plain colored',
  csound_orchestra: 'devicon-devicon-plain colored',
  csound_score: 'devicon-devicon-plain colored',
  csp: 'devicon-devicon-plain colored',
  curly: 'devicon-devicon-plain colored',
  cuttlefish: 'devicon-devicon-plain colored',
  d: 'devicon-d-plain colored',
  dart: 'devicon-dart-plain colored',
  diff: 'devicon-devicon-plain colored',
  django: 'devicon-django-plain colored',
  dockerfile: 'devicon-docker-plain colored',
  dot: 'devicon-graphviz-plain colored',
  drools: 'devicon-devicon-plain colored',
  edifact: 'devicon-devicon-plain colored',
  eiffel: 'devicon-devicon-plain colored',
  ejs: 'devicon-devicon-plain colored',
  elixir: 'devicon-elixir-plain colored',
  elm: 'devicon-elm-plain colored',
  erlang: 'devicon-erlang-plain colored',
  flix: 'devicon-devicon-plain colored',
  forth: 'devicon-devicon-plain colored',
  fortran: 'devicon-devicon-plain colored',
  fsharp: 'devicon-fsharp-plain colored',
  fsl: 'devicon-devicon-plain colored',
  ftl: 'devicon-devicon-plain colored',
  gcode: 'devicon-devicon-plain colored',
  gherkin: 'devicon-devicon-plain colored',
  gitignore: 'devicon-git-plain colored',
  glsl: 'devicon-devicon-plain colored',
  gobstones: 'devicon-devicon-plain colored',
  graphqlschema: 'devicon-graphql-plain colored',
  groovy: 'devicon-groovy-plain colored',
  haml: 'devicon-devicon-plain colored',
  handlebars: 'devicon-handlebars-plain colored',
  haskell: 'devicon-haskell-plain colored',
  haskell_cabal: 'devicon-devicon-plain colored',
  haxe: 'devicon-devicon-plain colored',
  hjson: 'devicon-devicon-plain colored',
  html_elixir: 'devicon-html5-plain colored',
  html_ruby: 'devicon-html5-plain colored',
  ini: 'devicon-devicon-plain colored',
  io: 'devicon-devicon-plain colored',
  ion: 'devicon-devicon-plain colored',
  jack: 'devicon-devicon-plain colored',
  jade: 'devicon-devicon-plain colored',
  jexl: 'devicon-devicon-plain colored',
  json5: 'devicon-json-plain colored',
  jsoniq: 'devicon-devicon-plain colored',
  jsp: 'devicon-devicon-plain colored',
  jssm: 'devicon-devicon-plain colored',
  julia: 'devicon-julia-plain colored',
  kotlin: 'devicon-kotlin-plain colored',
  latex: 'devicon-latex-plain colored',
  latte: 'devicon-devicon-plain colored',
  less: 'devicon-less-plain colored-wordmark',
  liquid: 'devicon-devicon-plain colored',
  lisp: 'devicon-devicon-plain colored',
  livescript: 'devicon-devicon-plain colored',
  logiql: 'devicon-devicon-plain colored',
  logtalk: 'devicon-devicon-plain colored',
  lsl: 'devicon-devicon-plain colored',
  lua: 'devicon-lua-plain colored',
  luapage: 'devicon-devicon-plain colored',
  lucene: 'devicon-devicon-plain colored',
  makefile: 'devicon-devicon-plain colored',
  mask: 'devicon-devicon-plain colored',
  matlab: 'devicon-matlab-plain colored',
  maze: 'devicon-devicon-plain colored',
  mediawiki: 'devicon-devicon-plain colored',
  mel: 'devicon-devicon-plain colored',
  mips: 'devicon-devicon-plain colored',
  mixal: 'devicon-devicon-plain colored',
  mushcode: 'devicon-devicon-plain colored',
  mysql: 'devicon-mysql-plain colored',
  nasal: 'devicon-devicon-plain colored',
  nginx: 'devicon-nginx-plain colored',
  nim: 'devicon-devicon-plain colored',
  nix: 'devicon-devicon-plain colored',
  nsis: 'devicon-devicon-plain colored',
  nunjucks: 'devicon-devicon-plain colored',
  objectivec: 'devicon-objectivec-plain colored',
  ocaml: 'devicon-ocaml-plain colored',
  odin: 'devicon-devicon-plain colored',
  partiql: 'devicon-devicon-plain colored',
  pascal: 'devicon-devicon-plain colored',
  perl: 'devicon-perl-plain colored',
  pgsql: 'devicon-postgresql-plain colored',
  php_laravel_blade: 'devicon-laravel-plain colored',
  pig: 'devicon-devicon-plain colored',
  plain_text: 'devicon-devicon-plain colored',
  txt: 'devicon-devicon-plain colored',
  plsql: 'devicon-devicon-plain colored',
  powershell: 'devicon-devicon-plain colored',
  praat: 'devicon-devicon-plain colored',
  prisma: 'devicon-devicon-plain colored',
  prolog: 'devicon-devicon-plain colored',
  properties: 'devicon-devicon-plain colored',
  protobuf: 'devicon-devicon-plain colored',
  prql: 'devicon-devicon-plain colored',
  puppet: 'devicon-puppet-plain colored',
  qml: 'devicon-devicon-plain colored',
  r: 'devicon-r-plain colored',
  raku: 'devicon-devicon-plain colored',
  razor: 'devicon-devicon-plain colored',
  rdoc: 'devicon-devicon-plain colored',
  red: 'devicon-devicon-plain colored',
  redshift: 'devicon-devicon-plain colored',
  rhtml: 'devicon-devicon-plain colored',
  robot: 'devicon-devicon-plain colored',
  rst: 'devicon-devicon-plain colored',
  rust: 'devicon-rust-plain colored',
  sac: 'devicon-devicon-plain colored',
  sass: 'devicon-sass-plain colored',
  scad: 'devicon-devicon-plain colored',
  scala: 'devicon-scala-plain colored',
  scheme: 'devicon-devicon-plain colored',
  scrypt: 'devicon-devicon-plain colored',
  scss: 'devicon-sass-original',
  sh: 'devicon-linux-plain colored',
  sjs: 'devicon-devicon-plain colored',
  slim: 'devicon-devicon-plain colored',
  smarty: 'devicon-devicon-plain colored',
  smithy: 'devicon-devicon-plain colored',
  snippets: 'devicon-devicon-plain colored',
  soy_template: 'devicon-devicon-plain colored',
  space: 'devicon-devicon-plain colored',
  sparql: 'devicon-devicon-plain colored',
  sqlserver: 'devicon-microsoftsqlserver-plain colored',
  stylus: 'devicon-stylus-plain colored',
  svg: 'devicon-devicon-plain colored',
  swift: 'devicon-swift-plain colored',
  tcl: 'devicon-devicon-plain colored',
  terraform: 'devicon-devicon-plain colored',
  tex: 'devicon-devicon-plain colored',
  text: 'devicon-devicon-plain colored',
  textile: 'devicon-devicon-plain colored',
  toml: 'devicon-devicon-plain colored',
  turtle: 'devicon-devicon-plain colored',
  twig: 'devicon-devicon-plain colored',
  vala: 'devicon-devicon-plain colored',
  vbscript: 'devicon-devicon-plain colored',
  velocity: 'devicon-devicon-plain colored',
  verilog: 'devicon-devicon-plain colored',
  vhdl: 'devicon-devicon-plain colored',
  visualforce: 'devicon-devicon-plain colored',
  vue: 'devicon-vuejs-plain colored',
  wollok: 'devicon-devicon-plain colored',
  xml: 'devicon-devicon-plain colored',
  xquery: 'devicon-devicon-plain colored',
  yaml: 'devicon-devicon-plain colored',
  zeek: 'devicon-devicon-plain colored',
  zig: 'devicon-devicon-plain colored',
};

// Add proper TypeScript interfaces
interface FileTreeNodeProps {
  fileName: string;
  nodes: Record<string, any> | null;
  onSelect: (path: string) => void;
  path: string;
  searchSelectedPath: string;
  setSearchResult: (results: string[]) => void;
  searchResult: string[];
  pId: string;
  newFolderCreatedPath: string | null;
  setNewFolderCreatedPath: (path: string | null) => void;
  newFileCreatedPath: string | null;
  setNewFileCreatedPath: (path: string | null) => void;
  isDarkMode: boolean;
  docName: string;
}

interface FileStructureTreeProps {
  onSelect: (path: string) => void;
  pId: string;
  searchSelectedPath: string;
  setSearchResult: (results: string[]) => void;
  searchResult: string[];
  docName: string;
  isDarkMode: boolean;
}

// File type for drag and drop
const ItemTypes = {
  FILE: 'file',
  FOLDER: 'folder'
};

const FileTreeNode = ({ 
  fileName, 
  nodes, 
  onSelect, 
  path, 
  searchSelectedPath, 
  setSearchResult, 
  searchResult, 
  pId,
  docName,
  isDarkMode,
  newFolderCreatedPath,
  setNewFolderCreatedPath,
  newFileCreatedPath,
  setNewFileCreatedPath
}: FileTreeNodeProps) => {
  const { sendMessage } = useWebSocket();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(fileName);
  const [isCreatingNew, setIsCreatingNew] = useState<'file' | 'folder' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isFolder = nodes !== null;
  
  // Clean path for file selection (ONLY the actual path)
  const selectPath = path 
    ? path.replace(`user/${pId}`, '')
         .replace(`${pId}`, '')
         .replace(`${docName}`, '')
         .replace(/^\/+/, '') + `/${fileName}`
    : fileName === docName ? '' : fileName;

  // Path for file operations with user/pId prefix
  const operationPath = path 
    ? `user/${pId}${selectPath}`
    : fileName === docName 
      ? `user/${pId}` 
      : `user/${pId}/${fileName}`;

  // For debugging
  console.log({
    fileName,
    path,
    operationPath,
    selectPath,
    pId,
    docName
  });

  // Drag and Drop setup
  const [{ isDragging }, drag] = useDrag(() => ({
    type: isFolder ? ItemTypes.FOLDER : ItemTypes.FILE,
    item: { type: isFolder ? ItemTypes.FOLDER : ItemTypes.FILE, path: operationPath },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.FILE, ItemTypes.FOLDER],
    drop: (item: { type: string; path: string }, monitor) => {
      if (monitor.didDrop()) return;
      handleDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }), [operationPath]);

  const handleDrop = async (item: { type: string; path: string }) => {
    if (item.path === operationPath || item.path.startsWith(`${operationPath}/`)) return;
    
    try {
      const newPath = `${operationPath}/${item.path.split('/').pop()}`;
      await sendMessage({
        type: 'file:move',
        data: {
          oldPath: item.path,
          newPath,
          pId
        }
      });
      toast.success('Item moved successfully');
    } catch (error) {
      toast.error('Failed to move item');
    }
  };

  // Combine drag and drop refs
  const dragDropRef = useCallback((node: HTMLDivElement) => {
    drag(node);
    drop(node);
  }, [drag, drop]);

  const handleRename = async () => {
    if (newName === fileName || !newName.trim()) {
      setIsRenaming(false);
      return;
    }

    try {
      const oldPath = operationPath;
      const newPath = path ? `${path}/${newName}` : `${pId}/${newName}`;
      
      await sendMessage({
        type: 'file:rename',
        data: { oldPath, newPath, pId }
      });
      
      setIsRenaming(false);
      toast.success('Renamed successfully');
    } catch (error) {
      toast.error('Failed to rename');
      setNewName(fileName);
    }
  };

  const handleDelete = async () => {
    try {
      await sendMessage({
        type: isFolder ? 'folder:delete' : 'file:delete',
        data: { filePath: operationPath, pId }
      });
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleCreateNew = async (type: 'file' | 'folder') => {
    if (!newItemName.trim()) {
      setIsCreatingNew(null);
      return;
    }

    try {
      const newPath = `${operationPath}/${newItemName}`;
      await sendMessage({
        type: type === 'file' ? 'file:create' : 'folder:create',
        data: { filePath: newPath }
      });
      
      setIsCreatingNew(null);
      setNewItemName('');
      setIsExpanded(true);
      if (type === 'file') {
        setNewFileCreatedPath(`${selectPath}/${newItemName}`);
      } else {
        setNewFolderCreatedPath(`${selectPath}/${newItemName}`);
      }
      toast.success(`${type === 'file' ? 'File' : 'Folder'} created successfully`);
    } catch (error) {
      toast.error('Failed to create');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'file' | 'folder') => {
    if (e.key === 'Enter') {
      handleCreateNew(type);
    } else if (e.key === 'Escape') {
      setIsCreatingNew(null);
      setNewItemName('');
    }
  };

  return (
    <motion.div className="relative">
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            ref={dragDropRef}
            className={cn(
              "flex items-center py-[1px] px-[2px] rounded-none group relative",
              isDarkMode 
                ? "hover:bg-[#37373d]" 
                : "hover:bg-[#f0f0f0]",
              "cursor-pointer select-none",
              isOver && (isDarkMode ? "bg-[#2a2d2e]" : "bg-[#e8e8e8]"),
              isDragging && "opacity-50",
              searchSelectedPath === selectPath && fileName !== docName && 
                cn(
                  "before:absolute before:left-0 before:top-0 before:h-full before:w-[2px]",
                  isDarkMode 
                    ? "bg-[#37373d] before:bg-[#0078d4]" 
                    : "bg-[#e8e8e8] before:bg-[#0366d6]"
                )
            )}
            onClick={() => isFolder ? setIsExpanded(!isExpanded) : onSelect(selectPath)}
          >
            <div className="flex items-center gap-[6px] w-full">
              {isFolder && (
                <ChevronRightIcon
                  size={16}
                  className={cn(
                    "transition-transform shrink-0",
                    isExpanded && "transform rotate-90"
                  )}
                />
              )}
              
              {isFolder ? (
                <FolderIcon size={16} className="text-[#dcb67a] shrink-0" />
              ) : (
                <span className="shrink-0">
                  {iconMapping[fileName.split('.').pop() || ''] ? (
                    <i className={`${iconMapping[fileName.split('.').pop() || '']} text-[16px]`} />
                  ) : (
                    <FileIcon size={16} className="text-[#8a8a8a]" />
                  )}
                </span>
              )}

              {isRenaming ? (
                <Input
                  ref={inputRef}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                  className="h-5 py-0 px-1"
                  autoFocus
                />
              ) : (
                <span className="truncate text-sm">{fileName}</span>
              )}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent 
          className={cn(
            "min-w-[180px] p-[4px] rounded-none",
            isDarkMode 
              ? "bg-[#252526] border-[#323232] text-[#cccccc]" 
              : "bg-[#ffffff] border-[#e1e4e8] text-[#24292e]",
            "border shadow-lg"
          )}
        >
          <ContextMenuItem 
            className={cn(
              "flex items-center px-2 py-1 text-sm rounded-sm",
              isDarkMode
                ? "hover:bg-[#37373d] focus:bg-[#37373d]"
                : "hover:bg-[#f0f0f0] focus:bg-[#f0f0f0]",
              "cursor-pointer"
            )}
            onClick={() => setIsRenaming(true)}
          >
            <EditIcon size={14} className="mr-2" />
            <span className="flex-grow">Rename</span>
            <ContextMenuShortcut className="text-xs text-muted-foreground ml-auto">
              F2
            </ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem 
            className={cn(
              "flex items-center px-2 py-1 text-sm rounded-sm",
              "hover:bg-[#f0f0f0] dark:hover:bg-[#37373d]",
              "focus:bg-[#f0f0f0] dark:focus:bg-[#37373d]",
              "cursor-pointer text-red-600 dark:text-red-400"
            )}
            onClick={handleDelete}
          >
            <TrashIcon size={14} className="mr-2" />
            <span className="flex-grow">Delete</span>
            <ContextMenuShortcut className="text-xs text-muted-foreground ml-auto">
              Del
            </ContextMenuShortcut>
          </ContextMenuItem>

          {isFolder && (
            <>
              <ContextMenuSeparator className="my-1 h-[1px] bg-[#e1e4e8] dark:bg-[#323232]" />
              <ContextMenuItem 
                className={cn(
                  "flex items-center px-2 py-1 text-sm rounded-sm",
                  "hover:bg-[#f0f0f0] dark:hover:bg-[#37373d]",
                  "focus:bg-[#f0f0f0] dark:focus:bg-[#37373d]",
                  "cursor-pointer"
                )}
                onClick={() => setIsCreatingNew('file')}
              >
                <PlusIcon size={14} className="mr-2" />
                <span className="flex-grow">New File</span>
                <ContextMenuShortcut className="text-xs text-muted-foreground ml-auto">
                  Ctrl+N
                </ContextMenuShortcut>
              </ContextMenuItem>

              <ContextMenuItem 
                className={cn(
                  "flex items-center px-2 py-1 text-sm rounded-sm",
                  "hover:bg-[#f0f0f0] dark:hover:bg-[#37373d]",
                  "focus:bg-[#f0f0f0] dark:focus:bg-[#37373d]",
                  "cursor-pointer"
                )}
                onClick={() => setIsCreatingNew('folder')}
              >
                <FolderPlusIcon size={14} className="mr-2" />
                <span className="flex-grow">New Folder</span>
                <ContextMenuShortcut className="text-xs text-muted-foreground ml-auto">
                  Ctrl+Shift+N
                </ContextMenuShortcut>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      {isCreatingNew && (
        <div className="ml-[24px] mt-[1px]">
          <div className="flex items-center gap-1">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={() => handleCreateNew(isCreatingNew)}
              onKeyDown={(e) => handleKeyDown(e, isCreatingNew)}
              placeholder={`Enter ${isCreatingNew} name...`}
              className={cn(
                "h-5 py-0 px-1 text-sm",
                isDarkMode
                  ? "bg-[#3c3c3c] border-[#3c3c3c] text-[#cccccc]"
                  : "bg-[#ffffff] border-[#e1e4e8] text-[#24292e]"
              )}
              autoFocus
            />
            <button
              onClick={() => {
                setIsCreatingNew(null);
                setNewItemName('');
              }}
              className={cn(
                "text-xs px-2 py-0.5 rounded-sm",
                isDarkMode
                  ? "text-[#cccccc] hover:bg-[#37373d]"
                  : "text-[#24292e] hover:bg-[#f0f0f0]"
              )}
            >
              Cancel
            </button>
          </div>
          <div className="text-xs text-[#6a737d] mt-[2px]">
            Press &apos;Enter&apos; to confirm or &apos;Esc&apos; to cancel
          </div>
        </div>
      )}

      <AnimatePresence>
        {isFolder && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-[8px]"
          >
            {Object.entries(nodes).map(([name, node]) => (
              <FileTreeNode
                key={name}
                fileName={name}
                nodes={node}
                onSelect={onSelect}
                path={operationPath}
                searchSelectedPath={searchSelectedPath}
                setSearchResult={setSearchResult}
                searchResult={searchResult}
                pId={pId}
                docName={docName}
                isDarkMode={isDarkMode}
                newFolderCreatedPath={newFolderCreatedPath}
                setNewFolderCreatedPath={setNewFolderCreatedPath}
                newFileCreatedPath={newFileCreatedPath}
                setNewFileCreatedPath={setNewFileCreatedPath}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FileStructureTree = ({
  onSelect,
  pId,
  searchSelectedPath,
  setSearchResult,
  searchResult,
  docName,
  isDarkMode
}: FileStructureTreeProps) => {
  const [tree, setTree] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newFolderCreatedPath, setNewFolderCreatedPath] = useState<string | null>(null);
  const [newFileCreatedPath, setNewFileCreatedPath] = useState<string | null>(null);
  const { socket } = useWebSocket();
  const lastRefreshTime = useRef<number>(Date.now());
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchFileTree = useCallback(async () => {
    try {
      setIsLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://34.68.33.225';
      const response = await fetch(`${backendUrl}/files?pId=${pId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fileTree = await response.json();
      setTree(fileTree);
      lastRefreshTime.current = Date.now();
    } catch (err) {
      console.error("Error fetching file tree:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch file tree');
    } finally {
      setIsLoading(false);
    }
  }, [pId]);

  // Debounced refresh function
  const debouncedRefresh = useCallback(() => {
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }

    // Only refresh if enough time has passed since last refresh
    if (Date.now() - lastRefreshTime.current > 1000) {
      fetchFileTree();
    } else {
      refreshTimeout.current = setTimeout(fetchFileTree, 1000);
    }
  }, [fetchFileTree]);

  useEffect(() => {
    fetchFileTree();

    const handleWebSocketMessage = async (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "file:refresh") {
          debouncedRefresh();
        }
      } catch (err) {
        console.error("Error handling WebSocket message:", err);
      }
    };

    if (socket) {
      socket.addEventListener('message', handleWebSocketMessage);
      return () => {
        socket.removeEventListener('message', handleWebSocketMessage);
        if (refreshTimeout.current) {
          clearTimeout(refreshTimeout.current);
        }
      };
    }
  }, [socket, debouncedRefresh]);

  // Handle file selection
  const handleFileSelect = useCallback((path: string) => {
    if (onSelect) {
      onSelect(path);
      // Refresh the file tree after a short delay
      setTimeout(debouncedRefresh, 100);
    }
  }, [onSelect, debouncedRefresh]);

  if (isLoading && !tree) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>Error loading file structure: {error}</p>
        <button 
          onClick={fetchFileTree}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!tree?.tree?.[pId]) {
    return (
      <div className="p-4 text-gray-500">
        No files found
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-2"
        >
          <FileTreeNode
            fileName={docName}  // Using docName for display
            nodes={tree?.tree?.[pId]}  // Using pId for data structure
            onSelect={handleFileSelect}
            path=""
            searchSelectedPath={searchSelectedPath}
            setSearchResult={setSearchResult}
            searchResult={searchResult}
            pId={pId}
            docName={docName}
            isDarkMode={isDarkMode}
            newFolderCreatedPath={newFolderCreatedPath}
            setNewFolderCreatedPath={setNewFolderCreatedPath}
            newFileCreatedPath={newFileCreatedPath}
            setNewFileCreatedPath={setNewFileCreatedPath}
          />
        </motion.div>
      </div>
    </DndProvider>
  );
};

export default FileStructureTree;
