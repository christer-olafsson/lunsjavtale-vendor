/* eslint-disable react/prop-types */
import { useQuery } from '@apollo/client'
import { Info } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ME } from '../../../graphql/query'
import CDialog from '../../../common/dialog/CDialog'
import EditItem from './EditItem'

const ProductCard = ({ data, fetchCategory }) => {
  const [productEditDialogOpen, setProductEditDialogOpen] = useState(false);

  const { data: user } = useQuery(ME)


  return (
    <Box sx={{
      width: { xs: '100%', md: '300px' },
      bgcolor: data.node.availability ? 'light.main' : '#fff',
      p: { xs: 1, lg: 2.5 },
      borderRadius: '8px',
      border: '1px solid lightgray',
      opacity: data.node.availability ? '1' : '.6'
    }}>
      <img style={{ width: '100%', height: '138px', objectFit: 'cover', borderRadius: '4px' }}
        src={data?.node.attachments.edges.find(item => item.node.isCover)?.node.fileUrl || '/noImage.png'} alt="" />
      <Stack>
        <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>{data?.node.name}</Typography>
        <Stack direction='row' flexWrap='wrap' alignItems='center' gap={.5}>
          <Typography
            sx={{
              fontSize: '12px',
              bgcolor: data.node.availability ? 'primary.main' : 'darkgray',
              color: '#fff',
              px: 1, borderRadius: '4px',
            }}>
            {data.node.availability ? 'Available' : 'Not Available'}
          </Typography>
          {
            data?.node.weeklyVariants.edges.length > 0 &&
            data?.node.weeklyVariants.edges.map((item, id) => (
              <Typography
                key={id}
                sx={{
                  fontSize: '12px',
                  bgcolor: 'blue',
                  color: '#fff',
                  px: 1, borderRadius: '4px',
                }}>
                {item.node.name}
              </Typography>
            ))
          }
          <Typography sx={{ fontSize: '12px', fontWeight: 500, border: '1px solid lightgray', px: 1, borderRadius: '4px' }}>{data.node.category?.name ? data.node.category?.name : 'Uncategorised'}</Typography>
        </Stack>
        {/* <Stack direction='row' alignItems='center' gap={1}>
                      <Rating value={4} size='small' sx={{ color: 'primary.main' }} readOnly />
                      <Typography sx={{ fontSize: '12px' }}>86 Rating</Typography>
                      <span>|</span>
                      <Typography sx={{ fontSize: '12px' }}>43 Delivery</Typography>
                    </Stack> */}
        <Stack direction='row' alignItems='center' justifyContent='space-between' gap={1} mt={1}>
          <Typography sx={{ fontSize: '16px' }}><i style={{ fontWeight: 600 }}>kr </i> {data.node.priceWithTax}
            <i style={{ fontWeight: 400, fontSize: '13px' }}> (tax)</i> </Typography>
          <Typography sx={{ fontSize: { xs: '14px', lg: '14px', color: '#848995' } }}><i style={{ fontWeight: 600 }}>kr </i>{data.node.actualPrice} </Typography>
        </Stack>
      </Stack>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mt={1}>
        <Button disabled={user?.me.vendor.isBlocked} variant='outlined' onClick={() => setProductEditDialogOpen(true)} sx={{ bgcolor: '#fff', whiteSpace: 'nowrap' }}>Oppdatering</Button>
        <Link to={`/dashboard/food-item/food-details/${data.node.id}`}>
          <IconButton><Info /></IconButton>
        </Link>
      </Stack>
      {/* product edit dialog */}
      <CDialog openDialog={productEditDialogOpen}>
        <EditItem fetchCategory={fetchCategory} data={data.node} closeDialog={() => setProductEditDialogOpen(false)} />
      </CDialog>
    </Box>
  )
}

export default ProductCard