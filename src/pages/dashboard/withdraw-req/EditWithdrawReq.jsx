/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import { Close } from '@mui/icons-material'
import { Box, FormControl, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { WITHDRAW_REQ_MUTATION } from './graphql/mutation';
import CButton from '../../../common/CButton/CButton';


const EditWithdrawReq = ({ data, fetchWithdrawReq, closeDialog }) => {
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    note: '',
    status: 'pending',
    withdrawAmount: '',
  })

  const [withdrawReqMutation, { loading }] = useMutation(WITHDRAW_REQ_MUTATION, {
    onCompleted: (res) => {
      fetchWithdrawReq()
      toast.success(res.withdrawRequestMutation.message)
      closeDialog()
    },
    onError: (err) => {
      toast.error(err.message)
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          setErrors(extensions.errors)
        }
      }
    }
  });

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }

  const handleUpdate = () => {
    if (!payload.withdrawAmount) {
      setErrors({ withdrawAmount: 'Uttaksbeløp er tomt!' })
      return
    }
    if (data.id) {
      withdrawReqMutation({
        variables: {
          id: data.id,
          withdrawAmount: payload.withdrawAmount,
          status: payload.status,
          note: payload.note
        }
      })
    }
  }

  useEffect(() => {
    if (data) {
      setPayload({
        note: data.note,
        withdrawAmount: data.withdrawAmount,
      })
    }
  }, [data])



  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Uttaksforespørsel</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          error={Boolean(errors.withdrawAmount)}
          helperText={errors.withdrawAmount}
          onChange={handleInputChange}
          value={payload.withdrawAmount}
          name='withdrawAmount'
          label='Uttaksbeløp'
          type='number'
        />

        <TextField
          multiline
          rows={3}
          error={Boolean(errors.note)}
          helperText={errors.note}
          onChange={handleInputChange}
          value={payload.note}
          name='note'
          label='Notat'
        />

      </FormGroup>

      <CButton isLoading={loading} onClick={handleUpdate} variant='contained' style={{ width: '100%', mt: 2 }}>
        Oppdater uttak
      </CButton>

    </Box>
  )
}

export default EditWithdrawReq