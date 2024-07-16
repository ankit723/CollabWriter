"use client";

import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import { fetchProject, updateDocumentTitleDescription } from "@/lib/actions/document.action";
import Terminal from "@/components/forms/terminal";
import FileStructureTree from "@/components/cards/fileStructureTree";
import CodeEditor from "@/components/forms/codeEditor";
import { useCallback, useEffect, useState, useRef } from "react";
import { Replace } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Tabs from "@/components/cards/tabs";

const ws = new WebSocket(
  process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || "ws://localhost:5001"
);

const themes = [
  'monokai', 'github', 'ext-language_tools',
  'ambiance', 'cloud9_night', 'chaos', 'chrome',
  'cloud9_day', 'cloud9_night_low_color', 'cloud_editor',
  'cloud_editor_dark', 'clouds', 'clouds_midnight',
  'cobalt', 'crimson_editor', 'dawn', 'dracula',
  'dreamweaver', 'eclipse', 'github_dark',
  'github_light_default', 'gob', 'gruvbox',
  'gruvbox_dark_hard', 'gruvbox_light_hard', 'idle_fingers',
  'iplastic', 'katzenmilch', 'kr_theme', 'kuroir',
  'merbivore', 'merbivore_soft', 'mono_industrial',
  'nord_dark', 'one_dark', 'pastel_on_dark',
  'solarized_dark', 'solarized_light', 'sqlserver',
  'terminal', 'textmate', 'tomorrow', 'tomorrow_night',
  'tomorrow_night_blue', 'tomorrow_night_bright',
  'tomorrow_night_eighties', 'twilight', 'vibrant_ink',
  'xcode'
];

