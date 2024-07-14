"use client";

import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import { fetchProject, updateDocumentTitleDescription } from "@/lib/actions/document.action";
import Terminal from "@/components/forms/terminal";
import FileStructureTree from "@/components/cards/fileStructureTree";
import CodeEditor from "@/components/forms/codeEditor";
import { useCallback, useEffect, useState } from "react";
import { Replace } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ws = new WebSocket(
  process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || "ws://localhost:5001"
);

const themes = [
  'monokai', 'mode-javascript', 'github', 'ext-language_tools',
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
  const [searchSelectedPath, setSearchSeletedPath] = useState<string>(selectedPath);
  const [project, setProject] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [docName, setDocName] = useState<string>("");
  const [docDesc, setDocDesc] = useState<string>("");
  const [showSetting, setShowSetting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>(localStorage.getItem('editorTheme')||"");

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await fetchUser(user?.id || "");
      const cProject = await fetchProject(params.id, userInfo?._id);
      setProject(cProject.id);
      setDocName(cProject.title);
      setDocDesc(cProject.desc);
    };
    fetchData();
  }, [params.id]);

  useEffect(()=>{
    console.log(searchResult)
  }, [searchResult])

  useEffect(()=>{
    console.log(searchSelectedPath)
  }, [searchSelectedPath])


  useEffect(() => {
    if (project) {
      ws.send(JSON.stringify({ type: "project:started", data: { id: project } }));
    }
  }, [project]);

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setDocName(newTitle);
    if (project) {
      await updateDocumentTitleDescription(params.id, docName, docDesc);
    }
  };

  return (
    <div className="custom-scrollbar w-screen">
      <header className="grid grid-cols-3 text-white-1 items-center py-1 px-5" style={{ borderBottom: "0.5px solid rgba(255, 255, 255, 0.4)" }}>
        <div className='flex cursor-pointer items-center gap-1 max-lg:justify-center'>
          <Link href="/"><Image src="/icons/logo.png" alt="Podcast Logo" width={30} height={30} /></Link>
          <div className="text-white-1 flex flex-col items-start justify-center w-full">
            <div className="flex gap-2 flex-grow-1">
              <input type='text' className='bg-transparent px-3' value={docName} onChange={handleTitleChange} />
            </div>
          </div>
        </div>
        <div className="relative w-full bg-white-1">
          <div className="w-full absolute bg-black-2 top-[-0.8rem] z-10 rounded-lg" style={{ border: "0.5px solid rgba(255, 255, 255, 0.4)" }}>
            <div className="relative" style={{fontSize:"12px"}}>
              <p className="absolute top-1 left-5">🔎</p>
              <input
                type="text"
                value={searchSelectedPath}
                placeholder={selectedPath}
                className="bg-black-2 rounded-lg text-center w-full p-[2px]"
                style={{ border: "0.5px solid rgba(255, 255, 255, 0.4)" }}
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
                className="text-white-1 cursor-pointer hover:bg-orange-1 rounded-b-lg px-5 py-1"
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
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw7B6uZ6KGbEW1RqetJeXnUlPDFvEDLihjZw&s"
            alt="Settings"
            className="w-4 h-4 cursor-pointer"
            onClick={() => setShowSetting(!showSetting)}
            width={14}
            height={14}
          />
          {showSetting && (
            <div className="absolute right-0 top-10 bg-black-3 border border-gray-300 shadow-lg p-4 rounded-md z-50">
              <h3 className="text-lg font-semibold mb-2">Manage Themes</h3>
              <select
                className="w-full bg-orange-1 border rounded-md px-2"
                value={selectedTheme}
                onChange={handleThemeChange}
              >
                {themes.map(theme => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
              <div className="w-full flex justify-end items-center">
                <button className="bg-orange-1 mt-4 px-2 rounded-lg" onClick={()=>{
                  localStorage.setItem('editorTheme', selectedTheme)
                  setShowSetting(!showSetting)
                }}>Save</button>
              </div>
            </div>
          )}
        </div>

      </header>
      <div className="main-container flex text-white-1">
        <div className="w-[290px] bg-black-3 h-[96vh] py-3 px-3 flex flex-col" style={{ borderRight: "0.5px solid rgba(255, 255, 255, 0.4)" }}>
          <p className="px-4 mb-7 text-white-2 text-small-regular">Explorer</p>
          <div className="overflow-y-scroll custom-scrollbar">
            <FileStructureTree
              onSelect={(path: string) => setSeletedPath(path)}
              pId={project}
              searchSelectedPath={searchSelectedPath}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
              docName={docName}
            />
          </div>
        </div>
        <div className="code-container w-full flex flex-col justify-between h-[95vh]">
          <div className="editor h-full bg-black-1" style={{ borderBottom: "0.5px solid rgba(255, 255, 255, 0.4)" }}>
            {selectedPath && (
              <div className="h-full">
                <CodeEditor path={selectedPath} pId={project} selectedTheme={selectedTheme} />
              </div>
            )}
          </div>
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default Page;
