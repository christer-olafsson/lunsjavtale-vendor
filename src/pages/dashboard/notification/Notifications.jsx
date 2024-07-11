import { Box, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { USER_NOTIFICATIONS } from './query';
import { useQuery } from '@apollo/client';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Loader from '../../../common/loader/Index';
import ErrorMsg from '../../../common/ErrorMsg/ErrorMsg';
import DataTable from '../../../components/dashboard/DataTable';
import { AccessTime } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([])

  const { loading, error } = useQuery(USER_NOTIFICATIONS, {
    onCompleted: (res) => {
      setNotifications(res.userNotifications.edges.map(item => item.node))
    }
  });

  const getTimeDifference = (isoString) => {
    const date = parseISO(isoString);
    return formatDistanceToNow(date, { addSuffix: true });
  };


  const columns = [
    {
      field: 'Time', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Time</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={.5} alignItems='center'>
            <AccessTime sx={{ fontSize: '16px', color: row.isSeen ? 'gray' : 'green' }} />
            <Typography sx={{
              color: row.isSeen ? 'gray' : 'green'
            }} variant='body2'>{getTimeDifference(row.sentOn)}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'title', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Title</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{
              color: row.isSeen ? 'gray' : 'green'
            }}>{row.title}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'Message', flex: 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Message</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            {/* <Link to={`/dashboard/orders/details/${row.objectId}`}> */}
              <Typography sx={{
                color: row.isSeen ? 'gray' : 'green'
              }}>{row.message}</Typography>
            {/* </Link> */}
          </Stack>
        )
      }
    },
  ]
  return (
    <Box maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>All Notifications</Typography>
      <Box mt={3}>
        {
          loading ? <Loader /> : error ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={notifications ?? []}
            />
        }
      </Box>
    </Box>
  )
}

export default Notifications