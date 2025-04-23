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
  CardContent
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_TENANT_USAGE, GET_DAILY_DATA_USAGE } from '../../utils/queries';

// Import icons
import StorageIcon from '@mui/icons-material/Storage';
import PersonIcon from '@mui/icons-material/Person';
import RouterIcon from '@mui/icons-material/Router';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';

// Import chart components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Interface for tenant usage data
interface TenantUsageData {
  id: string;
  tenant_id: string;
  data_used: number;
}

// Interface for daily data usage
interface DailyDataUsage {
  recorded_on: string;
  total_data_used: number;
}

export default function DashboardPage() {  
  // Fetch tenant usage data
  const { data: tenantData, loading: tenantLoading, error: tenantError } = useQuery(GET_TENANT_USAGE);
  
  // Fetch daily data usage for the chart
  const { data: dailyUsageData, loading: dailyUsageLoading, error: dailyUsageError } = useQuery(GET_DAILY_DATA_USAGE);

  // Format chart data from the query results
  const formatChartData = React.useMemo(() => {
    if (!dailyUsageData?.daily_data_usage) {
      // Return dummy data if API data is not available
      return [
        { date: 'Apr 18', usage: 120 },
        { date: 'Apr 19', usage: 145 },
        { date: 'Apr 20', usage: 160 },
        { date: 'Apr 21', usage: 178 },
        { date: 'Apr 22', usage: 190 },
        { date: 'Apr 23', usage: 210 },
        { date: 'Apr 24', usage: 225 },
      ];
    }
    
    return dailyUsageData.daily_data_usage.map((item: DailyDataUsage) => {
      // Ensure the data is properly formatted for the chart
      return {
        date: new Date(item.recorded_on).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        usage: typeof item.total_data_used === 'number' 
          ? Math.round(item.total_data_used / (1024 * 1024)) 
          : 0 // Fallback if data is not a number
      };
    });
  }, [dailyUsageData]);

  // Create cards data
  const metricsCards = [
    { title: 'Total Data Exchanged', value: '2.4 TB', icon: <StorageIcon sx={{ fontSize: 40 }} /> },
    { title: 'Hotspot Users', value: '152', icon: <PersonIcon sx={{ fontSize: 40 }} /> },
    { title: 'Online Routers', value: '35', icon: <RouterIcon sx={{ fontSize: 40 }} /> },
    { title: 'Fleets', value: '12', icon: <DirectionsCarIcon sx={{ fontSize: 40 }} /> },
    { title: 'Tenants', value: '8', icon: <BusinessIcon sx={{ fontSize: 40 }} /> },
  ];

  // Ensure we actually have data to display
  console.log('Chart data:', formatChartData);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      {card.value}
                    </Typography>
                    <Typography variant="body2">
                      {card.title}
                    </Typography>
                  </Box>
                  <Box>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Data Usage Box */}
      <Paper sx={{ 
        width: '100%', 
        mb: 4, 
        bgcolor: '#12274457',
        p: 3
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          Data Usage Analytics
        </Typography>
        <Grid container spacing={3}>
          {/* Graph */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 2, 
              height: 300, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: 'white'
            }}>
              {dailyUsageLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography>Loading chart data...</Typography>
                </Box>
              ) : dailyUsageError ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="error">
                    Error loading chart data: {dailyUsageError.message}
                  </Typography>
                </Box>
              ) : formatChartData.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography>No data available for chart</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={formatChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#333' }}
                      tickLine={{ stroke: '#333' }}
                    />
                    <YAxis 
                      tick={{ fill: '#333' }}
                      tickLine={{ stroke: '#333' }}
                      label={{ 
                        value: 'Data Usage (GB)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fill: '#333' }
                      }} 
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} GB`, 'Data Usage']}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '4px' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      name="Daily Data Usage" 
                      stroke="#2196f3" 
                      strokeWidth={2}
                      activeDot={{ r: 6, fill: '#2196f3', stroke: '#fff', strokeWidth: 2 }} 
                      dot={{ r: 4, fill: '#2196f3', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Tenant Usage Table */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: 300, overflow: 'auto' }}>
              <Typography variant="subtitle1" gutterBottom>
                Tenant Usage
              </Typography>
              {tenantLoading ? (
                <Typography>Loading tenant data...</Typography>
              ) : tenantError ? (
                <Typography color="error">
                  Error loading tenant data: {tenantError.message}
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tenant ID</TableCell>
                      <TableCell>Data Used (GB)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenantData?.data_usage?.map((tenant: TenantUsageData) => (
                      <TableRow key={tenant.id}>
                        <TableCell>{tenant.tenant_id}</TableCell>
                        <TableCell>{(tenant.data_used / 1024).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {!tenantData?.data_usage?.length && (
                      <TableRow>
                        <TableCell colSpan={2} align="center">No tenant data available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}