const Page = ({ params }: { params: { id: string } }) => {
  const { user } = useUser();
  const [selectedPath, setSeletedPath] = useState<string>("");
  const [allPaths, setAllPaths] = useState<string[]>([]);
  const [selectedTabPath, setSelectedTabPath] = useState<any>(null);
  const [searchSelectedPath, setSearchSeletedPath] = useState<string>(selectedPath);
  const [project, setProject] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [docName, setDocName] = useState<string>("");
  const [docDesc, setDocDesc] = useState<string>("");
  const [showSetting, setShowSetting] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showSideBar, setShowSideBar] = useState(true);
  const [termRows, setTermRows] = useState<number>(14)

  const [selectedTheme, setSelectedTheme] = useState<any>(localStorage.getItem('editorTheme'));
  const [showThemeList, setShowThemeList] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false
  );

  const searchResultsRef = useRef<HTMLDivElement | null>(null);
  const termBox=useRef(null);
  const termBoxTop=useRef(null);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(event.target.value);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (showThemeList && !(event.target as Element)?.closest('.theme-list, .theme-toggle')) {
      setShowThemeList(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showThemeList]);

  useEffect(() => {
    if (!allPaths.includes(selectedPath)) {
      setAllPaths([...allPaths, selectedPath])
    }
  }, [selectedPath])


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('dark-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('dark-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setSelectedTabPath(allPaths[allPaths.length - 1])
  }, [allPaths])

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await fetchUser(user?.id || "");
      const cProject = await fetchProject(params.id, userInfo?._id);
      setProject(cProject?.id);
      setDocName(cProject?.title);
      setDocDesc(cProject?.desc);
      console.log(cProject.title)
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !(event.target instanceof Node && searchResultsRef.current.contains(event.target))) {
        setSearchSeletedPath("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    console.log(searchResult)
  }, [searchResult])

  useEffect(() => {
    console.log(searchSelectedPath)
  }, [searchSelectedPath])


  useEffect(() => {
    if (project) {
      ws.send(JSON.stringify({ type: "project:started", data: { id: project } }));
    }
  }, [project]);

  useEffect(() => {
    const terminalContainer: any = termBox.current;
    const resizerTop: any = termBoxTop.current;

    let height = terminalContainer?.clientHeight || 0;
    let yCord = 0;

    const onMouseMoveTopResize = (event: MouseEvent) => {
      const dy = event.clientY - yCord;
      height = height - dy;
      yCord = event.clientY;
      if (terminalContainer) {
        terminalContainer.style.height = `${height}px`;
      }
    };

    const onMouseUpTopResize = () => {
      document.removeEventListener('mousemove', onMouseMoveTopResize);
    };

    const onMouseDownTopResize = (event: MouseEvent) => {
      yCord = event.clientY;
      console.log(yCord)
      document.addEventListener('mousemove', onMouseMoveTopResize);
      document.addEventListener('mouseup', onMouseUpTopResize);
    };

    if (resizerTop) {
      resizerTop.addEventListener('mousedown', onMouseDownTopResize);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMoveTopResize);
      document.removeEventListener('mouseup', onMouseUpTopResize);
      if (resizerTop) {
        resizerTop.removeEventListener('mousedown', onMouseDownTopResize);
      }
    };
  }, []);


  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setDocName(newTitle);
    if (project) {
      await updateDocumentTitleDescription(params.id, docName, docDesc);
    }
  };

  return (
    <div className="custom-scrollbar w-screen">
      <header className={`grid grid-cols-3 items-center py-1 px-8 ${isDarkMode ? 'bg-black-1 text-white-1' : 'bg-white-1 text-black-1'}`} style={{ borderBottom: isDarkMode ? '0.5px solid rgba(255, 255, 255, 0.4)' : '0.5px solid rgba(0, 0, 0, 0.4)' }}>
        <div className='flex cursor-pointer items-center gap-1 max-lg:justify-center'>
          <Link href="/"><Image src="/icons/logo.png" alt="Podcast Logo" width={20} height={20} /></Link>
          <div className={`${isDarkMode? "text-white-1" : "text-black-1"} flex flex-col items-start justify-center w-full`}>
            <div className="flex gap-2 flex-grow-1">
              <input type='text' className='bg-transparent px-3' value={docName} onChange={handleTitleChange} />
            </div>
          </div>
        </div>
        <div className="relative w-full bg-white-1">
          <div className={`w-full absolute ${isDarkMode ? 'bg-black-2' : 'bg-gray-200'} top-[-0.8rem] z-10 rounded-lg`} style={{ border: "0.5px solid rgba(255, 255, 255, 0.4)" }} ref={searchResultsRef}>
            <div className="relative" style={{ fontSize: "12px" }}>
              <p className="absolute top-1 left-5">🔎</p>
              <input
                type="text"
                value={searchSelectedPath}
                placeholder={selectedPath}
                className={`${isDarkMode? "bg-black-2" : "bg-white-2"}  rounded-lg text-center w-full p-[2px]`}
                style={{ border: isDarkMode ? '0.5px solid rgba(255, 255, 255, 0.4)' : '0.5px solid rgba(0, 0, 0, 0.4)' }}
                onChange={(e) => setSearchSeletedPath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSeletedPath(searchSelectedPath);
                  }
                }}
              />
            </div>
            {searchResult.length !== 0 && searchResult.map((res: string, index: number) => (
              <p
                key={index}
                className={`${isDarkMode ? 'text-white-1' : 'text-black-1'} cursor-pointer hover:bg-orange-1 rounded-b-lg px-5 py-1 text-small-regular`}
                onClick={() => {
                  setSeletedPath(res);
                  setSearchSeletedPath("");
                }}
              >
                {res}
              </p>
            ))}
          </div>
        </div>
        <div className="relative w-full flex justify-end items-center">
          <Image
            src={isDarkMode
              ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw7B6uZ6KGbEW1RqetJeXnUlPDFvEDLihjZw&s" : "https://w7.pngwing.com/pngs/326/635/png-transparent-black-gear-motorcycle-gears-s-computer-website-bicycle-gearing-thumbnail.png"
            }
            alt="Settings"
            className="w-4 h-4 cursor-pointer"
            onClick={() => setShowSetting(!showSetting)}
            width={14}
            height={14}
          />
          {showSetting && (
            <div className={`absolute right-0 top-10 ${isDarkMode ? 'bg-black-3 ' : 'bg-white-3 '} border border-gray-300 shadow-lg p-4 rounded-md z-50 w-[300px]`}>
              <h3 className="text-lg font-semibold mb-2">Manage Themes</h3>
              <div
                className="theme-toggle bg-orange-1 px-2 rounded-lg cursor-pointer"
                onClick={() => setShowThemeList(!showThemeList)}
              >
                {showThemeList ? '<' : '>'} {selectedTheme}
              </div>
              {showThemeList && (
                <div className="theme-list absolute right-full w-[300px] top-0 bg-black border border-gray-300 shadow-lg p-4 rounded-md z-50 max-h-[300px] overflow-y-scroll custom-scrollbar">
                  <h3 className="text-lg font-semibold mb-2">Select Theme</h3>
                  <div className="theme-options">
                    {themes.map((theme) => (
                      <div
                        key={theme}
                        className={`theme-option px-2 py-1 cursor-pointer ${selectedTheme === theme ? 'bg-orange-2 border-b-2 border-orange-1' : 'border-b border-black-4'}`}
                        onClick={() => {
                          setSelectedTheme(theme);
                          setShowThemeList(false);
                        }}
                      >
                        {theme}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center mb-4 mt-2">
                <h3 className={`text-small-regular mr-2 ${!isDarkMode ? 'text-black-2' : 'text-white-2'}`}>
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </h3>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                  className="toggle-checkbox"
                />
              </div>

              <div className="w-full flex justify-end items-center">
                <button className="bg-orange-1 mt-4 px-2 rounded-lg" onClick={() => {
                  localStorage.setItem('editorTheme', selectedTheme)
                  setShowSetting(!showSetting)
                }}>Save</button>
              </div>
            </div>
          )}
        </div>

      </header>


      <div className={`main-container flex ${isDarkMode ? "text-white-1" : "text-black-1"}`}>
        {/* Sidebar */}

        <div className={`w-[290px] ${isDarkMode ? 'bg-black-3' : 'bg-white-1'} h-[96vh] py-3 px-3 flex flex-col ${showSideBar ? "flex" : "hidden"}`} style={{ borderRight: isDarkMode ? "0.5px solid rgba(255, 255, 255, 0.4)" : "0.5px solid rgba(0, 0, 0, 0.4)" }}>
          <div className="w-full flex justify-between items-center px-4 mb-7 mt-2">
            <p className={`${isDarkMode ? 'text-white-2' : 'text-black-1'} text-small-regular m-0`}>Explorer</p>
            <Image src='/icons/hamburger.svg' alt="hamburger" width={25} height={25} className={`${isDarkMode? "hover:bg-white-2":" bg-gray-300 hover:bg-black-2 "} rounded-full cursor-pointer p-1`} onClick={() => setShowSideBar(!showSideBar)} />
          </div>
          <div className="overflow-y-scroll custom-scrollbar">
            {docName !== "" ? (
              <FileStructureTree
                onSelect={(path: string) => setSeletedPath(path)}
                pId={project}
                searchSelectedPath={searchSelectedPath}
                searchResult={searchResult}
                setSearchResult={setSearchResult}
                docName={docName ? docName : docName}
              />
            ) : ""}
          </div>
        </div>

        <div className={`absolute bg-transparent top-0 m-2 z-10 cursor-pointer ${!showSideBar ? "block" : "hidden"}`} onClick={() => setShowSideBar(!showSideBar)}>
          <Image src='/icons/hamburger.svg' alt="hamburger" width={18} height={18} className={"cursor-pointer text-white-1"} />
        </div>

        {/* CodeContainer */}

        <div className="code-container w-full flex flex-col justify-between h-[95vh]">
          <div className={`h-full editor ${isDarkMode ? 'bg-black-1' : 'bg-gray-100'}`}>
            {selectedTabPath && (
              <div className="h-full">
                <div className={`tabs-section w-full ${isDarkMode ? "bg-black-3" : "bg-white-3"} flex`}>
                  {allPaths.map((paths: any) => (
                    <>
                      {paths !== "" ?
                        <Tabs filePath={paths} isActive={paths === selectedTabPath} setSelectedTabPath={setSelectedTabPath} /> : ""
                      }
                    </>
                  ))}
                </div>
                {selectedTabPath ? (
                  <CodeEditor path={selectedTabPath} pId={project} selectedTheme={selectedTheme} />
                ) : ""}
              </div>
            )}
          </div>

          <div ref={termBox} className={`terminal-container relative ${selectedTabPath ? "mt-7" : ""}`} style={{ borderTop: isDarkMode ? "0.5px solid rgba(255, 255, 255, 0.4)" : "0.5px solid rgba(0, 0, 0, 0.4)" }}>
            <div ref={termBoxTop} className="resizer rt absolute top-0 left-0 w-full cursor-row-resize h-1 hover:h-[2px] hover:bg-orange-1 "></div>
            <div className={`w-full ${isDarkMode ? "bg-black-3 text-white-1":"bg-white-2 text-black-1"}  flex justify-between items-center  px-5 ${showTerminal ? 'py-2' : "py-0"}`}>
              <p style={{ borderBottom: "0.5px solid #877EFF", fontSize: "12px", margin: "0" }}>TERMINAL</p>
              <p className={`${showTerminal ? "-mt-2" : "mt-0"} cursor-pointer`} style={{ fontSize: "20px" }} onClick={() => setShowTerminal(!showTerminal)}>{showTerminal ? '⌄' : '˄'}</p>
            </div>
            {showTerminal ? (
              <Terminal />
            ) : ""}
            {showTerminal && project?(
              <Terminal pId={project}/>
            ):""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
