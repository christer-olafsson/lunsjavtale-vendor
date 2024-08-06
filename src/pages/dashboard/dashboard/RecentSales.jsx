/* eslint-disable react/prop-types */
import { ArrowForwardIos, KeyboardArrowRight } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const RecentSales = ({ data }) => {
  const [recentOrders, setRecentOrders] = useState([])

  const columns = [
    {
      field: 'orderDate', width: 150,
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
      field: 'deliveryDate', headerName: 'Prce', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Delivery Date</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
            {params.row.deliveryDate}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'totalPrice', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Total Price</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
            <span style={{ fontWeight: 400 }}>kr </span>
            {params.row?.finalPrice}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'status', headerName: 'Status', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Box sx={{
            display: 'inline-flex',
            padding: '1px 12px',
            bgcolor: row.status === 'Cancelled'
              ? 'red'
              : row.status === 'Confirmed'
                ? 'lightgreen'
                : row.status === 'Delivered'
                  ? 'green'
                  : 'yellow',
            color: row.status === 'Placed' ? 'dark' : row.status === 'Payment-pending' ? 'dark' : '#fff',
            borderRadius: '4px',
          }}>
            <Typography sx={{ fontWeight: 500 }} variant='body2'>{row.status}</Typography>
          </Box>
        )
      }
    },
  ];


  const rows = recentOrders?.map(item => ({
    id: item.pk,
    deliveryDate: item.fields.delivery_date,
    finalPrice: item.fields.final_price,
    createdOn: item.fields.created_on,
    status: item.fields.status
  }))


  useEffect(() => {
    setRecentOrders(data.recentOrders)
  }, [data])



  return (
    <Box sx={{
      border: '1px solid lightgray',
      p: 2, borderRadius: '8px'
    }}>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h5'>Recent Sales</Typography>
        <Link to='/dashboard/sales-history'>
          <Button endIcon={<KeyboardArrowRight />}>See All</Button>
        </Link>
      </Stack>

      <Box mt={3}>
        <DataGrid
          autoHeight
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 4,
              },
            },
          }}
          pageSizeOptions={[4]}
          columns={columns}
          rows={rows ?? []}
        />
      </Box>
    </Box>
  )
}

export default RecentSales