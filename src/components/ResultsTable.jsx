import React from 'react';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

const ResultsTable = ({ label, confidence, classNames = {} }) => {
  const { tableContainer, table, tableHead, tableRow, tableCell, tableCell1, tableBody: tableBodyClass } = classNames;
  return (
    <TableContainer component={Paper} className={tableContainer}>
      <Table className={table} size="small" aria-label="results table">
        <TableHead className={tableHead}>
          <TableRow className={tableRow}>
            <TableCell className={tableCell1}>Label:</TableCell>
            <TableCell align="right" className={tableCell1}>Confidence:</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={tableBodyClass}>
          <TableRow className={tableRow}>
            <TableCell component="th" scope="row" className={tableCell}>
              {label}
            </TableCell>
            <TableCell align="right" className={tableCell}>{confidence}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;
