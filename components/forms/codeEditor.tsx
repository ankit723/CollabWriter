import { useState, useEffect, useCallback } from 'react';
import AceEditor from "react-ace";

// Import ace editor themes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-cloud9_night";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-cloud9_day";
import "ace-builds/src-noconflict/theme-cloud9_night_low_color";
import "ace-builds/src-noconflict/theme-cloud_editor";
import "ace-builds/src-noconflict/theme-cloud_editor_dark";
import "ace-builds/src-noconflict/theme-clouds";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-crimson_editor";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-dreamweaver";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/theme-github_light_default";
import "ace-builds/src-noconflict/theme-gob";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-gruvbox_dark_hard";
import "ace-builds/src-noconflict/theme-gruvbox_light_hard";
import "ace-builds/src-noconflict/theme-idle_fingers";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/theme-katzenmilch";
import "ace-builds/src-noconflict/theme-kr_theme";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-merbivore";
import "ace-builds/src-noconflict/theme-merbivore_soft";
import "ace-builds/src-noconflict/theme-mono_industrial";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-sqlserver";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow_night_blue";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "ace-builds/src-noconflict/theme-xcode";

const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001');

const CodeEditor = ({ path, pId, selectedTheme }: any) => {
    const [code, setCode] = useState<any>("");
    const [selectedPathContent, setSelectedPathContent] = useState<any>("");
    const isSaved = selectedPathContent === code;

    useEffect(() => {
        if (code && !isSaved) {
            const timer = setTimeout(() => {
                console.log(code);
                ws.send(JSON.stringify({ type: 'file:change', data: { path: path, pId: pId, content: code } }));
            }, 5);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [code]);

    const getFileContents = useCallback(async () => {
        if (!path) return;
        const response = await fetch(`http://localhost:5001/files/content?path=${path}&pId=${pId}`);
        const result = await response.json();
        setSelectedPathContent(result.content);
    }, [path]);

    useEffect(() => {
        if (path && selectedPathContent) {
            setCode(selectedPathContent);
        }
    }, [path, selectedPathContent]);

    useEffect(() => {
        setCode("");
    }, [path]);




    useEffect(() => {
        if (path) getFileContents();
    }, [getFileContents, path]);

    useEffect(() => {
        ws.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'file:refresh') {
                console.log('Changed');
                if (path) getFileContents();
            }
        };
    }, [getFileContents, path]);

    return (
        <div style={{ height: '100%' }}>
            <AceEditor
                width='100%'
                height='100%'
                mode="javascript"
                theme={selectedTheme || "monokai"}
                value={code}
                onChange={e => setCode(e)}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
            />
        </div>
    );
}

export default CodeEditor;
