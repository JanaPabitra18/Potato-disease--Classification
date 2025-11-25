import React from 'react';
import { CardContent, CircularProgress, Typography } from '@material-ui/core';

const LoaderMessage = ({ loaderClassName, titleClassName, title = 'Processing' }) => (
  <CardContent style={{ backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <CircularProgress color="secondary" className={loaderClassName} />
    <Typography className={titleClassName} variant="h6" noWrap>
      {title}
    </Typography>
  </CardContent>
);

export default LoaderMessage;
