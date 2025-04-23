'use client';

import * as React from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Typography
} from '@mui/material';

// Create dummy data interface
interface DummyData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

// Generate dummy data
const createData = (
  id: number,
  name: string,
  email: string,
  role: string,
  status: string,
  lastActive: string
): DummyData => {
  return { id, name, email, role, status, lastActive };
};

const rows = [
  createData(1, 'John Doe', 'john.doe@example.com', 'Admin', 'Active', '2025-04-24'),
  createData(2, 'Jane Smith', 'jane.smith@example.com', 'User', 'Active', '2025-04-23'),
  createData(3, 'Robert Johnson', 'robert.j@example.com', 'Editor', 'Inactive', '2025-04-20'),
  createData(4, 'Emily Davis', 'emily.d@example.com', 'User', 'Active', '2025-04-22'),
  createData(5, 'Michael Brown', 'michael.b@example.com', 'Viewer', 'Active', '2025-04-21'),
  createData(6, 'Sarah Wilson', 'sarah.w@example.com', 'User', 'Pending', '2025-04-19'),
  createData(7, 'David Miller', 'david.m@example.com', 'Admin', 'Active', '2025-04-24'),
  createData(8, 'Jennifer Lee', 'jennifer.l@example.com', 'Editor', 'Active', '2025-04-23'),
  createData(9, 'Thomas Wilson', 'thomas.w@example.com', 'User', 'Inactive', '2025-04-18'),
  createData(10, 'Lisa Taylor', 'lisa.t@example.com', 'Viewer', 'Active', '2025-04-22'),
  createData(11, 'James Anderson', 'james.a@example.com', 'User', 'Active', '2025-04-21'),
  createData(12, 'Patricia Clark', 'patricia.c@example.com', 'Editor', 'Pending', '2025-04-19'),
];

export default function DashboardPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="data table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.lastActive}</TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}