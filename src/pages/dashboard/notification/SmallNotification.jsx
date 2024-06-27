import { useQuery } from '@apollo/client';
import { QueryBuilder } from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import { USER_NOTIFICATIONS } from './query';
import { useState } from 'react';
import Loader from '../../../common/loader/Index';
import ErrorMsg from '../../../common/ErrorMsg/ErrorMsg';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

const SmallNotification = ({ onClose }) => {
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


  return (
    <Stack className='custom-scrollbar' justifyContent={ notifications?.length === 0 ? 'center' : 'none'} sx={{
      width: { xs: '300px', sm: '300px', md: '350px' },
      overflowY: 'auto',
      // minHeight: '500px',
      zIndex: 99999,
      bgcolor: '#fff',
      border: '1px solid lightgray',
      borderRadius: '8px', p: '10px 20px',
    }} gap={2}>
      {
        loading ? <Loader /> : error ? <ErrorMsg /> :
          notifications?.length === 0 ?
            <Typography sx={{ textAlign: 'center', color: 'gray' }}>No Notification</Typography> :
            notifications?.slice(0, 5).map(item => (
              <Box key={item.id}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'green' }}>{item.title}</Typography>
                <Link to={`/dashboard/orders/details/${item.objectId}`}>
                  <Typography onClick={onClose} sx={{ fontSize: '14px' }}>{item.message}</Typography>
                </Link>
                <Stack direction='row' alignItems='center' gap={.5} >
                  <QueryBuilder sx={{ fontSize: '12px' }} />
                  <Typography sx={{ fontSize: '12px' }}>{getTimeDifference(item.sentOn)}</Typography>
                </Stack>
              </Box>
            ))
      }
      {
        notifications?.length !== 0 &&
        <Link to='/dashboard/notifications'>
          <Button onClick={onClose}>See All</Button>
        </Link>
      }
    </Stack>
  )
}

export default SmallNotification