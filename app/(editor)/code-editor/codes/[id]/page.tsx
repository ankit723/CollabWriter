"use client";

import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import { fetchProject, updateDocumentTitleDescription } from "@/lib/actions/document.action";
import Terminal from "@/components/forms/terminal";
import FileStructureTree from "@/components/cards/fileStructureTree";
import CodeEditor from "@/components/forms/codeEditor";
import { useCallback, useEffect, useState, useRef, SetStateAction } from "react";
import { Replace } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Tabs from "@/components/cards/tabs";
import { AnyCnameRecord } from "dns";
import TerminalTabs from "@/components/cards/terminalTabs";

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
const themeEnhancerLight = [
  'light-1',
  'light-2',
  'light-3',
  'light-4',
  'white-1',
];
const themeEnhancerDark = [
  'dark-1', 'dark-3', 'black-1',
  'black-2',
  'black-3',
  'black-4',
  'black-5',
  'black-6',
  'black-7',
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
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem('editorTheme');
    return savedTheme || 'monokai';
  });
  const [showThemeList, setShowThemeList] = useState(false);
  const [showThemeEnhancer, setShowThemeEnhancer] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false
  );
  const [selectedThemeEnhancer, setselectedShowThemeEnhancer] = useState<any>(() => {
    const storedEnhancer = localStorage.getItem('themeenhancer');
    if (storedEnhancer) {
      return storedEnhancer;
    }
    return isDarkMode ? 'black-1' : 'light-1';
  });
  const [showThemeManager, setShowThemeManager] = useState(false);
  const [searchSelectedTheme, setSearchSeletedTheme] = useState<string>("");
  const [searchSelectedThemeEnhancer, setSearchSeletedThemeEnhancer] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredThemes, setFilteredThemes] = useState(themes);

  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);

  const searchResultsRef = useRef<HTMLDivElement | null>(null);
  const termBox = useRef(null);
  const termBoxTop = useRef(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  const [rightSidebarWidth, setRightSidebarWidth] = useState(250);
  const rightSidebarRef = useRef<HTMLDivElement | null>(null);
  const rightResizerRef = useRef<HTMLDivElement | null>(null);

  const [terminal, setTerminal]=useState([0])
  const [terminalNumber, setTerminalNumber]=useState(0)
  const [currentTerminal, setCurrentTerminal]=useState(0)


  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    localStorage.setItem('editorTheme', newTheme);
  };


  useEffect(() => {
    const savedTheme = localStorage.getItem('editorTheme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);


  const handleClickOutside = (event: MouseEvent) => {
    if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
      setSearchSeletedPath("");
    }
    if (showThemeList && !(event.target as Element)?.closest('.theme-list, .theme-toggle,.themeinput')) {
      setShowThemeList(false);
    }
    if (showThemeEnhancer && !(event.target as Element)?.closest('.theme-list, .theme-toggle, .themeinput')) {
      setShowThemeEnhancer(false);
    }
    if (showThemeManager && !(event.target as Element)?.closest('.theme-list, .theme-toggle, .theme-manager')) {
      setShowThemeManager(false);
    }
    if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
      setShowSetting(false);
    }

  };




  const handleThemeEnhancerChange = (value: string) => {
    setselectedShowThemeEnhancer(value);
    localStorage.setItem('themeenhancer', value);
  };

  const handleThemeEnhancerClick = (value: string) => {
    handleThemeEnhancerChange(value);
    setSearchSeletedThemeEnhancer("");
  };

  useEffect(() => {
    const defaultEnhancer = isDarkMode ? 'black-1' : 'white-1';
    const storedEnhancer = localStorage.getItem('themeenhancer') || defaultEnhancer;
    setselectedShowThemeEnhancer(storedEnhancer);
    localStorage.setItem('themeenhancer', storedEnhancer);
  }, [isDarkMode]);



  const handleShowThemeList = () => {
    setShowThemeList(true);
    setShowThemeEnhancer(false);
  };

  const handleShowThemeEnhancer = () => {
    setShowThemeEnhancer(true);
    setShowThemeList(false);
  };


  const handleSearchInputChange = (e: any) => {
    const query = e.target.value.toLowerCase();
    setSearchInput(query);

    const filtered = themes.filter(theme => theme.toLowerCase().includes(query));
    setFilteredThemes(filtered);
  };

  const handleThemeManagerClick = () => {
    setShowThemeManager(!showThemeManager);
    setShowThemeList(false);
  };

  const handleThemeInputChange = (event: string) => {
    setSelectedTheme(event);
    localStorage.setItem('editorTheme', event);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showThemeList, showThemeEnhancer, showThemeManager]);

  useEffect(() => {
    const storedEnhancer = localStorage.getItem('themeenhancer');
    if (storedEnhancer) {
      setselectedShowThemeEnhancer(storedEnhancer);
    }
  }, []);
  useEffect(() => {
    const defaultEnhancer = isDarkMode ? 'black-1' : 'white-1';
    setselectedShowThemeEnhancer(localStorage.getItem('themeenhancer') || defaultEnhancer);
  }, [isDarkMode]);


  useEffect(() => {
    if (!allPaths.includes(selectedPath)) {
      setAllPaths([...allPaths, selectedPath])
    }
    setSelectedTabPath(selectedPath)
  }, [selectedPath])


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('dark-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setselectedShowThemeEnhancer(localStorage.getItem('themeenhancer') || 'black-1');
    } else {
      document.documentElement.setAttribute('dark-theme', 'light');
      localStorage.setItem('theme', 'light');
      setselectedShowThemeEnhancer(localStorage.getItem('themeenhancer') || 'white-1');
    }
  }, [isDarkMode]);


  useEffect(() => {
    const defaultEnhancer = isDarkMode ? 'black-1' : 'white-1';
    if (!localStorage.getItem('themeenhancer')) {
      localStorage.setItem('themeenhancer', defaultEnhancer);
    }
    setselectedShowThemeEnhancer(localStorage.getItem('themeenhancer') || defaultEnhancer);
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
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (showThemeList && !(event.target as Element)?.closest('.theme-list, .theme-toggle, .themeinput')) ||
        (showThemeEnhancer && !(event.target as Element)?.closest('.theme-enhancer, .theme-toggle, .themeinput')) ||
        (showThemeManager && !(event.target as Element)?.closest('.theme-list, .theme-toggle, .theme-manager'))
      ) {
        setShowThemeList(false);
        setShowThemeEnhancer(false);
        setShowThemeManager(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSetting(false);
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
    const terminalContainer: any = termBox.current;
    const resizerTop: any = termBoxTop.current;

    if (!terminalContainer || !resizerTop) return;

    let initialHeight = terminalContainer.clientHeight;
    let startY = 0;

    const onMouseMoveTopResize = (event: MouseEvent) => {
      const dy = startY - event.clientY;
      const newHeight = Math.max(initialHeight + dy, 100);
      terminalContainer.style.height = `${newHeight}px`;
    };

    const onMouseUpTopResize = () => {
      document.removeEventListener('mousemove', onMouseMoveTopResize);
      document.removeEventListener('mouseup', onMouseUpTopResize);
    };

    const onMouseDownTopResize = (event: MouseEvent) => {
      startY = event.clientY;
      initialHeight = terminalContainer.clientHeight;
      document.addEventListener('mousemove', onMouseMoveTopResize);
      document.addEventListener('mouseup', onMouseUpTopResize);
    };

    resizerTop.addEventListener('mousedown', onMouseDownTopResize);

    return () => {
      resizerTop.removeEventListener('mousedown', onMouseDownTopResize);
      document.removeEventListener('mousemove', onMouseMoveTopResize);
      document.removeEventListener('mouseup', onMouseUpTopResize);
    };
  }, []);





  useEffect(() => {
    const sidebarContainer: any = sidebarRef.current;
    if (!sidebarContainer) return;

    let startX = 0;
    let initialWidth = sidebarContainer.clientWidth;

    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const dx = e.clientX - startX;
        const newWidth = Math.max(Math.min(initialWidth + dx + 32, 400), 105);
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (resizerRef.current && sidebarRef.current) {
        startX = e.clientX;
        initialWidth = sidebarRef.current.getBoundingClientRect().width;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    if (resizerRef.current) {
      resizerRef.current.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (resizerRef.current) {
        resizerRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);


  {/* Right sidebar resizable */ }
  useEffect(() => {
    const rightSidebar = rightSidebarRef.current;
    if (!rightSidebar) return;

    let startX = 0;
    let initialWidth = rightSidebar.clientWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const newWidth = Math.max(Math.min(initialWidth - dx, 400), 105);
      setRightSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      initialWidth = rightSidebar.clientWidth;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    if (rightResizerRef.current) {
      rightResizerRef.current.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (rightResizerRef.current) {
        rightResizerRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);












  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setDocName(newTitle);
    if (project) {
      await updateDocumentTitleDescription(params.id, docName, docDesc);
    }
  };

  useEffect(() => {
    if (!allPaths.includes(selectedPath)) {
      setAllPaths([...allPaths, selectedPath]);
    }
    setSelectedTabPath(selectedPath);
  }, [selectedPath]);

  useEffect(() => {
    setSelectedTabPath(allPaths[allPaths.length - 1]);
  }, [allPaths]);

  const handleRemoveTab = (index: number) => {
    const newPaths = allPaths.filter((_, i) => i !== index);
    setAllPaths(newPaths);
    if (newPaths.length > 0) {
      setSelectedTabPath(newPaths[newPaths.length - 1]);
    } else {
      setSelectedTabPath(null);
    }
  };

  return (
    <div className={`custom-scrollbar w-screen ${selectedThemeEnhancer}`}>
      <header className={`grid grid-cols-3 items-center py-1 px-8 ${selectedThemeEnhancer}`} style={{ borderBottom: isDarkMode ? '0.5px solid rgba(255, 255, 255, 0.4)' : '0.5px solid rgba(0, 0, 0, 0.4)' }}>
        <div className='flex cursor-pointer items-center gap-1 max-lg:justify-center'>
          <Link href="/"><Image src="/icons/logo.png" alt="Podcast Logo" width={20} height={20} /></Link>
          <div className={`${isDarkMode ? "text-white-1" : "text-black-1"} flex flex-col items-start justify-center w-full`}>
            <div className="flex gap-2 flex-grow-1">
              <input type='text' className='bg-transparent px-3' value={docName} onChange={handleTitleChange} />
            </div>
          </div>
        </div>




        <div className={`relative w-full ${selectedThemeEnhancer}`}>
          {showThemeList ?
            (<div className={`w-full absolute ${selectedThemeEnhancer} top-[-0.8rem] z-10 rounded-lg shadow-2xl`} style={{ border: isDarkMode ? "0.5px solid rgba(255, 255, 255, 0.4)" : "0.5px solid rgba(0, 0, 0, 0.5)" }} ref={searchResultsRef}>
              <div className="relative m-2 shadow-xl" style={{ fontSize: "12px" }}>
                <p className="absolute top-1 left-5">🔎</p>
                <input
                  type="text"
                  // value={searchSelectedTheme}
                  placeholder={selectedTheme}
                  className={`${selectedThemeEnhancer} themeinput rounded-lg text-center w-full p-[2px]`}
                  style={{ border: isDarkMode ? '0.5px solid rgba(255, 255, 255, 0.4)' : '0.5px solid rgba(0, 0, 0, 0.4)', color: isDarkMode ? 'white' : 'black' }}
                  onChange={(e) => { setSearchSeletedTheme(e.target.value); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedTheme(searchSelectedTheme);
                    }
                  }}
                />
              </div>
              <div className="max-h-80 overflow-y-scroll no-scrollbar">
                {themes.length !== 0 && themes.filter((res) => res.toLowerCase().includes(searchSelectedTheme.toLowerCase())).map((res: string, index: number) => (
                  <p
                    key={index}
                    className={`${isDarkMode ? 'text-white-1' : 'text-black-1'} cursor-pointer hover:bg-orange-1 rounded-b-lg px-5 py-1 text-small-regular`}
                    onClick={() => {
                      setSelectedTheme(res);
                      setSearchSeletedTheme("");
                      handleThemeChange(res);
                    }}
                  >
                    {res}
                  </p>
                ))}
              </div>
            </div>
            ) : showThemeEnhancer ? (<div className={`w-full absolute ${selectedThemeEnhancer} themeinput top-[-0.8rem] z-10 rounded-lg shadow-2xl`} style={{ border: isDarkMode ? "0.5px solid rgba(255, 255, 255, 0.4)" : "0.5px solid rgba(0, 0, 0, 0.5)" }} ref={searchResultsRef}>
              <div className="relative m-2 shadow-xl" style={{ fontSize: "12px" }}>
                <p className="absolute top-1 left-5">🔎</p>
                <input
                  type="text"
                  // value={searchSelectedThemeEnhancer}
                  placeholder={selectedThemeEnhancer}
                  className={`${selectedThemeEnhancer} rounded-lg text-center w-full p-[2px]`}
                  style={{ border: isDarkMode ? '0.5px solid rgba(255, 255, 255, 0.4)' : '0.5px solid rgba(0, 0, 0, 0.4)', color: isDarkMode ? 'white' : 'black' }}
                  onChange={(e) => setSearchSeletedThemeEnhancer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setselectedShowThemeEnhancer(searchSelectedThemeEnhancer);

                    }
                  }}
                />
              </div>
              <div className="max-h-40 overflow-y-scroll no-scrollbar">
                {(!isDarkMode ? themeEnhancerLight : themeEnhancerDark).filter((res) => res.toLowerCase().includes(searchSelectedThemeEnhancer.toLowerCase())).map((res: string, index: number) => (
                  <p
                    key={index}
                    className={`${isDarkMode ? 'text-white-1' : 'text-black-1'} cursor-pointer hover:bg-orange-1 rounded-b-lg px-5 py-1 text-small-regular`}
                    onClick={() => { handleThemeEnhancerChange(res); }}
                  >
                    {res}
                  </p>
                ))}
              </div>
            </div>
            ) : (
              <div className={`w-full absolute ${selectedThemeEnhancer} top-[-0.8rem] z-10 rounded-lg shadow-2xl`} style={{ border: isDarkMode ? "0.5px solid rgba(255, 255, 255, 0.4)" : "0.5px solid rgba(0, 0, 0, 0.5)" }} ref={searchResultsRef}>
                <div className="relative" style={{ fontSize: "12px" }}>
                  <p className="absolute top-1 left-5">🔎</p>
                  <input
                    type="text"
                    value={searchSelectedPath}
                    placeholder={selectedPath}
                    className={`${selectedThemeEnhancer} rounded-lg text-center w-full p-[2px]`}
                    style={{ color: isDarkMode ? 'white' : 'black' }}
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
              </div>)}
        </div>



        <div className="flex items-center justify-end space-x-4">
          <Image
            src={isDarkMode
              ? "/icons/dark-theme.svg"
              : "/icons/light-theme.svg"
            }
            alt="Modes"
            className="w-4 h-4"
            width={14}
            height={14}
          />
          <h3 className={`text-small-regular mr-2 ${isDarkMode ? "text-white-2" : "text-black-2"}`}>
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </h3>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={() => {
              const newDarkMode = !isDarkMode;
              setIsDarkMode(newDarkMode);
              localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
              setSelectedTheme(newDarkMode ? 'cloud9_night_low_color' : 'xcode');
              handleThemeChange(newDarkMode ? 'cloud9_night_low_color' : 'xcode')
              handleThemeEnhancerChange(newDarkMode ? 'black-1' : 'white-1');
            }}
            className="toggle-checkbox"
          />

          <div ref={settingsRef} className="relative flex items-center">
            <Image
              src={isDarkMode
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw7B6uZ6KGbEW1RqetJeXnUlPDFvEDLihjZw&s"
                : "https://w7.pngwing.com/pngs/326/635/png-transparent-black-gear-motorcycle-gears-s-computer-website-bicycle-gearing-thumbnail.png"
              }
              alt="Settings"
              className="w-4 h-4 cursor-pointer"
              onClick={() => setShowSetting(!showSetting)}
              width={14}
              height={14}
            />
            {showSetting && (
              <div className={`themesetting ${isDarkMode ? "text-white-3" : "text-black-1"} absolute right-0 top-8 border border-black-3 shadow-2xl px-1 py-1 rounded-md z-50 right-clicks-modals w-[200px]`} style={{ color: "whitesmoke" }}>
                <p className="text-small-regular cursor-pointer px-2 hover:bg-orange-1 hover:text-white-1 rounded-sm" onClick={handleThemeManagerClick}>{showThemeManager ? ">" : "<"} Manage Themes</p>
                {showThemeManager && (

                  <div className={`themesetting ${isDarkMode ? "text-white-3" : "text-black-1"} absolute top-2 right-clicks-modals left-[-200px] border border-gray-300 px-1 py-1 rounded-md w-[200px] max-h-[300px] overflow-y-scroll no-scrollbar shadow-2xl`} style={{ color: "whitesmoke" }}>

                    <p className="text-small-regular cursor-pointer px-2 py-1/2 hover:bg-orange-1 hover:text-white-1 mb-1 rounded-sm" onClick={() => setShowThemeList(!showThemeList)}>Editor Theme</p>


                    <p className="text-small-regular cursor-pointer px-2 py-1/2 hover:bg-orange-1 hover:text-white-1 rounded-sm" onClick={() => setShowThemeEnhancer(!showThemeEnhancer)}>Product Theme</p>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>



      <div className={`main-container flex ${isDarkMode ? "text-white-1" : "text-black-1"} ${selectedThemeEnhancer ? `${selectedThemeEnhancer}` : ""}`}>


        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={` ${selectedThemeEnhancer} h-[96vh] py-3 px-3 flex flex-col ${showSideBar ? "flex" : "hidden"}`}
          style={{
            width: `${sidebarWidth}px`,
            borderRight: isDarkMode ? "0.5px solid rgba(255, 255, 255, 0.4)" : "0.5px solid rgba(0, 0, 0, 0.4)"
          }}
        >
          <div className="w-full flex justify-between items-center px-4 mb-7 mt-2">
            <p className={` ${!isDarkMode ? "text-black-2" : "text-white-2"} text-small-regular m-0`}>Explorer</p>
            <Image
              src={isDarkMode ? '/icons/hamburger.svg' : '/icons/dark-hamburger.svg'}
              alt="hamburger"
              width={25}
              height={25}
              className={` ${isDarkMode ? "hover:bg-white-2" : "hover:bg-gray-50"} rounded-full cursor-pointer p-1`}
              onClick={() => setShowSideBar(!showSideBar)}
            />
          </div>
          <div className="overflow-y-scroll no-scrollbar">
            {docName !== "" ? (
              <FileStructureTree
                onSelect={(path: SetStateAction<string>) => setSeletedPath(path)}
                pId={project}
                searchSelectedPath={searchSelectedPath}
                searchResult={searchResult}
                setSearchResult={setSearchResult}
                docName={docName ? docName : docName}
                isDarkMode={isDarkMode}
                bgcolor={selectedThemeEnhancer}
              />
            ) : ""}
          </div>
        </div>
        <div
          ref={resizerRef}
          className="resizer hover:bg-orange-1 w-1"
          style={{
            cursor: 'col-resize',
          }}
        />
        <div className={`absolute bg-transparent top-0 m-2 z-10 cursor-pointer ${!showSideBar ? "block" : "hidden"}`} onClick={() => setShowSideBar(!showSideBar)}>
          <Image src={isDarkMode ? '/icons/hamburger.svg' : '/icons/dark-hamburger.svg'} alt="hamburger" width={18} height={18} className="cursor-pointer text-white-1" />
        </div>

        {/* CodeContainer */}

        <div className="code-container w-full flex flex-col justify-between h-[96vh]">
          <div className={`h-full editor ${selectedThemeEnhancer}`}>
            {selectedTabPath && (
              <div className="h-full">
                <div className={`tabs-section w-[100%] ${selectedThemeEnhancer} flex overflow-x-scroll no-scrollbar`}>
                  {allPaths.map((paths: any, index: number) => (
                    <>
                      {paths !== "" ?
                        <Tabs filePath={paths} isActive={paths === selectedTabPath} setSelectedTabPath={setSelectedTabPath} setSeletedPath={setSeletedPath} index={index} handleRemoveTab={handleRemoveTab} isDarkMode={isDarkMode} bgcolor={selectedThemeEnhancer} /> : ""
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

          <div
            ref={termBox}
            className={`terminal-container relative ${selectedTabPath ? "mt-8" : ""}`}
            style={{ borderTop: isDarkMode ? "0.5px solid rgba(255, 255, 255, 0.4)" : "0.5px solid rgba(0, 0, 0, 0.4)" }}
          >
            <div
              ref={termBoxTop}
              className=" rt absolute top-0 left-0 w-full cursor-row-resize h-1 hover:h-[2px] hover:bg-orange-1"
              style={{ cursor: 'row-resize' }}
            ></div>
            <div className={`w-full ${isDarkMode ? "text-white-1" : "text-black-1"} ${selectedThemeEnhancer} flex justify-between items-center px-5 ${showTerminal ? 'py-2' : "py-0"}`}>
              <p className="" style={{fontSize:"11px", letterSpacing:"1px"}}>TERMINAL</p>
              <div className="flex gap-2">
                <p className={`cursor-pointer`}style={{ fontSize: "20px" }}onClick={() => {
                  setTerminalNumber(terminalNumber+1);
                  setTerminal([...terminal, terminalNumber+1])
                  setCurrentTerminal(terminalNumber+1)
                }}>
                  {showTerminal ? '+':''}
                </p>
                <p className={`${showTerminal ? "-mt-2" : "mt-0"} cursor-pointer`}style={{ fontSize: "20px" }}onClick={() => setShowTerminal(!showTerminal)}>
                  {showTerminal ? '⌄' : '˄'}
                </p>
              </div>
            </div>
            {showTerminal && project ? (
              <>
                {terminal.map((term)=>(
                  <div className={`${term===currentTerminal?"flex justify-between":"hidden"}`}>
                    <Terminal pId={project} isDarkMode={isDarkMode} bgcolor={selectedThemeEnhancer} tId={term}/>
                    <div className="flex flex-col gap-2 border-l-2 w-32 py-2" style={{borderLeft:"0.4px solid rgba(255, 255, 255, 0.4)"}}>
                      {terminal.map((term)=>(
                        <div className="px-2 py-1/2" style={{backgroundColor:`${term===currentTerminal?"rgb(255, 255, 255, 0.2)":"none"}`, borderLeft:`${term===currentTerminal?"2px solid rgba(2, 120, 212, 1)":"none"}`}}>
                          <div className="flex gap-2">
                            <Image src={'/icons/terminal-window-light.svg'} width={20} height={20} alt="terminal image"/> 
                            <TerminalTabs setCurrentTerminal={setCurrentTerminal} index={term} isActive={term===currentTerminal}/>
                          </div>
                        </div>
                      ))}              
                    </div>
                  </div>
                ))}
              </>
            ) : ""}
          </div>

        </div>

        {/* Right Sidebar */}

        <div
          className="sidebar h-[96vh] "
          ref={rightSidebarRef}
          style={{
            width: `${rightSidebarWidth}px`,
            borderLeft: isDarkMode ? "0.5px solid rgba(255, 255, 255, 0.4)" : "0.5px solid rgba(0, 0, 0, 0.4)",
            position: 'relative'
          }}
        >
          <div
            ref={rightResizerRef}
            className="resizer hover:bg-orange-1 w-1"
            style={{
              cursor: 'col-resize',
              height: '100%',
              position: 'absolute',
              left: '-2.5px',
              top: 0,
            }}
          />
          <div className="sidebar-content" style={{ paddingLeft: '5px' }}>
            <p>Sidebar Item 1</p>
            <p>Sidebar Item 2</p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Page;