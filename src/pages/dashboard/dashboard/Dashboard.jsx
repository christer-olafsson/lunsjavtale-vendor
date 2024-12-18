/* eslint-disable react/prop-types */
import { AccountBalanceWalletOutlined, AddShoppingCartOutlined, ShoppingBasketOutlined } from '@mui/icons-material'
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { VENDOR_DASHBOARD } from './graphql/query';
import RecentSales from './RecentSales';
import SoldProducts from './SoldProducts';
import Loader from '../../../common/loader/Index';
import ErrorMsg from '../../../common/ErrorMsg/ErrorMsg';
import { ME } from '../../../graphql/query';

const boxStyle = {
  box: {
    minWidth: '300px',
    border: '1px solid lightgray',
    p: 2, borderRadius: '8px'
  },
  title: {
    fontSize: '14px', fontWeight: 600, mb: 1
  },
  value: {
    display: 'inline-flex',
    gap: '10px',
    fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600
  }
}

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('')
  const [data, setData] = useState({})

  const { data: user } = useQuery(ME)

  const { loading, error } = useQuery(VENDOR_DASHBOARD, {
    variables: {
      dateRange
    },
    onCompleted: (res) => {
      setData(res.vendorDashboard.data)
    }
  });

  return (
    <Box maxWidth='xl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Velkommen, {user?.me.vendor.name}</Typography>
      {
        loading ? <Loader /> : error ? <ErrorMsg /> :
          <Stack gap={3}>
            <Stack direction='row' justifyContent='space-between' sx={{ minWidth: 200, mt: 2 }}>
              <Box />
              <FormControl sx={{ minWidth: '200px' }} size='small'>
                <InputLabel>Status</InputLabel>
                <Select
                  value={dateRange}
                  label="Status"
                  onChange={e => setDateRange(e.target.value)}
                >
                  <MenuItem value={'last-7-days'}>Siste 7 dager</MenuItem>
                  <MenuItem value={'last-30-days'}>Siste 30 dager</MenuItem>
                  <MenuItem value={'last-6-months'}>Siste 6 måneder</MenuItem>
                  <MenuItem value={'last-12-months'}>Siste 12 måneder</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={3}>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Dagens Salg</Typography>
                <Typography sx={boxStyle.value}>
                  <ShoppingBasketOutlined fontSize='large' />
                  {data?.salesToday}
                  <span>kr</span>
                </Typography>
              </Box>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Totale Bestillinger</Typography>
                <Typography sx={boxStyle.value}><AddShoppingCartOutlined fontSize='large' />{data?.totalOrders}</Typography>
              </Box>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Totalt Salg</Typography>
                <Typography sx={boxStyle.value}>
                  <AccountBalanceWalletOutlined fontSize='large' />
                  {data?.totalSales}
                  <span>kr</span>
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ width: { xs: '100%', lg: '60%' } }}>
              <RecentSales data={data} />
            </Box>

            <Box sx={{ width: { xs: '100%', lg: '60%' } }}>
              <SoldProducts data={data} />
            </Box>

          </Stack>
      }
    </Box>
  )
}

export default Dashboard