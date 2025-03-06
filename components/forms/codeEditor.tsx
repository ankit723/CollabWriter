import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import AceEditor from "react-ace";
import { useWebSocket } from '@/providers/WebSocketContext';
import { diffLines } from 'diff';
import { Ace } from 'ace-builds';

// Import ace editor themes
import 'ace-builds/src-noconflict/mode-abap';
import 'ace-builds/src-noconflict/mode-abc';
import 'ace-builds/src-noconflict/mode-actionscript';
import 'ace-builds/src-noconflict/mode-ada';
import 'ace-builds/src-noconflict/mode-alda';
import 'ace-builds/src-noconflict/mode-apache_conf';
import 'ace-builds/src-noconflict/mode-apex';
import 'ace-builds/src-noconflict/mode-applescript';
import 'ace-builds/src-noconflict/mode-aql';
import 'ace-builds/src-noconflict/mode-asciidoc';
import 'ace-builds/src-noconflict/mode-asl';
import 'ace-builds/src-noconflict/mode-assembly_arm32';
import 'ace-builds/src-noconflict/mode-assembly_x86';
import 'ace-builds/src-noconflict/mode-astro';
import 'ace-builds/src-noconflict/mode-autohotkey';
import 'ace-builds/src-noconflict/mode-batchfile';
import 'ace-builds/src-noconflict/mode-bibtex';
import 'ace-builds/src-noconflict/mode-c9search';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-cirru';
import 'ace-builds/src-noconflict/mode-clojure';
import 'ace-builds/src-noconflict/mode-cobol';
import 'ace-builds/src-noconflict/mode-coffee';
import 'ace-builds/src-noconflict/mode-coldfusion';
import 'ace-builds/src-noconflict/mode-crystal';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-csound_document';
import 'ace-builds/src-noconflict/mode-csound_orchestra';
import 'ace-builds/src-noconflict/mode-csound_score';
import 'ace-builds/src-noconflict/mode-csp';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-curly';
import 'ace-builds/src-noconflict/mode-cuttlefish';
import 'ace-builds/src-noconflict/mode-d';
import 'ace-builds/src-noconflict/mode-dart';
import 'ace-builds/src-noconflict/mode-diff';
import 'ace-builds/src-noconflict/mode-django';
import 'ace-builds/src-noconflict/mode-dockerfile';
import 'ace-builds/src-noconflict/mode-dot';
import 'ace-builds/src-noconflict/mode-drools';
import 'ace-builds/src-noconflict/mode-edifact';
import 'ace-builds/src-noconflict/mode-eiffel';
import 'ace-builds/src-noconflict/mode-ejs';
import 'ace-builds/src-noconflict/mode-elixir';
import 'ace-builds/src-noconflict/mode-elm';
import 'ace-builds/src-noconflict/mode-erlang';
import 'ace-builds/src-noconflict/mode-flix';
import 'ace-builds/src-noconflict/mode-forth';
import 'ace-builds/src-noconflict/mode-fortran';
import 'ace-builds/src-noconflict/mode-fsharp';
import 'ace-builds/src-noconflict/mode-fsl';
import 'ace-builds/src-noconflict/mode-ftl';
import 'ace-builds/src-noconflict/mode-gcode';
import 'ace-builds/src-noconflict/mode-gherkin';
import 'ace-builds/src-noconflict/mode-gitignore';
import 'ace-builds/src-noconflict/mode-glsl';
import 'ace-builds/src-noconflict/mode-gobstones';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-graphqlschema';
import 'ace-builds/src-noconflict/mode-groovy';
import 'ace-builds/src-noconflict/mode-haml';
import 'ace-builds/src-noconflict/mode-handlebars';
import 'ace-builds/src-noconflict/mode-haskell';
import 'ace-builds/src-noconflict/mode-haskell_cabal';
import 'ace-builds/src-noconflict/mode-haxe';
import 'ace-builds/src-noconflict/mode-hjson';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-html_elixir';
import 'ace-builds/src-noconflict/mode-html_ruby';
import 'ace-builds/src-noconflict/mode-ini';
import 'ace-builds/src-noconflict/mode-io';
import 'ace-builds/src-noconflict/mode-ion';
import 'ace-builds/src-noconflict/mode-jack';
import 'ace-builds/src-noconflict/mode-jade';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-jexl';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-jsoniq';
import 'ace-builds/src-noconflict/mode-jsp';
import 'ace-builds/src-noconflict/mode-jssm';
import 'ace-builds/src-noconflict/mode-jsx';
import 'ace-builds/src-noconflict/mode-julia';
import 'ace-builds/src-noconflict/mode-kotlin';
import 'ace-builds/src-noconflict/mode-latex';
import 'ace-builds/src-noconflict/mode-latte';
import 'ace-builds/src-noconflict/mode-less';
import 'ace-builds/src-noconflict/mode-liquid';
import 'ace-builds/src-noconflict/mode-lisp';
import 'ace-builds/src-noconflict/mode-livescript';
import 'ace-builds/src-noconflict/mode-logiql';
import 'ace-builds/src-noconflict/mode-logtalk';
import 'ace-builds/src-noconflict/mode-lsl';
import 'ace-builds/src-noconflict/mode-lua';
import 'ace-builds/src-noconflict/mode-luapage';
import 'ace-builds/src-noconflict/mode-lucene';
import 'ace-builds/src-noconflict/mode-makefile';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-mask';
import 'ace-builds/src-noconflict/mode-matlab';
import 'ace-builds/src-noconflict/mode-maze';
import 'ace-builds/src-noconflict/mode-mediawiki';
import 'ace-builds/src-noconflict/mode-mel';
import 'ace-builds/src-noconflict/mode-mips';
import 'ace-builds/src-noconflict/mode-mixal';
import 'ace-builds/src-noconflict/mode-mushcode';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/mode-nasal';
import 'ace-builds/src-noconflict/mode-nginx';
import 'ace-builds/src-noconflict/mode-nim';
import 'ace-builds/src-noconflict/mode-nix';
import 'ace-builds/src-noconflict/mode-nsis';
import 'ace-builds/src-noconflict/mode-nunjucks';
import 'ace-builds/src-noconflict/mode-objectivec';
import 'ace-builds/src-noconflict/mode-ocaml';
import 'ace-builds/src-noconflict/mode-odin';
import 'ace-builds/src-noconflict/mode-partiql';
import 'ace-builds/src-noconflict/mode-pascal';
import 'ace-builds/src-noconflict/mode-perl';
import 'ace-builds/src-noconflict/mode-pgsql';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-php_laravel_blade';
import 'ace-builds/src-noconflict/mode-pig';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/mode-plsql';
import 'ace-builds/src-noconflict/mode-powershell';
import 'ace-builds/src-noconflict/mode-praat';
import 'ace-builds/src-noconflict/mode-prisma';
import 'ace-builds/src-noconflict/mode-prolog';
import 'ace-builds/src-noconflict/mode-properties';
import 'ace-builds/src-noconflict/mode-protobuf';
import 'ace-builds/src-noconflict/mode-prql';
import 'ace-builds/src-noconflict/mode-puppet';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-qml';
import 'ace-builds/src-noconflict/mode-r';
import 'ace-builds/src-noconflict/mode-raku';
import 'ace-builds/src-noconflict/mode-razor';
import 'ace-builds/src-noconflict/mode-rdoc';
import 'ace-builds/src-noconflict/mode-red';
import 'ace-builds/src-noconflict/mode-redshift';
import 'ace-builds/src-noconflict/mode-rhtml';
import 'ace-builds/src-noconflict/mode-robot';
import 'ace-builds/src-noconflict/mode-rst';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-sac';
import 'ace-builds/src-noconflict/mode-sass';
import 'ace-builds/src-noconflict/mode-scad';
import 'ace-builds/src-noconflict/mode-scala';
import 'ace-builds/src-noconflict/mode-scheme';
import 'ace-builds/src-noconflict/mode-scrypt';
import 'ace-builds/src-noconflict/mode-scss';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-sjs';
import 'ace-builds/src-noconflict/mode-slim';
import 'ace-builds/src-noconflict/mode-smarty';
import 'ace-builds/src-noconflict/mode-smithy';
import 'ace-builds/src-noconflict/mode-snippets';
import 'ace-builds/src-noconflict/mode-soy_template';
import 'ace-builds/src-noconflict/mode-space';
import 'ace-builds/src-noconflict/mode-sparql';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-sqlserver';
import 'ace-builds/src-noconflict/mode-stylus';
import 'ace-builds/src-noconflict/mode-svg';
import 'ace-builds/src-noconflict/mode-swift';
import 'ace-builds/src-noconflict/mode-tcl';
import 'ace-builds/src-noconflict/mode-terraform';
import 'ace-builds/src-noconflict/mode-tex';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-textile';
import 'ace-builds/src-noconflict/mode-toml';
import 'ace-builds/src-noconflict/mode-tsx';
import 'ace-builds/src-noconflict/mode-turtle';
import 'ace-builds/src-noconflict/mode-twig';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-vala';
import 'ace-builds/src-noconflict/mode-vbscript';
import 'ace-builds/src-noconflict/mode-velocity';
import 'ace-builds/src-noconflict/mode-verilog';
import 'ace-builds/src-noconflict/mode-vhdl';
import 'ace-builds/src-noconflict/mode-visualforce';
import 'ace-builds/src-noconflict/mode-vue';
import 'ace-builds/src-noconflict/mode-wollok';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-xquery';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-zeek';
import 'ace-builds/src-noconflict/mode-zig';

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
{/* change the mode according to the path and the mode importion and  */ }
const extensionToMode: Record<string, string> = {
    'js': 'javascript',
    'py': 'python',
    'java': 'java',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'md': 'markdown',
    'php': 'php',
    'sql': 'sql',
    'ruby': 'ruby',
    'go': 'golang',
    'c': 'c_cpp',
    'cpp': 'c_cpp',
    'abap': 'abap',
    'abc': 'abc',
    'actionscript': 'actionscript',
    'ada': 'ada',
    'alda': 'alda',
    'apache_conf': 'apache_conf',
    'apex': 'apex',
    'applescript': 'applescript',
    'aql': 'aql',
    'asciidoc': 'asciidoc',
    'asl': 'asl',
    'assembly_arm32': 'assembly_arm32',
    'assembly_x86': 'assembly_x86',
    'astro': 'astro',
    'autohotkey': 'autohotkey',
    'batchfile': 'batchfile',
    'bibtex': 'bibtex',
    'c9search': 'c9search',
    'c_cpp': 'c_cpp',
    'cirru': 'cirru',
    'clojure': 'clojure',
    'cobol': 'cobol',
    'coffee': 'coffee',
    'coldfusion': 'coldfusion',
    'crystal': 'crystal',
    'csharp': 'csharp',
    'csound_document': 'csound_document',
    'csound_orchestra': 'csound_orchestra',
    'csound_score': 'csound_score',
    'csp': 'csp',
    'curly': 'curly',
    'cuttlefish': 'cuttlefish',
    'd': 'd',
    'dart': 'dart',
    'diff': 'diff',
    'django': 'django',
    'dockerfile': 'dockerfile',
    'dot': 'dot',
    'drools': 'drools',
    'edifact': 'edifact',
    'eiffel': 'eiffel',
    'ejs': 'ejs',
    'elixir': 'elixir',
    'elm': 'elm',
    'erlang': 'erlang',
    'flix': 'flix',
    'forth': 'forth',
    'fortran': 'fortran',
    'fsharp': 'fsharp',
    'fsl': 'fsl',
    'ftl': 'ftl',
    'gcode': 'gcode',
    'gherkin': 'gherkin',
    'gitignore': 'gitignore',
    'glsl': 'glsl',
    'gobstones': 'gobstones',
    'graphqlschema': 'graphqlschema',
    'groovy': 'groovy',
    'haml': 'haml',
    'handlebars': 'handlebars',
    'haskell': 'haskell',
    'haskell_cabal': 'haskell_cabal',
    'haxe': 'haxe',
    'hjson': 'hjson',
    'html_elixir': 'html_elixir',
    'html_ruby': 'html_ruby',
    'ini': 'ini',
    'io': 'io',
    'ion': 'ion',
    'jack': 'jack',
    'jade': 'jade',
    'jexl': 'jexl',
    'json5': 'json5',
    'jsoniq': 'jsoniq',
    'jsp': 'jsp',
    'jssm': 'jssm',
    'julia': 'julia',
    'kotlin': 'kotlin',
    'latex': 'latex',
    'latte': 'latte',
    'less': 'less',
    'liquid': 'liquid',
    'lisp': 'lisp',
    'livescript': 'livescript',
    'logiql': 'logiql',
    'logtalk': 'logtalk',
    'lsl': 'lsl',
    'lua': 'lua',
    'luapage': 'luapage',
    'lucene': 'lucene',
    'makefile': 'makefile',
    'mask': 'mask',
    'matlab': 'matlab',
    'maze': 'maze',
    'mediawiki': 'mediawiki',
    'mel': 'mel',
    'mips': 'mips',
    'mixal': 'mixal',
    'mushcode': 'mushcode',
    'mysql': 'mysql',
    'nasal': 'nasal',
    'nginx': 'nginx',
    'nim': 'nim',
    'nix': 'nix',
    'nsis': 'nsis',
    'nunjucks': 'nunjucks',
    'objectivec': 'objectivec',
    'ocaml': 'ocaml',
    'odin': 'odin',
    'partiql': 'partiql',
    'pascal': 'pascal',
    'perl': 'perl',
    'pgsql': 'pgsql',
    'php_laravel_blade': 'php_laravel_blade',
    'pig': 'pig',
    'plain_text': 'plain_text',
    'txt': 'plain_text',
    'plsql': 'plsql',
    'powershell': 'powershell',
    'praat': 'praat',
    'prisma': 'prisma',
    'prolog': 'prolog',
    'properties': 'properties',
    'protobuf': 'protobuf',
    'prql': 'prql',
    'puppet': 'puppet',
    'qml': 'qml',
    'r': 'r',
    'raku': 'raku',
    'razor': 'razor',
    'rdoc': 'rdoc',
    'red': 'red',
    'redshift': 'redshift',
    'rhtml': 'rhtml',
    'robot': 'robot',
    'rst': 'rst',
    'rust': 'rust',
    'sac': 'sac',
    'sass': 'sass',
    'scad': 'scad',
    'scala': 'scala',
    'scheme': 'scheme',
    'scrypt': 'scrypt',
    'scss': 'scss',
    'sh': 'sh',
    'sjs': 'sjs',
    'slim': 'slim',
    'smarty': 'smarty',
    'smithy': 'smithy',
    'snippets': 'snippets',
    'soy_template': 'soy_template',
    'space': 'space',
    'sparql': 'sparql',
    'sqlserver': 'sqlserver',
    'stylus': 'stylus',
    'svg': 'svg',
    'swift': 'swift',
    'tcl': 'tcl',
    'terraform': 'terraform',
    'tex': 'tex',
    'text': 'text',
    'textile': 'textile',
    'toml': 'toml',
    'turtle': 'turtle',
    'twig': 'twig',
    'vala': 'vala',
    'vbscript': 'vbscript',
    'velocity': 'velocity',
    'verilog': 'verilog',
    'vhdl': 'vhdl',
    'visualforce': 'visualforce',
    'vue': 'vue',
    'wollok': 'wollok',
    'xml': 'xml',
    'xquery': 'xquery',
    'yaml': 'yaml',
    'zeek': 'zeek',
    'zig': 'zig',
};

