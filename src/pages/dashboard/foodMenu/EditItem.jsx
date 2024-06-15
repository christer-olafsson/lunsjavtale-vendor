/* eslint-disable react/prop-types */
import { useMutation, useQuery } from '@apollo/client';
import { Add, ArrowDropDown, CheckBox, CheckBoxOutlineBlank, Close, CloudUpload } from '@mui/icons-material'
import { Autocomplete, Box, Button, Checkbox, Collapse, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { GET_ALL_CATEGORY } from './graphql/query';
import CButton from '../../../common/CButton/CButton';
import toast from 'react-hot-toast';
import { uploadMultiFile } from '../../../utils/uploadFile';
import { PRODUCT_DELETE, VENDOR_PRODUCT_MUTATION } from './graphql/mutation';
import { deleteMultiFile } from '../../../utils/deleteFile';
import { GET_INGREDIENTS } from '../../../graphql/query';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;


const EditItem = ({ data, fetchCategory, closeDialog }) => {
  const [categoryId, setCategoryId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allAllergies, setAllAllergies] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [priceWithTax, setPriceWithTax] = useState("");
  const [priceWithoutTax, setPriceWithoutTax] = useState("");
  const [imgUploadLoading, setImgUploadLoading] = useState(false);
  const [imgDeleteLoading, setImgDeleteLoading] = useState(false);
  const [productImgFromData, setProductImgFromData] = useState([]);
  const [deletedImgId, setDeletedImgId] = useState([]);
  const [productDeleteSecOpen, setProductDeleteSecOpen] = useState(false)
  const [selectedCoverImgId, setSelectedCoverImgId] = useState(null);
  const [inputerr, setInputerr] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
  })
  const [payload, setPayload] = useState({
    name: '',
    title: '',
    description: '',
    contains: '',
  })

  const handlePriceWithoutTaxChange = (event) => {
    const inputPrice = parseFloat(event.target.value);
    const taxRate = 0.15; // 15% tax rate
    const taxAmount = inputPrice * taxRate;
    const priceWithTax = inputPrice + taxAmount;
    setPriceWithTax(Math.round(priceWithTax * 100) / 100);
    setPriceWithoutTax(inputPrice);
  };

  // const handleTaxRateChange = (event) => {
  //   const newTaxRate = parseFloat(event.target.value);
  //   setTaxRate(newTaxRate);
  // };

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  };

  // select allergies
  const handleAutoCompleteChange = (event, value) => {
    setSelectedAllergies(value)
  }


  // added mutiple image
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files).slice(0, 5);
    setSelectedFiles(files);
  };
  const handleFileDeselect = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
  // remove imge from data
  const handleProductImgRemove = (data) => {
    const filteredData = productImgFromData.filter(item => item.fileId !== data.fileId);
    setProductImgFromData(filteredData);
    setDeletedImgId([...deletedImgId, data.fileId])
  }


  // product create update
  const [productMutation, { loading: productMutationLoading }] = useMutation(VENDOR_PRODUCT_MUTATION, {
    onCompleted: (res) => {
      fetchCategory()
      toast.success(res.vendorProductMutation.message)
      closeDialog()
    },
    onError: (err) => {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          // setErrors(extensions.errors)
          setErrors(Object.values(extensions.errors));
        }
      }
    }
  });

  // product delete
  const [productDelete, { loading: productDeleteLoading }] = useMutation(PRODUCT_DELETE, {
    onCompleted: (res) => {
      toast.success(res.productDelete.message);
      fetchCategory()
      closeDialog()
    }
  })

  //get all allergies
  useQuery(GET_INGREDIENTS, {
    onCompleted: (res) => {
      const allergiesName = res.ingredients.edges.map(item => item.node.name)
      setAllAllergies(allergiesName)
    }
  });

  // set cover image
  const handleSetCoverImgId = (index) => {
    setSelectedCoverImgId(index);
    setProductImgFromData((prevData) =>
      prevData.map((item, idx) => ({
        ...item,
        isCover: idx === index
      }))
    );
  };

  const handleProductUpdate = async () => {
    if (!payload.name) {
      setInputerr({ name: "Product name required!" });
      return;
    }
    if (!categoryId) {
      setInputerr({ category: "Category required!" });
      return;
    }
    if (!priceWithTax) {
      setInputerr({ price: "Product Price required!" });
      return;
    }
    if (!payload.description) {
      setInputerr({ description: "Product description required!" });
      return;
    }
    if (deletedImgId) {
      setImgUploadLoading(true)
      await deleteMultiFile(deletedImgId);
      setImgUploadLoading(false)
    }
    let attachments = [];
    if (selectedFiles) {
      setImgUploadLoading(true)
      const res = await uploadMultiFile(selectedFiles, 'products');
      attachments = res.map(item => ({
        fileUrl: item.secure_url,
        fileId: item.public_id,
        isCover: false
      }));
      setImgUploadLoading(false)
    }
    if (data.id) {
      productMutation({
        variables: {
          input: {
            id: data.id,
            ...payload,
            contains: JSON.stringify(payload.contains),
            taxPercent: 15,
            priceWithTax: priceWithTax.toString(),
            category: categoryId,
          },
          ingredients: selectedAllergies,
          attachments: [...productImgFromData, ...attachments]
        }
      })
    }
  }


  const handleProductDelete = async () => {
    const fileIds = data.attachments.edges.map(item => item.node.fileId);
    setImgDeleteLoading(true)
    await deleteMultiFile(fileIds)
    setImgDeleteLoading(false)
    productDelete({
      variables: {
        id: data.id
      }
    })
  }

  useQuery(GET_ALL_CATEGORY, {
    onCompleted: (data) => {
      setAllCategories(data?.categories?.edges)
    },
  });


  useEffect(() => {
    setPayload({
      name: data.name,
      title: data.title ? data.title : '',
      description: data.description,
      contains: data.contains ? JSON.parse(data.contains) : '',
    })
    setPriceWithTax(data.priceWithTax);
    setPriceWithoutTax(data.actualPrice);
    setCategoryId(data?.category?.id);
    setSelectedAllergies(data?.ingredients.edges.map(item => item.node.name));
    setProductImgFromData(data.attachments.edges.map(item => ({
      fileUrl: item.node.fileUrl,
      fileId: item.node.fileId,
      isCover: item.node.isCover,
    })));
  }, [])


  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Update Items</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack>
        <TextField
          error={Boolean(inputerr.name)}
          helperText={inputerr.name}
          name='name'
          value={payload.name}
          onChange={handleInputChange}
          label='Product Name'
        />
        <Stack direction='row' gap={2} mb={2} mt={2}>
          <Stack flex={1} gap={2}>
            <FormControl error={Boolean(inputerr.category)} >
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {allCategories?.map(item => (
                  <MenuItem key={item.node.id} value={item.node.id}>{item.node.name}</MenuItem>
                ))}
              </Select>
              {inputerr.category && <FormHelperText>{inputerr.category}</FormHelperText>}
            </FormControl>
            <TextField
              type="number"
              value={priceWithoutTax}
              onChange={handlePriceWithoutTaxChange}
              label='Price'
            />
          </Stack>
          <Stack flex={1} gap={2}>
            <TextField
              name='title'
              value={payload.title}
              onChange={handleInputChange}
              label='Title'
              placeholder='E.g: Todays..'
            />
            <TextField
              error={Boolean(inputerr.price)}
              type="number"
              value={priceWithTax}
              inputProps={{ readOnly: true }}
              label='Price incl. Tax (15%)'
            />
          </Stack>
        </Stack>
        <Autocomplete
          freeSolo
          multiple
          options={allAllergies}
          value={selectedAllergies}
          disableCloseOnSelect
          onChange={handleAutoCompleteChange}
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Allergies" placeholder="Type and press Enter" />
          )}
        />
        <TextField
          name='contains'
          value={payload.contains}
          onChange={handleInputChange}
          sx={{ my: 2 }}
          label='Contains'
          placeholder='E.g: 570 Calories, 40g carbohydrate..'
          rows={2}
          multiline
        />
        <TextField
          sx={{ mb: 3 }}
          error={Boolean(inputerr.description)}
          helperText={inputerr.description}
          name='description'
          value={payload.description}
          onChange={handleInputChange}
          label='Description'
          placeholder='Products details'
          rows={4}
          multiline
        />
        {/* Product image from api */}
        <Stack gap={2} >
          <Stack direction='row' gap={2} flexWrap='wrap' >
            {productImgFromData.map((data, index) => (
              <Box onClick={() => handleSetCoverImgId(index)} sx={{
                position: 'relative',
                border: selectedCoverImgId === index ? '3px solid green' : '',
                borderRadius: '4px',
                width: "100px",
                height: "100px",
                // p: selectedCoverImgId === data.id ? .5 : '',
                cursor: 'pointer',
                "::before": {
                  position: 'absolute',
                  content: data.isCover ? '"Cover"' : '""',
                  width: '100%',
                  pl: 1,
                  color: '#fff',
                  height: '25px', bottom: 0,
                  bgcolor: data.isCover ? 'rgba(0,0,0,.7)' : '',
                  // border: '2px solid green',
                  // borderRadius:'4px',
                  zIndex: 11
                }
              }} key={index}>
                <IconButton sx={{ width: '25px', height: '25px', position: 'absolute', top: -10, right: -5, bgcolor: 'light.main' }}
                  onClick={() => handleProductImgRemove(data)}>
                  <Close fontSize='small' />
                </IconButton>
                <img
                  src={data.fileUrl}
                  alt={`Image ${index}`}
                  style={{ width: "100%", height: "100%", objectFit: 'cover' }}
                />
                {/* <p>{data.name}</p> */}
              </Box>
            ))}
          </Stack>
          {/* selected image from file */}
          <Stack direction='row' gap={2} flexWrap='wrap' >
            {selectedFiles.map((file, index) => (
              <Box sx={{ position: 'relative' }} key={index}>
                <IconButton sx={{ width: '25px', height: '25px', position: 'absolute', top: -10, right: -5, bgcolor: 'light.main' }} onClick={() => handleFileDeselect(index)}>
                  <Close fontSize='small' />
                </IconButton>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Image ${index}`}
                  style={{ width: "100px", height: "100px", objectFit: 'cover' }}
                />
                <p>{file.name}</p>
              </Box>
            ))}
          </Stack>
          <Box sx={{ flex: 1 }}>
            <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
              <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose multiple files Max(5) (500*500 px)</Typography>
              <Button component="label" role={undefined} variant="outlined" startIcon={<CloudUpload />}>
                Upload file
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} hidden />
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Stack>

      {errors.length > 0 && (
        <ul style={{ color: 'red', fontSize: '13px', padding: '10px' }}>
          {errors.map((err, id) => (
            <li key={id}>{err}</li>
          ))}
        </ul>
      )}
      <CButton isLoading={productMutationLoading || imgUploadLoading} onClick={handleProductUpdate} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Update</CButton>
      <Button onClick={() => setProductDeleteSecOpen(true)} sx={{ mt: 3 }} color='warning'>Delete this product</Button>
      <Collapse in={productDeleteSecOpen}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography>Are you want to sure remove this product?</Typography>
          <Stack direction='row' gap={2}>
            <Button disabled={productDeleteLoading || imgDeleteLoading} onClick={handleProductDelete} color='warning'>Confirm</Button>
            <Button onClick={() => setProductDeleteSecOpen(false)}>Cencel</Button>
          </Stack>
        </Paper>
      </Collapse>
    </Box>

  )
}

export default EditItem