import React from 'react';
import { CardContent, Typography } from '@material-ui/core';

const ErrorMessage = ({ message, className }) => (
  <CardContent style={{ backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <Typography className={className}>
      {message}
    </Typography>
  </CardContent>
);

export default ErrorMessage;
