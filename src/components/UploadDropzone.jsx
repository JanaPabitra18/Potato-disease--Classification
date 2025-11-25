import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

const UploadDropzone = ({ onChange, hidden = false, dropzoneText = 'Drag and drop an image to process', acceptedFiles = ['image/*'] }) => {
  return (
    <DropzoneArea
      acceptedFiles={acceptedFiles}
      dropzoneText={dropzoneText}
      onChange={onChange}
      showAlerts={false}
      style={{ display: hidden ? 'none' : 'block' }}
    />
  );
};

export default UploadDropzone;
