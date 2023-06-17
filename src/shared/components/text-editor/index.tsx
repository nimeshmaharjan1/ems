import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TextEditor: React.FC<{ value: string; onChange: any; ref: any; isInvalid: boolean }> = ({ value, onChange, ref, isInvalid }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <CKEditor
      config={{
        toolbar: [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'highlight',
          '|',
          'alignment',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'insertTable',
        ],
      }}
      editor={ClassicEditor}
      data={value}
      ref={ref}
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default TextEditor;
