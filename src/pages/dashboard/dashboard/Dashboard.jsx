/* eslint-disable react/prop-types */
import { AccountBalance, AccountBalanceOutlined, AccountBalanceWalletOutlined, AddShoppingCartOutlined, FlipCameraAndroidOutlined, Info, PieChart, PublishOutlined, ShoppingBasketOutlined, TrendingUpOutlined, UploadOutlined } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { VENDOR_DASHBOARD } from './graphql/query';
import RecentSales from './RecentSales';
import SoldProducts from './SoldProducts';
import Loader from '../../../common/loader/Index';
import ErrorMsg from '../../../common/ErrorMsg/ErrorMsg';
import { ME } from '../../../graphql/query';
import CDialog from '../../../common/dialog/CDialog';
import CreateWithdrawReq from '../withdraw-req/CreateWithdrawReq';
import { WITHDRAW_REQ } from '../withdraw-req/graphql/query';
import { Link } from 'react-router-dom';

const boxStyle = {
  box: {
    minWidth: '300px',
    border: '1px solid lightgray',
    px: 2,
    py: 1.5,
    borderRadius: '8px',
    // background: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
    },
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    mb: 1,
    color: '#fff',
  },
  value: {
    display: 'inline-flex',
    color: '#fff',
    alignItems: 'center',
    gap: '10px',
    fontSize: { xs: '20px', lg: '26px' },
    fontWeight: 600,
  },
};

const Dashboard = () => {
  const [filter, setFilter] = useState('today');
  const [data, setData] = useState({});
  const [widthDrawReqDialogOpen, setWidthDrawReqDialogOpen] = useState(false);
  const [pendingWithdrawReq, setPendingWithdrawReq] = useState([])

  console.log(data)

  // useQuery(WITHDRAW_REQ, {
  //   notifyOnNetworkStatusChange: true,
  //   onCompleted: (res) => {
  //     setPendingWithdrawReq(res.withdrawRequests.edges.filter(item => item.node.status === 'pending').map(item => item.node))
  //   },
  // });

  const { data: user } = useQuery(ME);

  const { loading, error } = useQuery(VENDOR_DASHBOARD, {
    variables: { dateRange: filter },
    onCompleted: (res) => setData(res.vendorDashboard.data),
  });

  const colors = ['#1E88E5', '#D32F2F', '#388E3C', '#F57C00', '#7B1FA2'];

  return (
    <Box sx={{ maxWidth: 'xl', px: 3, py: 2 }}>
      <Typography sx={{ fontSize: { xs: '20px', lg: '28px' }, fontWeight: 700, mb: 3, color: 'primary.main' }}>
        Velkommen, {user?.me.vendor.name}
      </Typography>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMsg />
      ) : (
        <Stack gap={4}>
          {/* Filter Section */}
          <Stack direction="row" justifyContent="flex-end" alignItems="center">
            <FormControl sx={{ minWidth: '200px' }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filter}
                label="Status"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="last-30-days">Last 30 Days</MenuItem>
                <MenuItem value="lifetime">Lifetime</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Stat Boxes */}
          <Stack direction={{ xs: 'column', md: 'row' }} gap={2} flexWrap="wrap">
            <Box sx={{
              ...boxStyle.box,
              bgcolor: 'primary.main',
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={boxStyle.title}>Balansere</Typography>
                <IconButton
                  size="small"
                  variant="contained"
                  onClick={() => setWidthDrawReqDialogOpen(true)}
                >
                  <UploadOutlined color='white' />
                </IconButton>
              </Stack>
              <Typography sx={boxStyle.value}>
                <AccountBalanceWalletOutlined fontSize="large" />
                {user?.me?.vendor?.balance} kr
              </Typography>
            </Box>

            <CDialog openDialog={widthDrawReqDialogOpen}>
              <CreateWithdrawReq closeDialog={() => setWidthDrawReqDialogOpen(false)} />
            </CDialog>

            {[
              {
                title: 'Dagens Salg',
                value: data?.salesToday,
                icon: <ShoppingBasketOutlined fontSize="large" />,
                tooltip: 'Dette beløpet er salgsprisen for alle varer i dag',
                bgcolor: '#BC7AF9',
              },
              {
                title: 'Totale Bestillinger',
                value: data?.totalOrders,
                icon: <AddShoppingCartOutlined fontSize="large" />,
                bgcolor: '#1E88E5',
              },
              {
                title: 'Totalt Salg',
                value: data?.totalSales,
                icon: <AccountBalanceOutlined fontSize="large" />,
                tooltip: 'Dette beløpet er total salgspris for varer',
                bgcolor: '#388E3C',
              },
              // {
              //   title: 'Totale inntekter',
              //   value: data?.totalRevenue,
              //   icon: <TrendingUpOutlined fontSize="large" />,
              //   bgcolor: '#A35C7A',
              // },
              // {
              //   title: 'Totalt uttak',
              //   value: data?.totalWithdraw,
              //   icon: <PublishOutlined fontSize="large" />,
              //   // pendingWithdrawReqLength: pendingWithdrawReq?.length > 0 ? pendingWithdrawReq?.length : '',
              //   bgcolor: '#F57C00',
              // },
            ].map((item, index) => (
              <Box key={index} sx={{
                ...boxStyle.box,
                bgcolor: item.bgcolor,
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={boxStyle.title}>{item.title}</Typography>
                  {item.tooltip && (
                    <Tooltip title={item.tooltip}>
                      <IconButton>
                        <Info fontSize="small" color='white' />
                      </IconButton>
                    </Tooltip>
                  )}
                  {
                    item.pendingWithdrawReqLength &&
                    <Link className='link' to='/dashboard/withdraw-req'>
                      <Typography sx={{ color: 'red', fontWeight: 600 }}>pending ( {item.pendingWithdrawReqLength} )</Typography>
                    </Link>
                  }
                </Stack>
                <Typography sx={boxStyle.value}>
                  {item.icon}
                  {item.value}
                  <span>kr</span>
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Recent Sales and Sold Products */}
          <Stack gap={2}>
            <RecentSales data={data} />
            <SoldProducts data={data} />
          </Stack>


        </Stack >
      )}
    </Box >
  );
};

export default Dashboard;
