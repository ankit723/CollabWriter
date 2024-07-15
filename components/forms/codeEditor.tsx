import { useState, useEffect, useCallback } from 'react';
import AceEditor from "react-ace";

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


const CodeEditor = ({ path, pId, selectedTheme }: any) => {
    const [code, setCode] = useState<any>("");
    const [selectedPathContent, setSelectedPathContent] = useState<any>("");
    const [extension, setExtension] = useState<any>("")
    const isSaved = selectedPathContent === code;
    console.log(extensionToMode[extension])
    useEffect(() => {
        const arrpath = path.split(".");
        const Extionsion = arrpath[arrpath.length - 1] || "javascript";
        setExtension(Extionsion);
        console.log(extensionToMode[extension])
    }, [path]);

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
                mode={extensionToMode[extension] || "javascript"}
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
