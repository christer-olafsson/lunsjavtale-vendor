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
  const [postCodes, setPostCodes] = useState([])


  const [payload, setPayload] = useState({
    name: '',
    email: '',
    contact: '',
    commission: ''
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
      setErrors({ name: 'Navn påkrevd!' })
      return
    }
    if (!payload.email) {
      setErrors({ email: 'E-post påkrevd!' })
      return
    }
    if (postCodes.length === 0) {
      setErrors({ postCode: 'Post code Required!' })
      return
    }
    if (!payload.contact) {
      setErrors({ contact: 'Kontakt påkrevd!' })
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
          commission: parseInt(payload.commission),
          logoUrl,
          fileId
        },
        postCode: postCodes.map(code => parseInt(code))
      }
    })
  }

  useEffect(() => {
    setPayload({
      name: user?.me.vendor.name ?? '',
      email: user?.me.vendor.email ?? '',
      contact: user?.me.vendor.contact ?? '',
      commission: user?.me.vendor.commission ?? '',
      // formationDate: user?.me.vendor.formationDate ?? null,
    });
    setPostCodes(user?.me.vendor.postCode ?? [])
  }, [user]);

  return (
    <Box>
      {/* <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 1 }}>User Profile</Typography> */}
      <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>Vis og oppdater profilinformasjonen din</Typography>
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
              }} htmlFor="avatar">Velg</label>
            </>
          }
          <input onChange={(e) => {
            const file = e.target.files[0];
            const maxFileSize = 500 * 1024; // 500KB in bytes
            if (file.size > maxFileSize) {
              alert(`Filen ${file.name} er for stor. Vennligst velg en fil som er mindre enn 500KB.`);
              return
            }
            setFile(e.target.files[0])
          }} type="file" id="avatar" hidden accept="jpg,png,gif" />
          {/* <Button disabled={!payloadEditOn} onClick={() => setFile(null)} startIcon={<Delete />}>Fjern</Button> */}
        </Stack>
      </Stack>
      <FormGroup>
        <Stack mt={4}>
          <Stack direction='row' gap={2} mb={2}>
            <Stack flex={1} gap={2}>
              <TextField helperText={errors.name} error={Boolean(errors.name)} disabled={!payloadEditOn} value={payload.name} onChange={handleInputChange} name='name' size='small' label='Supplier Name' />
              <Autocomplete
                freeSolo
                multiple
                size='small'
                disabled={!payloadEditOn}
                options={postCodes}
                value={postCodes}
                disableCloseOnSelect
                onChange={(event, value) => setPostCodes(value)}
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField helperText={errors.postCode} error={Boolean(errors.postCode)} {...params} type='' label="Postnummer" placeholder="Type and press Enter" />
                )}
              />
              {/* <TextField disabled={!payloadEditOn} value={payload.formationDate ?? ''} name='formationDate' onChange={handleInputChange} size='small' type='date' helperText={`Stiftelsesdato`} /> */}
            </Stack>
            <Stack flex={1} gap={2}>
              <TextField helperText={errors.email} inputProps={{ readOnly: true }} error={Boolean(errors.email)} disabled={!payloadEditOn} value={payload.email} onChange={handleInputChange} name='email' size='small' label='E-post' />
              <TextField helperText={errors.contact} error={Boolean(errors.contact)} disabled={!payloadEditOn} value={payload.contact} onChange={handleInputChange} name='contact' size='small' label='Kontakt' />
            </Stack>
          </Stack>
        </Stack>
      </FormGroup>
      <Stack direction='row' mt={2} justifyContent='space-between'>
        <Box></Box>
        {
          payloadEditOn ?
            <Stack direction='row' alignItems='center' gap={2}>
              <CButton onClick={() => setPayloadEditOn(false)} variant='outlined'>Avbryt</CButton>
              <CButton isLoading={updateLoading || fileUploadLoading} onClick={handleUpdate} variant='contained'>Lagre endringer</CButton>
            </Stack> :
            <CButton disable={user?.me.vendor.isBlocked} onClick={() => setPayloadEditOn(true)} variant='contained'>Rediger</CButton>
        }
      </Stack>
    </Box>
  )
}

export default VendorProfile