"use client";

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
  Typography,
  Grid,
  Card,
  CardContent,
  InputBase,
  IconButton,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_TENANT_USAGE, GET_DAILY_DATA_USAGE } from '../../../utils/queries';

// Import icons
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RouterIcon from '@mui/icons-material/Router';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import ApartmentIcon from '@mui/icons-material/Apartment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Import chart components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data for chart
const dailyUsageData = [
  { date: '05 Mar', usage: 800 },
  { date: '06 Mar', usage: 900 },
  { date: '07 Mar', usage: 1100 },
  { date: '08 Mar', usage: 1200 },
  { date: '09 Mar', usage: 1180 },
  { date: '10 Mar', usage: 1050 },
  { date: '11 Mar', usage: 600 },
];

export default function DashboardPage() {
  // Query for tenant usage data
  const { data: tenantUsageData, loading: tenantLoading, error: tenantError } = useQuery(GET_TENANT_USAGE);
  
  // Process and sort tenant data
  const processedTenantData = React.useMemo(() => {
    if (!tenantUsageData?.data_usage) return [];
    
    // Convert data_used to number for proper sorting
    return tenantUsageData.data_usage
      .map(tenant => ({
        id: tenant.id,
        tenant_id: tenant.tenant_id,
        // Assume data is stored in bytes, convert to GB for display
        data_used: tenant.data_used
      }))
      .sort((a, b) => b.data_used - a.data_used) // Sort by data usage (descending)
      .slice(0, 5) // Get top 5
      .map((tenant, index) => ({
        id: index + 1, // Remap id for display purposes
        name: `Tenant ${tenant.tenant_id}`, // Using tenant_id as name (replace with actual tenant name if available)
        dataUsage: `${(tenant.data_used / (1024 * 1024 * 1024)).toFixed(1)} GB` // Format to GB with 1 decimal
      }));
  }, [tenantUsageData]);

  return (
    <Box sx={{ 
      bgcolor: '#0c1725', 
      color: 'white',
      minHeight: '100vh',
      p: 3
    }}>
      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Data Exchanged */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: '#3182CE', 
            color: 'white',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SyncAltIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="caption">
                    TOTAL DATA EXCHANGED
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    80.4 TB
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Hotspot Users */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: '#3182CE', 
            color: 'white',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleAltIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="caption">
                    HOTSPOT USERS
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    23K/24.2K
                  </Typography>
                </Box>
              </Box>
              <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Online Routers */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: '#3182CE', 
            color: 'white',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RouterIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="caption">
                    ONLINE ROUTERS
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    201/345
                  </Typography>
                </Box>
              </Box>
              <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Second Row - Fleets and Tenants */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            bgcolor: '#3182CE', 
            color: 'white',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DirectionsBoatIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="caption">
                    FLEETS
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    45
                  </Typography>
                </Box>
              </Box>
              <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            bgcolor: '#3182CE', 
            color: 'white',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ApartmentIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="caption">
                    TENANTS
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    23
                  </Typography>
                </Box>
              </Box>
              <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderRadius: 2 }}>
            <SearchIcon sx={{ color: 'gray' }} />
            <InputBase
              sx={{ ml: 1, flex: 1, color: 'gray' }}
              placeholder="Search for Tenant"
            />
          </Paper>
          
          <Paper sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            px: 2, 
            py: 1,
            borderRadius: 2,
            color: 'white',
            bgcolor: '#1A365D'
          }}>
            <Typography variant="body2">Last 30 Days</Typography>
            <KeyboardArrowDownIcon />
          </Paper>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            bgcolor: 'transparent',
            color: 'white',
            height: 300,
            p: 0,
            border: 'none',
            boxShadow: 'none'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyUsageData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'white' }}
                  tickLine={{ stroke: 'white' }}
                  axisLine={{ stroke: 'white' }}
                />
                <YAxis 
                  tick={{ fill: 'white' }}
                  tickLine={{ stroke: 'white' }}
                  axisLine={{ stroke: 'white' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#8ECDFF" 
                  strokeWidth={3}
                  fill="#8ECDFF"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
              Tenants Data Usage Pattern
            </Typography>
          </Paper>
        </Grid>

        {/* Tenant Usage Table */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            bgcolor: 'transparent',
            color: 'white',
            height: 300,
            overflow: 'auto',
            border: 'none',
            boxShadow: 'none'
          }}>
            <TableContainer component={Box} sx={{ maxHeight: 280 }}>
              <Table size="small" sx={{ 
                '& .MuiTableCell-root': { 
                  color: 'white',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Data Usage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenantLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      </TableCell>
                    </TableRow>
                  ) : tenantError ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Error loading data
                      </TableCell>
                    </TableRow>
                  ) : processedTenantData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No tenant data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    processedTenantData.map((tenant) => (
                      <TableRow 
                        key={tenant.id}
                        sx={{ 
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                          bgcolor: tenant.id % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <TableCell>{tenant.id}</TableCell>
                        <TableCell>{tenant.name}</TableCell>
                        <TableCell align="right">{tenant.dataUsage}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
              Top Tenants
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}