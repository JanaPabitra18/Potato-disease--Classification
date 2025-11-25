import React from 'react';
import { Grid, Button } from '@material-ui/core';

const ClearButtonBar = ({ onClear, buttonClassName, startIcon, label = 'Clear' }) => (
  <Grid item style={{ maxWidth: '416px', width: '100%' }}>
    <Button
      variant="contained"
      className={buttonClassName}
      color="primary"
      component="span"
      size="large"
      onClick={onClear}
      startIcon={startIcon}
    >
      {label}
    </Button>
  </Grid>
);

export default ClearButtonBar;
