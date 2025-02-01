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
    // {
    //   field: 'id', headerName: '', width: 100,
    //   renderHeader: () => (
    //     <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>ID</Typography>
    //   ),
    //   renderCell: (params) => (
    //     <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
    //       <Link to={`/dashboard/sales-history/${params.row.id}`}>
    //         <Typography sx={{ fontSize: { xs: '14px', md: '16px' } }}>&#x2022; {params.row.id}</Typography>
    //       </Link>
    //     </Stack>
    //   ),
    // },
    {
      field: 'Date', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Dato</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}><b>{format(params.row.createdOn, 'dd-MM-yyyy')}</b>
            </Typography>
            <Typography style={{ fontSize: '14px', }}>{format(params.row?.createdOn, 'hh:mm a')}</Typography>
            {/* <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}> Levering: <b>{format(params.row.deliveryDate, 'dd-MM-yyyy')}</b> </Typography> */}
          </Stack>
        )
      }
    },
    {
      field: 'products', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Produkter</Typography>
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
      field: 'ordered Company', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Bestilt Firma</Typography>
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
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Mengde</Typography>
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
      field: 'productPrice', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Produktpris</Typography>
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
      field: 'supplier revenue(comission)', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Inntekter</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row?.vendorCommission}%</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'totalPrice', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Totalpris</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{(params.row.totalPriceWithTax - params.row.ownerCommission)?.toFixed(2)} kr</Typography>
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
            bgcolor: {
              Placed: '#6251DA',
              Updated: '#6251DA',
              Confirmed: '#433878',
              Processing: '#B17457',
              Delivered: 'green',
              'Payment-completed': '#00695c',
              'Ready-to-deliver': '#283593',
              'Payment-pending': '#c2185b',
              Cancelled: 'red',
            }[row.order.status],
            color: '#fff',
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
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Salgs Historie</Typography>
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
          <Input fullWidth disableUnderline placeholder='Søk Ordre Id' />
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