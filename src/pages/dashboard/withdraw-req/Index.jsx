import { useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { WITHDRAW_REQ } from './graphql/query';
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { DeleteOutlineOutlined, DoneAll, EditOutlined, EmailOutlined, LocalPhoneOutlined, MailOutlined, ModeEditOutlineOutlined, Search, StoreOutlined } from '@mui/icons-material';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import CreateWithdrawReq from './CreateWithdrawReq';
import CDialog from '../../../common/dialog/CDialog';
import LoadingBar from '../../../common/loadingBar/LoadingBar';
import ErrorMsg from '../../../common/ErrorMsg/ErrorMsg';
import DataTable from '../../../components/dashboard/DataTable';
import EditWithdrawReq from './EditWithdrawReq';
import { ME } from '../../../graphql/query';

const WithdrawReq = () => {
  const [withdrawReq, setWithdrawReq] = useState([])
  const [searchText, setSearchText] = useState('')
  const [withdrawReqDialogOpen, setWithdrawReqDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editData, setEditData] = useState({})

  const { data: user } = useQuery(ME)

  const [fetchWithdrawReq, { loading: WithdrawReqLoading, error: WithdrawReqErr }] = useLazyQuery(WITHDRAW_REQ, {
    // variables: {
    //   vendorTitle: searchText
    // },
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setWithdrawReq(res.withdrawRequests.edges.map(item => item.node))
    },
  });
  console.log(withdrawReq)
  const handleEditDialog = (data) => {
    setEditDialogOpen(true)
    setEditData(data)
  }


  // const [vendorDelete, { loading: deleteLoading }] = useMutation(VENDOR_DELETE, {
  //   onCompleted: (res) => {
  //     fetchVendors()
  //     toast.success(res.vendorDelete.message)
  //     setDeleteDialogOpen(false)
  //   },
  //   onError: (err) => {
  //     toast.error(err.message)
  //   }
  // });

  const columns = [

    {
      field: 'reqOn', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Placed On</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', }} justifyContent='center'>
          <Typography sx={{ fontWeight: 600 }} > {format(params.row.createdOn, 'dd-MM-yyyy')}</Typography>
        </Stack >
      )
    },
    {
      field: 'withdrawAmount', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Amount</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', }} justifyContent='center'>
          <Typography sx={{ fontWeight: 600 }} > {params.row.withdrawAmount} kr</Typography>
        </Stack >
      )
    },
    {
      field: 'status', width: 150,
      renderHeader: (params) => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status </Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{
              fontSize: { xs: '12px', md: '16px' },
              bgcolor: row.status === 'pending' ? 'yellow'
                : row.status === 'accepted' ? 'lightgreen'
                  : row.status === 'completed' ? 'green'
                    : 'red',
              color: row.status === 'pending' ?
                'dark' : row.status === 'accepted' ?
                  'dark' : row.status === 'completed' ?
                    '#fff' : '#fff',
              px: 1, borderRadius: '8px',
            }}>&#x2022; {row.status}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'edit', headerName: '', width: 100,
      renderCell: (params) => {
        return (
          <IconButton disabled={params.row.status !== 'pending' || user?.me.vendor.isBlocked} onClick={() => handleEditDialog(params.row)} sx={{
            borderRadius: '5px',
            width: { xs: '30px', md: '40px' },
            height: { xs: '30px', md: '40px' },
          }}
          >
            <EditOutlined sx={{}} fontSize='small' />
          </IconButton>
        )
      },
    },
    {
      field: 'note', headerName: '', flex: 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Note</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', }} justifyContent='center'>
          <Typography sx={{ fontWeight: 600 }} > {params.row.note}</Typography>
        </Stack >
      )
    }
  ];


  useEffect(() => {
    fetchWithdrawReq()
  }, [])


  return (
    <Box maxWidth='xl'>
      <Stack direction='row' gap={1} alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Withdraw Request</Typography>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Stack direction='row' gap={2}>
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
            <Input onChange={e => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Search.. ' />
            <IconButton><Search /></IconButton>
          </Box> */}
          <Box sx={{ minWidth: 200 }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
              >
                <MenuItem value={'all'}>All </MenuItem>
                {/* <MenuItem value={10}>New</MenuItem> */}
                <MenuItem value={'pending'}>Pending</MenuItem>
                <MenuItem value={'approved'}>Approved</MenuItem>
                <MenuItem value={'rejected'}>Rejected</MenuItem>
                {/* <MenuItem value={40}>Unavailable</MenuItem> */}
              </Select>
            </FormControl>
          </Box>
        </Stack>
        <Button disabled={user?.me.vendor.isBlocked} onClick={() => setWithdrawReqDialogOpen(true)} variant='contained'>Request Withdraw</Button>
      </Stack>
      {/* create withdraw req  */}
      <CDialog openDialog={withdrawReqDialogOpen}>
        <CreateWithdrawReq
          fetchWithdrawReq={fetchWithdrawReq}
          closeDialog={() => setWithdrawReqDialogOpen(false)}
        />
      </CDialog>
      {/* edit withdraw req  */}
      <CDialog openDialog={editDialogOpen}>
        <EditWithdrawReq
          data={editData}
          fetchWithdrawReq={fetchWithdrawReq}
          closeDialog={() => setEditDialogOpen(false)}
        />
      </CDialog>
      {/* delete  */}
      {/* <CDialog closeDialog={() => setDeleteDialogOpen(false)} maxWidth='sm' openDialog={deleteDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete company</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this company? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <Button onClick={() => setDeleteDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
            <CButton isLoading={deleteLoading} onClick={handleCompanyDelete} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
          </Stack>
        </Box>
      </CDialog> */}
      <Box mt={{ xs: 10, md: 3 }}>
        {
          WithdrawReqLoading ? <LoadingBar /> : WithdrawReqErr ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={withdrawReq}
            />
        }
      </Box>
    </Box>
  )
}

export default WithdrawReq