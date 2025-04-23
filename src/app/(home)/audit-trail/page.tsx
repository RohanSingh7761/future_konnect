"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { AUDIT_TRAIL } from '../../utils/queries';

interface AuditTrailData {
  timestamp: string;
  description: string;
  event_type: string;
  category: string;
  performed_by: string;
}

export default function AuditTrailPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  const { data, loading, error } = useQuery(AUDIT_TRAIL);
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format timestamp for better readability
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Audit Trail
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography color="error">
            Error loading audit trail data: {error.message}
          </Typography>
        </Paper>
      </Box>
    );
  }
  
  const auditTrailData: AuditTrailData[] = data?.audit_trail || [];
  
  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - auditTrailData.length) 
    : 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Audit Trail
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="audit trail table">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Performed By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditTrailData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{formatTimestamp(row.timestamp)}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.event_type}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.performed_by}</TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={auditTrailData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}