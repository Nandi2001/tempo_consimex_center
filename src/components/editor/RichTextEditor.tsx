import React, { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Code,
  Eye,
  FileCode,
  Sparkles,
  Columns2,
  Maximize2,
  Check,
  RotateCcw,
  Wand2
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onInsertVariable?: (variableKey: string) => void;
}

// Simple HTML formatter/beautifier
const formatHtml = (html: string): string => {
  let tab = '  ';
  let result = '';
  let indent = 0;

  // Normalize spaces and clean up
  const tokens = html
    .replace(/>\s*</g, '><')
    .replace(/</g, '~::~<')
    .replace(/\s*~::~/g, '~::~')
    .split('~::~');

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    if (token.match(/^<\/\w/)) {
      // Closing tag
      indent = Math.max(0, indent - 1);
      result += tab.repeat(indent) + token + '\n';
    } else if (token.match(/^<\w[^>]*[^\/]>.*<\/\w[^>]*>$/)) {
      // Tag on single line with text
      result += tab.repeat(indent) + token + '\n';
    } else if (token.match(/^<\w[^>]*[^\/]>/)) {
      // Opening tag
      result += tab.repeat(indent) + token + '\n';
      if (!token.startsWith('<img') && !token.startsWith('<input') && !token.startsWith('<hr') && !token.startsWith('<br')) {
        indent++;
      }
    } else {
      // Text or self-closing
      result += tab.repeat(indent) + token + '\n';
    }
  }

  return result.trim() || html;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'split' | 'code'>('visual');
  const [rawHtml, setRawHtml] = useState(content || '');
  const [isCopied, setIsCopied] = useState(false);
  
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync external content
  useEffect(() => {
    if (!isInternalChange.current) {
      setRawHtml(content || '');
      if (visualEditorRef.current && visualEditorRef.current.innerHTML !== (content || '')) {
        visualEditorRef.current.innerHTML = content || '';
      }
    }
    isInternalChange.current = false;
  }, [content]);

  // Handle changes in Visual contentEditable
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const newHtml = visualEditorRef.current.innerHTML;
      isInternalChange.current = true;
      setRawHtml(newHtml);
      onChange(newHtml);
    }
  };

  // Handle changes in Code textarea
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    isInternalChange.current = true;
    setRawHtml(newHtml);
    onChange(newHtml);
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = newHtml;
    }
  };

  // Execute formatting command in Visual Mode
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (viewMode === 'code') return;
    document.execCommand(command, false, value);
    handleVisualInput();
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
    }
  };

  // Insert Table
  const insertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1.5px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left;">
            <th style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold; color: #0f172a;">Coloana 1</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold; color: #0f172a;">Coloana 2</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold; color: #0f172a;">Coloana 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Valoare 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Valoare 2</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Valoare 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Valoare 4</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Valoare 5</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Valoare 6</td>
          </tr>
        </tbody>
      </table>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  // Beautify / Format HTML
  const handleBeautifyHtml = () => {
    const formatted = formatHtml(rawHtml);
    isInternalChange.current = true;
    setRawHtml(formatted);
    onChange(formatted);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Top Toolbar Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2 text-slate-700 select-none">
        {/* Left Toolbar Items (When in Visual or Split Mode) */}
        {viewMode !== 'code' ? (
          <div className="flex flex-wrap items-center gap-1">
            {/* Headings */}
            <div className="flex items-center space-x-0.5 border-r border-slate-300 pr-1.5 mr-1.5">
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h1>')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                title="Titlu Principal (H1)"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h2>')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                title="Titlu Secțiune (H2)"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h3>')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                title="Subtitlu (H3)"
              >
                <Heading3 className="w-4 h-4" />
              </button>
            </div>

            {/* Basic formatting */}
            <div className="flex items-center space-x-0.5 border-r border-slate-300 pr-1.5 mr-1.5">
              <button
                type="button"
                onClick={() => executeCommand('bold')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-bold transition"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('italic')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 italic transition"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('underline')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 underline transition"
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-0.5 border-r border-slate-300 pr-1.5 mr-1.5">
              <button
                type="button"
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                title="Listă cu buline"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('insertOrderedList')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                title="Listă numerotată"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center space-x-0.5 border-r border-slate-300 pr-1.5 mr-1.5">
              <button
                type="button"
                onClick={() => executeCommand('justifyLeft')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                title="Aliniere la stânga"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('justifyCenter')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                title="Centrat"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('justifyRight')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                title="Aliniere la dreapta"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('justifyFull')}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                title="Justify (Aliniat pe ambele margini)"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* Table tool */}
            <div className="flex items-center space-x-0.5">
              <button
                type="button"
                onClick={insertTable}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 text-xs font-semibold"
                title="Inserează tabel"
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline">+ Tabel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <FileCode className="w-4 h-4 text-tempo-600" />
            <span>Editor Cod Sursă HTML (Mod Direct — păstrează 100% toate stilurile CSS și tagurile)</span>
            <button
              type="button"
              onClick={handleBeautifyHtml}
              className="ml-3 px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition flex items-center gap-1"
              title="Formatează și indentează codul HTML"
            >
              <Wand2 className="w-3.5 h-3.5 text-tempo-600" />
              <span>Auto-Format</span>
            </button>
          </div>
        )}

        {/* Mode Toggle Switcher: Visual | Split | Code */}
        <div className="flex items-center space-x-1 bg-slate-200/80 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              viewMode === 'visual'
                ? 'bg-white text-tempo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Editare vizuală directă pe pagina A4"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vizual</span>
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              viewMode === 'split'
                ? 'bg-tempo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Vizualizare dublă: Cod HTML + Previzualizare A4 în timp real"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Split (Cod + Live)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('code')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              viewMode === 'code'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Editare completă a codului sursă HTML"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Cod HTML</span>
          </button>
        </div>
      </div>

      {/* Editor Main Work Area */}
      <div className="flex-1 overflow-hidden min-h-[480px]">
        {viewMode === 'visual' && (
          <div className="p-6 overflow-y-auto h-full max-h-[700px] bg-white">
            <div
              ref={visualEditorRef}
              contentEditable
              onInput={handleVisualInput}
              dangerouslySetInnerHTML={{ __html: content || '' }}
              className="min-h-[440px] focus:outline-none leading-relaxed select-text"
              style={{
                outline: 'none',
                minHeight: '440px',
              }}
            />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[480px] max-h-[700px] divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Left: Code Editor */}
            <div className="flex flex-col bg-slate-900 text-slate-100 p-3 overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700 text-xs text-slate-400">
                <span className="font-mono font-bold text-tempo-400">&lt;/&gt; Cod Sursă HTML</span>
                <button
                  type="button"
                  onClick={handleBeautifyHtml}
                  className="hover:text-white transition flex items-center gap-1"
                  title="Formatează codul HTML"
                >
                  <Wand2 className="w-3 h-3" />
                  Format
                </button>
              </div>
              <textarea
                value={rawHtml}
                onChange={handleCodeChange}
                placeholder="Scrieți sau modificați codul HTML formatat aici..."
                className="w-full flex-1 font-mono text-xs text-slate-100 bg-transparent outline-none resize-none leading-relaxed p-1"
                spellCheck={false}
              />
            </div>

            {/* Right: Live Rendered Page */}
            <div className="p-6 overflow-y-auto bg-slate-50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Previzualizare A4 Live:
              </div>
              <div
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs"
                dangerouslySetInnerHTML={{ __html: rawHtml }}
              />
            </div>
          </div>
        )}

        {viewMode === 'code' && (
          <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-4 min-h-[480px] max-h-[700px]">
            <textarea
              value={rawHtml}
              onChange={handleCodeChange}
              placeholder="Scrieți sau modificați codul HTML formatat aici..."
              className="w-full h-full min-h-[440px] font-mono text-xs text-slate-100 bg-transparent outline-none resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
