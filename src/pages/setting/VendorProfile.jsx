import { Autocomplete, Avatar, Box, Button, Checkbox, FormControl, FormGroup, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { VENDOR_UPDATE } from './graphql/mutation'
import { ME } from '../../graphql/query'
import { deleteFile } from '../../utils/deleteFile'
import { uploadFile } from '../../utils/uploadFile'
import CButton from '../../common/CButton/CButton'


const VendorProfile = () => {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [payloadEditOn, setPayloadEditOn] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false)


  const [payload, setPayload] = useState({
    name: '',
    email: '',
    contact: '',
    postCode: '',
    // formationDate: null
  })

  const { data: user } = useQuery(ME);

  const [vendorUpdate, { loading: updateLoading }] = useMutation(VENDOR_UPDATE, {
    refetchQueries: [
      { query: ME }
    ],
    onCompleted: (res) => {
      const data = res.vendorUpdate
      toast.success(data.message);
      setPayloadEditOn(false)
      setErrors({})
      setFile('')
    },
    onError: (err) => {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          setErrors(extensions.errors);
        }
      }
    }
  })


  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  };

  const handleUpdate = async () => {
    if (!payload.name) {
      setErrors({ name: 'Name Required!' })
      return
    }
    if (!payload.email) {
      setErrors({ email: 'Email Required!' })
      return
    }
    if (!payload.contact) {
      setErrors({ contact: 'Contact Required!' })
      return
    }
    let logoUrl = user.me.vendor.logoUrl;
    let fileId = user.me.vendor.fileId;
    if (file) {
      setFileUploadLoading(true)
      const { public_id, secure_url } = await uploadFile(file, 'vendors')
      await deleteFile(user.me.vendor.fileId)
      logoUrl = secure_url
      fileId = public_id
      setFileUploadLoading(false)
    }
    vendorUpdate({
      variables: {
        input: {
          ...payload,
          id: user.me.vendor.id,
          postCode: parseInt(payload.postCode),
          logoUrl,
          fileId
        }
      }
    })
  }
  console.log(user)
  useEffect(() => {
    setPayload({
      name: user?.me.vendor.name ?? '',
      email: user?.me.vendor.email ?? '',
      contact: user?.me.vendor.contact ?? '',
      postCode: user?.me.vendor.postCode ?? '',
      // formationDate: user?.me.vendor.formationDate ?? null,
    });
  }, [user]);

  return (
    <Box>
      {/* <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 1 }}>User Profile</Typography> */}
      <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>View and update your profile  details</Typography>
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={3} alignItems='center' justifyContent='space-between' mt={1}>
        <Stack direction='row' gap={3} alignItems='center'>
          {
            payloadEditOn &&
            <>
              <Avatar src={file ? URL.createObjectURL(file) : user?.me.vendor.logoUrl ?? ''} sx={{ width: '80px', height: '80px' }} />
              <label style={{
                border: '1px solid lightgray',
                padding: '5px 24px',
                borderRadius: '6px',
              }} htmlFor="avatar">Choose</label>
            </>
          }
          <input onChange={(e) => setFile(e.target.files[0])} type="file" id="avatar" hidden accept="jpg,png,gif" />
          {/* <Button disabled={!payloadEditOn} onClick={() => setFile(null)} startIcon={<Delete />}>Remove</Button> */}
        </Stack>
      </Stack>
      <FormGroup>
        <Stack mt={4}>
          <Stack direction='row' gap={2} mb={2}>
            <Stack flex={1} gap={2}>
              <TextField helperText={errors.name} error={Boolean(errors.name)} disabled={!payloadEditOn} value={payload.name} onChange={handleInputChange} name='name' size='small' label='Name' />
              <TextField helperText={errors.postCode} error={Boolean(errors.postCode)} disabled={!payloadEditOn} value={payload.postCode} onChange={handleInputChange} name='postCode' size='small' label='Post Code' />
              {/* <TextField disabled={!payloadEditOn} value={payload.formationDate ?? ''} name='formationDate' onChange={handleInputChange} size='small' type='date' helperText={`Formation Date`} /> */}
            </Stack>
            <Stack flex={1} gap={2}>
              <TextField helperText={errors.email} inputProps={{readOnly:true}} error={Boolean(errors.email)} disabled={!payloadEditOn} value={payload.email} onChange={handleInputChange} name='email' size='small' label='Email' />
              <TextField helperText={errors.contact} error={Boolean(errors.contact)} disabled={!payloadEditOn} value={payload.contact} onChange={handleInputChange} name='contact' size='small' label='Contact' />
            </Stack>
          </Stack>
        </Stack>
      </FormGroup>
      <Stack direction='row' mt={2} justifyContent='space-between'>
        <Box></Box>
        {
          payloadEditOn ?
            <Stack direction='row' alignItems='center' gap={2}>
              <CButton onClick={() => setPayloadEditOn(false)} variant='outlined'>Cencel</CButton>
              <CButton isLoading={updateLoading || fileUploadLoading} onClick={handleUpdate} variant='contained'>Save Changes</CButton>
            </Stack> :
            <CButton disable={user?.me.vendor.isBlocked} onClick={() => setPayloadEditOn(true)} variant='contained'>Edit</CButton>
        }
      </Stack>
    </Box>
  )
}

export default VendorProfile