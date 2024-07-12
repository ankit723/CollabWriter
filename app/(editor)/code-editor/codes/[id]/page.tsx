"use client";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { fetchProject } from "@/lib/actions/document.action";
import Terminal from "@/components/forms/terminal";
import FileStructureTree from "@/components/cards/fileStructureTree";
import CodeEditor from "@/components/forms/codeEditor";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { Replace } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";

// selectedPath.replace("/", " ").replaceAll("/", " > ")

const ws = new WebSocket(
  process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || "ws://localhost:5001"
);

const Page = ({ params }: { params: { id: string } }) => {
  const { user } = useUser();
  const [selectedPath, setSeletedPath] = useState<any>("");
  const [searchSelectedPath, setSearchSeletedPath] = useState<any>(selectedPath);
  const [project, setProject] = useState<any>("");
  const [searchResult, setSearchResult]=useState<any>([])


  useEffect(()=>{
    console.log(searchResult)
  },[searchResult])

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await fetchUser(user?.id || "");
      const cProject = await fetchProject(params.id, userInfo?._id);
      setProject(cProject);
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (project) {
      ws.send(
        JSON.stringify({ type: "project:started", data: { id: project } })
      );
    }
  }, [project]);

  return (
    <div className="custom-scrollbar w-screen">


      <header className="grid grid-cols-3 text-white-1 items-center py-1 px-5" style={{ borderBottom: "0.5px solid rgba(255, 255, 255, 0.4)" }}>
        <div className="w-full flex justify-start items-center">Project Details</div>
        <div className="relative w-full bg-white-1">
          <div className="w-full absolute bg-black-2 top-[-0.8rem] z-10 rounded-lg" style={{ border: "0.5px solid rgba(255, 255, 255, 0.4)" }}>
            <div className="relative ">
              <p className="absolute left-5">🔎</p>
              <input type="text" value={ searchSelectedPath} placeholder={selectedPath} className="bg-black-2 rounded-lg text-center w-full" style={{ border: "0.5px solid rgba(255, 255, 255, 0.4)" }}
                onChange={(e)=>setSearchSeletedPath(e.target.value)} onKeyDown={(e)=>{
                  if(e.key==='Enter'){
                    setSeletedPath(searchSelectedPath)
                  }
                }}
                />
            </div>
            {searchResult.lemgth!=0 && searchResult.map((res:string, index:number)=>(
                <p key={index} className="text-white-1 cursor-pointer hover:bg-orange-1 rounded-b-lg px-5 py-1" onClick={()=>{
                  setSeletedPath(res)
                  setSearchSeletedPath("")
                }}>{res}</p>
              ))}
          </div>
        </div>
        <div className="w-full flex justify-end items-center">File Code Editor</div>
      </header>


      <div className=" main-container flex text-white-1">
        <div className="w-[290px] bg-black-3 h-[96vh] py-3 px-3 flex flex-col" style={{ borderRight: "0.5px solid rgba(255, 255, 255, 0.4)" }}>
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1 pb-5 max-lg:justify-center"
          >
            <Image
              src="/icons/logo.png"
              alt="Podcast Logo"
              width={30}
              height={30}
            />
            <h1 className="text-24 font-extrabold text-white max-lg:hidden">
              CollabWriter
            </h1>
          </Link>
          <div className=" overflow-y-scroll custom-scrollbar">
            <FileStructureTree
              onSelect={(path: any) => {
                console.log(path);
                setSeletedPath(path);
              }}
              pId={project}
              searchSelectedPath={searchSelectedPath}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          </div>
        </div>

        <div className="code-container w-full flex flex-col justify-between h-[95vh]">
          <div className="editor h-full bg-black-1">
            {selectedPath ? (
              <div className="h-full">
                <CodeEditor path={selectedPath} pId={project}/>
              </div>
            ) : (
              ""
            )}
          </div>
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default Page;