interface User {
    id: string;
    username: string;
    color: string;
    cursor?: {
        row: number;
        column: number;
    };
    selection?: {
        start: { row: number; column: number };
        end: { row: number; column: number };
    };
}

interface PendingChange {
    code: string;
    version: number;
    timestamp: number;
    retryCount: number;
}

interface EditorState {
    version: number;
    lastSyncedContent: string;
    isDirty: boolean;
    activeUsers: Map<string, User>;
    pendingChanges: PendingChange[];
    isOffline: boolean;
    hasConflicts: boolean;
}

const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff delays in milliseconds

const CodeEditor = ({ path, pId, selectedTheme, username }: any) => {
    const [code, setCode] = useState<string>("");
    const [selectedPathContent, setSelectedPathContent] = useState<string>("");
    const [extension, setExtension] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [clientId, setClientId] = useState<string>("");
    const { socket, isConnected, sendMessage } = useWebSocket();
    const editorRef = useRef<any>(null);
    const lastCursorPosition = useRef<any>(null);
    const lastUpdateTimestamp = useRef<number>(0);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const [editorState, setEditorState] = useState<EditorState>({
        version: 0,
        lastSyncedContent: "",
        isDirty: false,
        activeUsers: new Map(),
        pendingChanges: [],
        isOffline: !isConnected,
        hasConflicts: false
    });

    // Add loading state
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    // 1. Client ID effect
    useEffect(() => {
        if (socket) {
            const id = Math.random().toString(36).substr(2, 9);
            setClientId(id);
        }
    }, [socket]);

    // 2. Handle conflict resolution
    const handleConflictResolution = useCallback((serverContent: string, localContent: string, serverVersion: number) => {
        if (serverContent === localContent) return localContent;

        // Instead of showing conflict markers, we'll use a last-write-wins approach
        if (serverVersion > editorState.version) {
            // Server has newer version, accept server changes
            return serverContent;
        } else {
            // Local changes are newer, keep local changes and notify server
            sendMessage({
                type: 'file:change',
                data: {
                    path,
                    pId,
                    content: localContent,
                    version: editorState.version,
                    timestamp: Date.now()
                }
            });
            return localContent;
        }
    }, [editorState.version, path, pId, sendMessage]);

    // 3. Render user markers
    const renderUserMarkers = useCallback(() => {
        if (!editorRef.current?.editor) return;

        const session = editorRef.current.editor.getSession();
        
        // Clear existing markers
        const existingMarkers = session.getMarkers();
        if (existingMarkers) {
            Object.keys(existingMarkers).forEach(markerId => {
                session.removeMarker(Number(markerId));
            });
        }

        editorState.activeUsers.forEach(user => {
            if (user.id === clientId) return;

            if (user.cursor || user.selection) {
                const Range = require('ace-builds').Range;
                
                if (user.selection) {
                    const range = new Range(
                        user.selection.start.row,
                        user.selection.start.column,
                        user.selection.end.row,
                        user.selection.end.column
                    );
                    session.addMarker(range, 'remote-selection', 'text', false);
                }

                if (user.cursor) {
                    const cursorEl = document.createElement('div');
                    cursorEl.className = 'remote-cursor';
                    cursorEl.style.backgroundColor = user.color;
                    cursorEl.setAttribute('data-username', user.username);

                    session.addDynamicMarker({
                        update: function(html: HTMLElement[], markerLayer: any, session: any, config: any) {
                            if (!html) return;
                            
                            const screenPos = session.documentToScreenPosition(
                                user.cursor!.row,
                                user.cursor!.column
                            );
                            
                            const cursorClone = cursorEl.cloneNode(true) as HTMLElement;
                            cursorClone.style.position = 'absolute';
                            cursorClone.style.left = `${screenPos.column * config.characterWidth}px`;
                            cursorClone.style.top = `${screenPos.row * config.lineHeight}px`;
                            
                            html.push(cursorClone.outerHTML);
                        }
                    }, true);
                }
            }
        });
    }, [editorState.activeUsers, clientId]);

    // 4. WebSocket effect
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                switch (message.type) {
                    case 'file:refresh':
                        if (!message.data.path || message.data.path !== path) return;
                        
                        const incomingVersion = message.data.version || 0;
                        const incomingTimestamp = message.data.timestamp || 0;
                        
                        // Smooth content update without showing conflicts
                        if (incomingVersion > editorState.version) {
                            const currentCursor = editorRef.current?.editor.getCursorPosition();
                            setCode(message.data.content);
                            setEditorState(prev => ({
                                ...prev,
                                version: incomingVersion,
                                lastSyncedContent: message.data.content
                            }));
                            
                            // Preserve cursor position after update
                            if (currentCursor && editorRef.current?.editor) {
                                editorRef.current.editor.moveCursorToPosition(currentCursor);
                            }
                        }
                        break;

                    case 'cursor:update':
                        if (message.data.path !== path || message.data.pId !== pId) return;
                        
                        setEditorState(prev => {
                            const newUsers = new Map(prev.activeUsers);
                            if (message.data.userId !== clientId) {
                                newUsers.set(message.data.userId, {
                                    id: message.data.userId,
                                    username: message.data.username,
                                    color: message.data.color,
                                    cursor: message.data.cursor,
                                    selection: message.data.selection
                                });
                            }
                            return { ...prev, activeUsers: newUsers };
                        });
                        renderUserMarkers();
                        break;

                    case 'user:leave':
                        setEditorState(prev => {
                            const newUsers = new Map(prev.activeUsers);
                            newUsers.delete(message.data.userId);
                            return { ...prev, activeUsers: newUsers };
                        });
                        renderUserMarkers();
                        break;

                    case 'file:conflict':
                        const resolvedContent = handleConflictResolution(
                            message.data.serverContent,
                            code,
                            message.data.serverVersion
                        );
                        setCode(resolvedContent);
                        break;
                }
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
            }
        };

        socket.addEventListener('message', handleMessage);
        return () => socket.removeEventListener('message', handleMessage);
    }, [socket, path, pId, code, renderUserMarkers, handleConflictResolution, clientId]);

    // Get file contents
    const getFileContents = useCallback(async () => {
        if (!path || !pId) {
            console.log('Missing path or pId:', { path, pId });
            return;
        }
        
        try {
            setIsLoading(true);
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
            console.log('Fetching from:', `${backendUrl}/files/content?path=${path}&pId=${pId}`);
            
            const response = await fetch(`${backendUrl}/files/content?path=${path}&pId=${pId}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch file content: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Received file content:', result);
            
            setSelectedPathContent(result.content);
            setCode(result.content);
            setEditorState(prev => ({
                ...prev,
                version: result.version || 0,
                lastSyncedContent: result.content
            }));
        } catch (error) {
            console.error('Error fetching file contents:', error);
        } finally {
            setIsLoading(false);
        }
    }, [path, pId]);

    // Call getFileContents on mount and when path/pId changes
    useEffect(() => {
        console.log('Calling getFileContents with:', { path, pId });
        getFileContents();
    }, [path, pId, getFileContents]);

    // Add debug logging for render
    useEffect(() => {
        console.log('Current state:', {
            path,
            pId,
            code,
            isLoading,
            hasContent: !!selectedPathContent
        });
    }, [path, pId, code, isLoading, selectedPathContent]);

    // Handle unsaved changes warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (editorState.isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [editorState.isDirty]);

    // Handle offline storage
    useEffect(() => {
        if (!isConnected && editorState.isDirty) {
            localStorage.setItem(`pending_changes_${path}`, JSON.stringify({
                changes: editorState.pendingChanges,
                timestamp: Date.now()
            }));
        }
    }, [isConnected, editorState.pendingChanges, path]);

    // Process pending changes queue
    const processPendingChanges = useCallback(async () => {
        if (!isConnected || editorState.pendingChanges.length === 0) return;

        const change = editorState.pendingChanges[0];
        try {
            await sendMessage({
                type: 'file:change',
                data: {
                    path,
                    pId,
                    content: change.code,
                    version: change.version,
                    timestamp: change.timestamp
                }
            });

            setEditorState(prev => ({
                ...prev,
                pendingChanges: prev.pendingChanges.slice(1),
                lastSyncedContent: change.code
            }));
        } catch (error) {
            if (change.retryCount < 3) {
                setEditorState(prev => ({
                    ...prev,
                    pendingChanges: [
                        { ...change, retryCount: change.retryCount + 1 },
                        ...prev.pendingChanges.slice(1)
                    ]
                }));
                setTimeout(processPendingChanges, RETRY_DELAYS[change.retryCount - 1]);
            }
        }
    }, [isConnected, path, pId, sendMessage]);

    // Recover offline changes
    useEffect(() => {
        if (isConnected) {
            const storedChanges = localStorage.getItem(`pending_changes_${path}`);
            if (storedChanges) {
                try {
                    const { changes, timestamp } = JSON.parse(storedChanges);
                    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // Only recover changes less than 24h old
                        setEditorState(prev => ({
                            ...prev,
                            pendingChanges: [...prev.pendingChanges, ...changes]
                        }));
                        processPendingChanges();
                    }
                    localStorage.removeItem(`pending_changes_${path}`);
                } catch (error) {
                    console.error('Error recovering offline changes:', error);
                }
            }
        }
    }, [isConnected, path, processPendingChanges]);

    // Handle file extension
    useEffect(() => {
        const arrpath = path.split(".");
        const extension = arrpath[arrpath.length - 1] || "javascript";
        setExtension(extension);
    }, [path]);

    // Add handleCursorChange before the return statement
    const handleCursorChange = useCallback(() => {
        if (!editorRef.current?.editor || !isConnected) return;

        const cursor = editorRef.current.editor.getCursorPosition();
        const selection = editorRef.current.editor.getSelection();
        const selectionRange = selection.isEmpty() ? null : {
            start: selection.getRange().start,
            end: selection.getRange().end
        };

        sendMessage({
            type: 'cursor:update',
            data: {
                path,
                pId,
                cursor,
                selection: selectionRange,
                username
            }
        });
    }, [isConnected, path, pId, sendMessage, username]);

    // Handle code changes
    const handleCodeChange = useCallback((newCode: string) => {
        console.log('Code changed:', newCode); // Debug log
        
        setCode(newCode);
        setEditorState(prev => ({
            ...prev,
            isDirty: true,
            version: prev.version + 1,
            pendingChanges: [
                ...prev.pendingChanges,
                {
                    code: newCode,
                    version: prev.version + 1,
                    timestamp: Date.now(),
                    retryCount: 0
                }
            ]
        }));

        // Send changes to server
        if (isConnected) {
            sendMessage({
                type: 'file:change',
                data: {
                    path,
                    pId,
                    content: newCode,
                    version: editorState.version + 1,
                    timestamp: Date.now()
                }
            });
        }
    }, [path, pId, sendMessage, isConnected, editorState.version]);

    // Enhanced AI suggestion handler with debug logging
    const getAISuggestions = useCallback(async (currentCode: string, cursorPosition: number) => {
        setIsLoadingSuggestions(true);
        try {
            console.log('Getting AI suggestions for position:', cursorPosition);
            
            const lines = currentCode.split('\n');
            const currentLineIndex = currentCode.slice(0, cursorPosition).split('\n').length - 1;
            const currentLine = lines[currentLineIndex] || '';
            
            const contextStart = Math.max(0, currentLineIndex - 10);
            const contextEnd = Math.min(lines.length, currentLineIndex + 10);
            const contextCode = lines.slice(contextStart, contextEnd).join('\n');

            const backendUrl = "http://localhost:5001";
            
            console.log('Sending request to backend with:', {
                currentLine,
                language: extensionToMode[extension],
                contextLength: contextCode.length
            });

            const response = await fetch(`${backendUrl}/ai/suggest`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: contextCode,
                    currentLine,
                    position: cursorPosition,
                    language: extensionToMode[extension] || "javascript",
                    path,
                    fullCode: currentCode
                })
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            console.log('Backend response:', data);

            return data.suggestions || [];
        } catch (error) {
            console.error('Error in getAISuggestions:', error);
            return [];
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, [extension, path]);

    // Define showSuggestions before useEffect
    const showSuggestions = (editor: any, pos: any, suggestions: string[]) => {
        const session = editor.getSession();
        const screenPos = session.documentToScreenPosition(pos.row, pos.column);
        const pixelPos = editor.renderer.textToScreenCoordinates(screenPos.row, screenPos.column);
        // ... rest of the showSuggestions implementation ...
    };

    // Then your useEffect that uses it
    useEffect(() => {
        if (editorRef.current?.editor) {
            const editor = editorRef.current.editor;
            
            // Disable built-in completions
            editor.setOptions({
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false
            });

            let lastSuggestionTime = 0;
            const DEBOUNCE_TIME = 300; // ms

            // Custom trigger handling with debug logs
            editor.commands.on('afterExec', async (e: any) => {
                const { command, args } = e;
                const pos = editor.getCursorPosition();
                const line = editor.session.getLine(pos.row);
                const prefix = line.slice(0, pos.column);

                console.log('Command triggered:', { command: command.name, args, prefix });

                // VS Code-like triggers
                const shouldTrigger = 
                    (command.name === 'insertstring' && args === '.') || // After dot
                    (command.name === 'insertstring' && /[a-zA-Z_$@]/.test(args)) || // After letters
                    (command.name === 'return') || // After enter
                    /\b(const|let|var|import|from|require)\b/.test(prefix) || // After keywords
                    /\w{2,}$/.test(prefix); // After 2+ characters

                const now = Date.now();
                if (shouldTrigger && (now - lastSuggestionTime > DEBOUNCE_TIME)) {
                    console.log('Triggering suggestions');
                    lastSuggestionTime = now;

                    const suggestions = await getAISuggestions(
                        editor.getValue(),
                        editor.session.doc.positionToIndex(pos)
                    );
                    
                    console.log('Received suggestions:', suggestions);
                    
                    if (suggestions && suggestions.length > 0) {
                        showSuggestions(editor, pos, suggestions);
                    }
                }
            });

            // Add keyboard shortcut
            editor.commands.addCommand({
                name: 'triggerCustomSuggestions',
                bindKey: { win: 'Ctrl-Space', mac: 'Command-Space' },
                async exec(editor) {
                    console.log('Manual trigger activated');
                    const pos = editor.getCursorPosition();
                    const suggestions = await getAISuggestions(
                        editor.getValue(),
                        editor.session.doc.positionToIndex(pos)
                    );
                    
                    console.log('Manual trigger suggestions:', suggestions);
                    
                    if (suggestions && suggestions.length > 0) {
                        showSuggestions(editor, pos, suggestions);
                    }
                }
            });
        }
    }, [getAISuggestions, showSuggestions]);

    if (isLoading) {
        return (
            <div style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
            }}>
                Loading file content...
            </div>
        );
    }

    return (
        <div style={{ height: '100%', position: 'relative' }}>
            {/* Connection status indicator */}
            {!isConnected && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '4px 8px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    fontSize: '12px',
                    zIndex: 1000
                }}>
                    Offline - Changes will sync when reconnected
                </div>
            )}

            {/* Active users indicator */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '4px',
                zIndex: 1000
            }}>
                {Array.from(editorState.activeUsers.values()).map(user => (
                    <div key={user.id} style={{
                        display: 'inline-block',
                        marginRight: '8px',
                        padding: '2px 6px',
                        backgroundColor: user.color,
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px'
                    }}>
                        {user.username}
                    </div>
                ))}
            </div>

            {/* Conflict indicator */}
            {editorState.hasConflicts && (
                <div style={{
                    position: 'absolute',
                    top: '40px',
                    right: 0,
                    padding: '4px 8px',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    fontSize: '12px',
                    zIndex: 1000
                }}>
                    Merge conflicts detected
                </div>
            )}

            <AceEditor
                ref={editorRef}
                width='100%'
                height='100%'
                mode={extensionToMode[extension] || "javascript"}
                theme={selectedTheme || "monokai"}
                value={code}
                onChange={handleCodeChange}
                onCursorChange={handleCursorChange}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showGutter: true,
                    highlightActiveLine: true,
                    fontSize: 14,
                    showPrintMargin: false,
                    showLineNumbers: true,
                    tabSize: 2
                }}
            />
            
            {/* Optional: Show a loading indicator while getting suggestions */}
            {isLoadingSuggestions && (
                <div style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    padding: '4px 8px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    zIndex: 1000
                }}>
                    Getting AI suggestions...
                </div>
            )}

            {/* Debug panel for suggestions */}
            {suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 10,
                    padding: '8px',
                    background: 'rgba(0,0,0,0.9)',
                    color: 'white',
                    borderRadius: '4px',
                    maxWidth: '300px',
                    maxHeight: '200px',
                    overflow: 'auto'
                }}>
                    <div>Available Suggestions:</div>
                    {suggestions.map((suggestion, index) => (
                        <div key={index} style={{ fontSize: '12px', padding: '2px 0' }}>
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CodeEditor;
