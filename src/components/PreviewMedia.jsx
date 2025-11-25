import React from 'react';
import { CardActionArea, CardMedia } from '@material-ui/core';

const PreviewMedia = ({ src, className, title = 'Preview' }) => (
  <CardActionArea>
    <CardMedia className={className} image={src} component="img" title={title} />
  </CardActionArea>
);

export default PreviewMedia;
