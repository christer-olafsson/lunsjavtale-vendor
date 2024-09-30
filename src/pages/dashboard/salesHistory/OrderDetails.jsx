import { Add, ArrowBack, ArrowDropDown, Download, } from '@mui/icons-material';
import { Avatar, Box, Button, Collapse, Divider, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ORDER } from './graphql/query';
import { useLazyQuery } from '@apollo/client';
import SelectedStaffs from './SelectedStaffs';
import { format } from 'date-fns';
import ErrorMsg from '../../../common/ErrorMsg/ErrorMsg';
import Loader from '../../../common/loader/Index';


const OrderDetails = () => {
  const [order, setOrder] = useState([]);
  const [selectedStaffDetailsId, setSelectedStaffDetailsId] = useState('')


  const { id } = useParams()
  const navigate = useNavigate()

  const [fetchOrder, { loading, error: orderErr }] = useLazyQuery(ORDER, {
    fetchPolicy: 'network-only',
    variables: {
      id,
    },
    onCompleted: (res) => {
      setOrder(res.order)
    },
  });


  const handleSelectedStaffsDetails = (data) => {
    if (selectedStaffDetailsId) {
      setSelectedStaffDetailsId('')
    } else {
      setSelectedStaffDetailsId(data.id)

    }
  }
  console.log(order)

  useEffect(() => {
    fetchOrder()
  }, [])

  if (loading) {
    return <Loader />
  }
  if (orderErr) {
    return <ErrorMsg />
  }
  console.log(order)

  return (
    <Box maxWidth='xl'>
      <Stack direction='row' gap={2}>
        <IconButton onClick={() => navigate(- 1)}>
          <ArrowBack />
        </IconButton>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Order Details</Typography>
      </Stack>

      <Box mt={2}>

        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' gap={3}>
          <Stack>
            <Stack direction='row' alignItems='center'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Status:</b></Typography>
              <Stack alignItems='center' sx={{
                display: 'inline-flex',
                padding: '0px 12px',
                bgcolor:
                  order?.status === 'Cancelled' ? 'red' :
                    order?.status === 'Placed' ? '#6251DA' :
                      order?.status === 'Updated' ? '#6251DA' :
                        order?.status === 'Confirmed' ? '#433878' :
                          order?.status === 'Delivered' ? 'green' :
                            order?.status === 'Processing' ? '#B17457' :
                              order?.status === 'Payment-completed' ? '#00695c' :
                                order?.status === 'Ready-to-deliver' ? '#283593' :
                                  order?.status === 'Payment-pending' ? '#c2185b' :
                                    '#616161',
                color: '#FFF',
                borderRadius: '4px',
                minWidth: '150px',
              }}>
                <Typography sx={{ fontWeight: 600, }} >{order?.status}</Typography>
              </Stack>
            </Stack>
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Order ID:</b></Typography>
              <Typography>#{order?.id}</Typography>
            </Stack>
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Ordered On:</b></Typography>
              <Box >
                {
                  order?.createdOn &&
                  <Typography sx={{ whiteSpace: 'nowrap' }}>
                    <b>{format(order?.createdOn, 'dd-MM-yyyy')}</b>
                    <span style={{ fontSize: '13px', marginLeft: '5px' }}>{format(order?.createdOn, 'hh:mm a')}</span>
                  </Typography>
                }
              </Box>
            </Stack>
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Delivery Date:</b></Typography>
              <Typography sx={{ fontWeight: 600 }}>{order?.deliveryDate}</Typography>
            </Stack>
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Payment Type:</b></Typography>
              <Typography>{order?.paymentType === 'online' ? 'Vipps' : order?.paymentType}</Typography>
            </Stack>
            {
              order?.coupon &&
              <Stack direction='row'>
                <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Coupon:</b></Typography>
                <Typography sx={{ bgcolor: 'coral', px: 1, borderRadius: '4px', color: '#fff' }}>{order?.coupon.name}</Typography>
              </Stack>
            }
            {
              order?.discountAmount &&
              <Stack direction='row'>
                <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Discount Amount:</b></Typography>
                <Typography>{order?.discountAmount} kr</Typography>
              </Stack>
            }
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Customer Allowance:</b></Typography>
              <Typography>{order?.companyAllowance ?? '0'} %</Typography>
            </Stack>
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Final Price:</b></Typography>
              <Typography sx={{ color: 'Highlight', fontWeight: 600 }}>{order?.finalPrice ?? '0'} kr</Typography>
            </Stack>
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Company Due Amount:</b></Typography>
              <Stack direction='row'>
                <Typography sx={{ fontWeight: 600, color: 'coral' }} mr={1}>{order?.companyDueAmount} kr </Typography>
              </Stack>
            </Stack>
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Staffs Due Amount:</b></Typography>
              <Stack direction='row'>
                <Typography sx={{ fontWeight: 600, color: 'coral' }} mr={1}>{order?.employeeDueAmount} kr </Typography>
              </Stack>
            </Stack>
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Paid Amount:</b></Typography>
              <Typography sx={{ fontWeight: 600, color: 'green' }}>{order?.paidAmount} kr</Typography>
            </Stack>
            {
              order?.note &&
              <Typography sx={{
                fontSize: '16px',
                border: '1px solid lightgray',
                p: 1, mt: 1, borderRadius: '8px',
                maxWidth: '400px',
                color: 'coral'
              }}>
                Note: <b>{order?.note}</b>
              </Typography>
            }
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 4, md: 3, lg: 10 }}>
            <Box>
              <Typography variant='h5' mb={1}>Billing Address</Typography>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>Address:</b></Typography>
                <Typography>{order?.billingAddress?.address}</Typography>
              </Stack>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>First Name:</b></Typography>
                <Typography>{order?.billingAddress?.firstName}</Typography>
              </Stack>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>Last Name:</b></Typography>
                <Typography>{order?.billingAddress?.lastName}</Typography>
              </Stack>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>Phone:</b></Typography>
                <Typography>{order?.billingAddress?.phone}</Typography>
              </Stack>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>Sector:</b></Typography>
                <Typography>{order?.billingAddress?.sector}</Typography>
              </Stack>
            </Box>
            <Divider sx={{ display: { xs: 'none', md: 'block' } }} orientation="vertical" />
            <Box>
              <Typography variant='h5' mb={1}>Shipping Address</Typography>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>Address:</b></Typography>
                <Typography>{order?.shippingAddress?.address}</Typography>
              </Stack>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>Name:</b></Typography>
                <Typography>{order?.shippingAddress?.fullName}</Typography>
              </Stack>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>City:</b></Typography>
                <Typography>{order?.shippingAddress?.city}</Typography>
              </Stack>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>Phone:</b></Typography>
                <Typography>{order?.shippingAddress?.phone}</Typography>
              </Stack>
              <Stack direction='row'>
                <Typography sx={{ width: '100px', whiteSpace: 'nowarp' }}> <b>Post Code:</b></Typography>
                <Typography>{order?.shippingAddress?.postCode}</Typography>
              </Stack>
              {
                order?.shippingAddress?.instruction &&
                <Typography sx={{
                  fontSize: '16px',
                  border: '1px solid lightgray',
                  p: 1, mt: 1, borderRadius: '8px',
                  maxWidth: '400px'
                }}>
                  Instruction: <b>{order?.shippingAddress?.instruction}</b>
                </Typography>
              }
            </Box>
          </Stack>
        </Stack>
        <Divider sx={{ mt: 3 }} />

        <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent='space-between' mt={3} gap={6}>

          <Box>

            <Stack gap={3}>
              {
                loading ? <Loader /> : orderErr ? <ErrorMsg /> :
                  !order?.orderCarts?.edges ? <Typography>Not Found!</Typography> :
                    order?.orderCarts?.edges.map(data => (
                      <Stack key={data.node.id}>

                        <Stack sx={{
                          border: '1px solid lightgray',
                          maxWidth: '800px',
                          borderRadius: '8px',
                          p: 1
                        }} direction={{ xs: 'column', md: 'row' }} gap={{ xs: 0, md: 2 }} alignItems={{ xs: 'start', md: 'center' }} justifyContent='space-between'>
                          <Stack direction={{ xs: 'row', md: 'row' }} gap={{ xs: 0, md: 1 }} alignItems='center'>
                            <img style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              margin: '10px',
                              border: '1px solid lightgray'
                            }} src={data?.node.item.attachments?.edges.find(item => item.node.isCover)?.node.fileUrl ?? "/noImage.png"} alt="" />
                            <Box mb={{ xs: 0, md: 2 }}>
                              <Typography sx={{ fontSize: { xs: '14', md: '18px' }, fontWeight: 600 }}>{data?.node.item.name}</Typography>
                              <Typography variant='body2'>Category: <b>{data?.node.item.category.name}</b></Typography>
                              <Typography>Price: <b>{data?.node.item.priceWithTax}</b> kr</Typography>
                              {
                                data?.node.ingredients?.edges &&
                                <Box>
                                  <Typography sx={{ fontWeight: 600 }}>Ingredients: </Typography>
                                  {
                                    data?.node.ingredients?.edges.map(item => (
                                      <ul key={item.node.id}>
                                        <li>{item.node.name}</li>
                                      </ul>
                                    ))
                                  }
                                </Box>
                              }

                            </Box>
                          </Stack>
                          <Stack gap={.5} mr={2}>
                            <Typography>Quantity: <b>{data?.node.orderedQuantity}</b> </Typography>
                            <Typography>Total Price: <b>{data?.node.totalPriceWithTax}</b> kr</Typography>
                            <Button sx={{ whiteSpace: 'nowrap' }} onClick={() => handleSelectedStaffsDetails(data.node)} variant='outlined' size='small' endIcon={<ArrowDropDown />}>
                              Selected Staffs ({data?.node.users?.edges?.length})
                            </Button>
                          </Stack>
                        </Stack>
                        <Collapse in={selectedStaffDetailsId === data.node.id}>
                          <SelectedStaffs data={data?.node} />
                        </Collapse>
                      </Stack>
                    ))
              }
            </Stack>

            {/* order timeline */}
            <Stack mt={4}>
              <Typography variant='h5' sx={{ px: 3, mb: 2 }}>Order Timeline</Typography>
              <Box sx={{ px: 3 }}>
                {order?.statuses?.edges.map((status, index) => (
                  <Box key={status.node.id} sx={{ display: 'flex', mb: 2 }}>
                    <Box sx={{
                      width: 2,
                      bgcolor: 'primary.main',
                      mr: 2,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: -4,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                      }
                    }} />
                    <Box>
                      <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                        {status.node.status}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {format(status?.node.createdOn, 'dd-MM-yyyy')}
                        <span style={{ fontSize: '12px', marginLeft: '5px', fontWeight: 600 }}>{format(status?.node.createdOn, 'hh:mm a')}</span>
                      </Typography>
                      {status.node.note && (
                        <Typography variant='body2' sx={{ mt: 1 }}>
                          {status.node.note}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Box>

          <Stack sx={{
            px: 3
          }} gap={2}>
            <Typography variant='h5'>Customer Information</Typography>
            <Stack direction='row' gap={1}>
              <Avatar src={order?.company?.logoUrl ?? '/noImage.png'} />
              <Box>
                <Typography sx={{ fontSize: '16px' }}>Name: <b>
                  <Link to={`/dashboard/customers/details/${order?.company?.id}`}>{order?.company?.name}</Link>
                </b></Typography>
                <Typography sx={{ fontSize: '16px' }}>Email: <b>{order?.company?.email}</b></Typography>
                <Typography sx={{ fontSize: '16px' }}>Contact: <b>{order?.company?.contact}</b></Typography>
                <Typography sx={{ fontSize: '16px' }}>PostCode: <b>{order?.company?.postCode}</b></Typography>
              </Box>
            </Stack>

          </Stack>


        </Stack>

      </Box >
    </Box >
  )
}

export default OrderDetails