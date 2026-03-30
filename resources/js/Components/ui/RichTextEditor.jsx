import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '../../utils/utils';

const RichTextEditor = ({ label, value, onChange, error, className }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1">
          {label}
        </label>
      )}
      <div className={cn(
        "rounded-xl overflow-hidden border border-[#E0E6ED] bg-white transition-all focus-within:ring-2 focus-within:ring-[#1A3A5C]/20 focus-within:border-[#1A3A5C]",
        error && "border-[#D64545] focus-within:ring-[#D64545]/10 focus-within:border-[#D64545]"
      )}>
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          className="bg-white"
        />
      </div>
      {error && <p className="text-xs font-medium text-[#D64545] ml-1">{error}</p>}
      
      <style jsx global>{`
        .ql-container.ql-snow {
          border: none !important;
          min-height: 200px;
          font-family: inherit;
          font-size: 0.875rem;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #E0E6ED !important;
          background: hsla(210, 25%, 98%, 1);
        }
        .ql-editor {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
