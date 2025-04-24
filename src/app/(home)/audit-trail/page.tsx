"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Collapse,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  InputAdornment
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { AUDIT_TRAIL } from '../../utils/queries';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

interface AuditTrailData {
  timestamp: string;
  description: string;
  event_type: string;
  category: string;
  performed_by: string;
}

export default function AuditTrailPage() {
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Date filters
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  
  const { data, loading, error } = useQuery(AUDIT_TRAIL);
  const [filteredData, setFilteredData] = useState<AuditTrailData[]>([]);
  
  // Apply filters whenever filter criteria or data changes
  useEffect(() => {
    if (!data?.audit_trail) return;
    
    let filtered = [...data.audit_trail];
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Apply action filter
    if (selectedAction) {
      filtered = filtered.filter(item => item.event_type === selectedAction);
    }
    
    // Apply user search
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.performed_by.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date range filter
    if (startDate) {
      const startDateTime = new Date(startDate).getTime();
      filtered = filtered.filter(item => new Date(item.timestamp).getTime() >= startDateTime);
    }
    
    if (endDate) {
      const endDateTime = new Date(endDate + "T23:59:59").getTime();
      filtered = filtered.filter(item => new Date(item.timestamp).getTime() <= endDateTime);
    }
    
    setFilteredData(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [data, selectedCategory, selectedAction, searchTerm, startDate, endDate]);
  
  const handleRowToggle = (index: number) => {
    setOpenRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleActionChange = (action: string) => {
    setSelectedAction(prevAction => prevAction === action ? "" : action);
  };
  
  const handleDownloadLog = () => {
    // Create CSV content
    const headers = ["Time", "Description", "Event", "Category", "Performed By"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        formatTimestamp(row.timestamp),
        `"${row.description.replace(/"/g, '""')}"`, // Escape quotes in CSV
        row.event_type,
        row.category,
        row.performed_by
      ].join(","))
    ].join("\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format timestamp to match the image format (MM/DD/YY, HH:MM PM)
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    
    return `${month}/${day}/${year}, ${formattedHours}:${minutes} ${ampm}`;
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage(newPage);
    }
  };
  
  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };
  
  // Calculate total pages
  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, bgcolor: '#0f1419', height: '100vh' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: '#0f1419', height: '100vh' }}>
        <Typography variant="h5" gutterBottom color="white">
          Audit Trail
        </Typography>
        <Box sx={{ p: 3, bgcolor: '#1e2632' }}>
          <Typography color="error">
            Error loading audit trail data: {error.message}
          </Typography>
        </Box>
      </Box>
    );
  }
  
  const auditTrailData: AuditTrailData[] = data?.audit_trail || [];

  // Get unique categories for filter dropdown
  const categories = [...new Set(auditTrailData.map(item => item.category))];
  
  // Action types for filters
  const actionTypes = ["Create", "Delete", "Update", "Download"];

  return (
    <Box sx={{ p: 3, bgcolor: '#0f1419', color: 'white', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="500">
          Audit Trail
        </Typography>
        <IconButton 
          sx={{ 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 1,
            p: 1
          }}
          onClick={handleDownloadLog}
        >
          <DownloadIcon sx={{ mr: 1 }} />
          <Typography variant="body2">Download log</Typography>
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left sidebar filters */}
        <Box sx={{ width: '200px' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1, fontSize: 20 }} />
              Category
            </Typography>
            <FormControl fullWidth size="small" sx={{ bgcolor: '#161b22', borderRadius: 1 }}>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value as string)}
                displayEmpty
                renderValue={selectedCategory !== "" ? undefined : () => "Select an option"}
                sx={{ 
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                  '.MuiSvgIcon-root': { color: 'white' }
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category, idx) => (
                  <MenuItem key={idx} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Action</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {actionTypes.map(actionType => (
                <FormControl key={actionType} fullWidth size="small">
                  <InputLabel sx={{ color: 'white' }} id={`action-${actionType.toLowerCase()}-label`}>{actionType}</InputLabel>
                  <Select
                    labelId={`action-${actionType.toLowerCase()}-label`}
                    value={selectedAction === actionType ? actionType : ""}
                    onChange={() => handleActionChange(actionType)}
                    sx={{ 
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                      '.MuiSvgIcon-root': { color: 'white' }
                    }}
                  >
                    <MenuItem value={actionType}>{actionType}</MenuItem>
                  </Select>
                </FormControl>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>User</Typography>
            <FormControl fullWidth size="small" sx={{ bgcolor: '#161b22', borderRadius: 1 }}>
              <TextField
                placeholder="Search"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  sx: { 
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                  }
                }}
              />
            </FormControl>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Date</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>Start date</Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputProps={{
                    sx: { 
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    }
                  }}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>End date</Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputProps={{
                    sx: { 
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Main content - Table */}
        <Box sx={{ flex: 1, bgcolor: '#121a24', borderRadius: 1, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '40px', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Time</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Description</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Event</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Performed By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getPaginatedData().map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow 
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'rgba(255,255,255,0.05)' 
                        },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRowToggle(index)}
                    >
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <IconButton 
                          size="small" 
                          sx={{ color: 'white' }}
                        >
                          {openRows[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {formatTimestamp(row.timestamp)}
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {row.description}
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {row.event_type}
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {row.category}
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {row.performed_by}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2, px: 4, bgcolor: 'rgba(255,255,255,0.02)' }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Additional details for {row.description}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                {getPaginatedData().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: 'white' }}>
                      No matching records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {filteredData.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              p: 2, 
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  size="small" 
                  sx={{ color: 'white', bgcolor: '#1e2632', borderRadius: 1 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
                
                {/* Display page numbers */}
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageToShow: number;
                  
                  if (totalPages <= 3) {
                    // If we have 3 or fewer pages, just show them in order
                    pageToShow = i + 1;
                  } else if (currentPage === 1) {
                    // If we're on page 1, show pages 1, 2, 3
                    pageToShow = i + 1;
                  } else if (currentPage === totalPages) {
                    // If we're on the last page, show the last 3 pages
                    pageToShow = totalPages - 2 + i;
                  } else {
                    // Otherwise show current page and one on each side
                    pageToShow = currentPage - 1 + i;
                  }
                  
                  return (
                    <Box
                      key={pageToShow}
                      sx={{ 
                        px: 1.5, 
                        py: 0.5, 
                        bgcolor: currentPage === pageToShow ? '#3b82f6' : '#1e2632', 
                        borderRadius: 1, 
                        color: 'white',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handlePageChange(pageToShow)}
                    >
                      {pageToShow}
                    </Box>
                  );
                })}
                
                <IconButton 
                  size="small" 
                  sx={{ color: 'white', bgcolor: '#1e2632', borderRadius: 1 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}