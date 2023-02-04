import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios, { AxiosProgressEvent } from 'axios';

const MultipleImageUpload: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    if (!acceptedFiles || acceptedFiles.length === 0) {
      console.log('No images provided.');
      return;
    }
    for (let file of acceptedFiles) {
      const formData = new FormData();
      formData.append('image', file, file.name);
      console.log(formData.getAll());
      try {
        const res = await axios.post('/api/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (!progressEvent.total) return;
            const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercentage(percentComplete);
            if (uploadPercentage === 100) {
              setIsUploading(false);
            }
          },
        });
        console.log(res.data);
        setImages([...images, res.data.image]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="container mx-auto mt-10">
      <div className="flex items-center justify-center h-64 border border-dashed">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p className="text-center text-gray-600">Drag and drop your images here or click to select files</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {images.map((image, index) => (
          <img key={index} src={image} alt="uploaded image" className="w-full h-64 object-cover" />
        ))}
      </div>
      {isUploading && (
        <div className="w-full h-10 bg-gray-200 mt-10">
          <div className="h-full bg-teal-500" style={{ width: `${uploadPercentage}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload;
