import { ArrowRight, BorderColor, Search, TrendingFlat } from '@mui/icons-material'
import { Avatar, Box, Button, IconButton, Input, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ORDERS, SALES_HISTORIES } from './graphql/query';
import { format } from 'date-fns';
import Loader from '../../../common/loader/Index';
import ErrorMsg from '../../../common/ErrorMsg/ErrorMsg';
import DataTable from '../../../components/dashboard/DataTable';
import useIsMobile from '../../../hook/useIsMobile';

const SalesHistory = () => {
  const [salesHistories, setSalesHistories] = useState([])

  const isMobile = useIsMobile()
  const { loading, error: salesHistoryErr } = useQuery(SALES_HISTORIES, {
    onCompleted: (res) => {
      setSalesHistories(res.salesHistories.edges.map(item => item.node));
    }
  });

  const columns = [
    {
      field: 'orderDate', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Order Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{format(params.row.createdOn, 'dd-MM-yyyy')}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'products', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Products</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center' gap={2}>
            <Avatar src={params.row.item.attachments.edges.find(item => item.node.isCover)?.node.fileUrl ?? 'noImage.png'} />
            <Stack>
              <Typography>{params.row.item.name}</Typography>
              <Typography sx={{ fontSize: '12px' }}><b>{params.row.priceWithTax} kr</b>  {params.row.item.category.name}</Typography>
            </Stack>
          </Stack>
        )
      }
    },
    {
      field: 'ordered Company', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Ordered Company</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            {/* <Link to={`/dashboard/customers/details/${params.row.order.company.id}`}> */}
            <Typography variant='body2'>{params.row.order.company.name}</Typography>
            {/* </Link> */}
            <Typography sx={{ fontSize: '12px' }}>{params.row.order.company.email}</Typography>
          </Stack>
        )
      }
    },

    {
      field: 'quentity', width: 120,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Quantity</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.orderedQuantity}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'totalprice', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Total Price</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.totalPriceWithTax} kr</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'dueAmount', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Due Amount</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.dueAmount} kr</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'status', headerName: 'Status',
      width: isMobile ? 150 : undefined,
      flex: isMobile ? undefined : 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Box sx={{
            display: 'inline-flex',
            padding: '1px 12px',
            bgcolor: row.order.status === 'Cancelled'
              ? 'red'
              : row.order.status === 'Confirmed'
                ? 'lightgreen'
                : row.order.status === 'Delivered'
                  ? 'green'
                  : row.order.status === 'Processing'
                    ? '#8294C4'
                    : row.order.status === 'Payment-completed'
                      ? 'blue'
                      : row.order.status === 'Ready-to-deliver'
                        ? '#01B8A9'
                        : 'yellow',
            color: row.order.status === 'Placed'
              ? 'dark' : row.order.status === 'Payment-pending'
                ? 'dark' : row.order.status === 'Confirmed' ? 'dark' : '#fff',
            borderRadius: '4px',
          }}>
            <Typography sx={{ fontWeight: 500 }} variant='body2'>{row.order.status}</Typography>
          </Box>
        )
      }
    },


  ];


  return (
    <Box maxWidth='xxl'>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Sales History</Typography>
        {/* <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '480px',
          bgcolor: '#fff',
          width: '100%',
          border: '1px solid lightgray',
          borderRadius: '4px',
          pl: 2
        }}>
          <Input fullWidth disableUnderline placeholder='Search Order Id' />
          <IconButton><Search /></IconButton>
        </Box> */}
      </Stack>
      <Box mt={3}>
        {
          loading ? <Loader /> : salesHistoryErr ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={salesHistories}
            />
        }
      </Box>
    </Box>
  )
}

export default SalesHistory