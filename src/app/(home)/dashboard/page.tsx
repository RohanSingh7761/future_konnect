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
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_TENANT_USAGE } from '../../utils/queries';

// Import icons
import StorageIcon from '@mui/icons-material/Storage';
import PersonIcon from '@mui/icons-material/Person';
import RouterIcon from '@mui/icons-material/Router';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';

// Import chart components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Create dummy chart data
const chartData = [
  { name: 'Jan', usage: 4000 },
  { name: 'Feb', usage: 3000 },
  { name: 'Mar', usage: 2000 },
  { name: 'Apr', usage: 2780 },
  { name: 'May', usage: 1890 },
  { name: 'Jun', usage: 2390 },
  { name: 'Jul', usage: 3490 },
];

// Interface for tenant usage data
interface TenantUsageData {
  id: string;
  tenant_id: string;
  data_used: number;
}

export default function DashboardPage() {  
  // Fetch tenant usage data
  const { data: tenantData, loading: tenantLoading, error: tenantError } = useQuery(GET_TENANT_USAGE);

  // Create cards data
  const metricsCards = [
    { title: 'Total Data Exchanged', value: '2.4 TB', icon: <StorageIcon sx={{ fontSize: 40 }} /> },
    { title: 'Hotspot Users', value: '152', icon: <PersonIcon sx={{ fontSize: 40 }} /> },
    { title: 'Online Routers', value: '35', icon: <RouterIcon sx={{ fontSize: 40 }} /> },
    { title: 'Fleets', value: '12', icon: <DirectionsCarIcon sx={{ fontSize: 40 }} /> },
    { title: 'Tenants', value: '8', icon: <BusinessIcon sx={{ fontSize: 40 }} /> },
  ];

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
            <Paper sx={{ p: 2, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
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