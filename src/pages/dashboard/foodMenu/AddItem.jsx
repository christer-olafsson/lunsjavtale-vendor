/* eslint-disable react/prop-types */
import { useMutation, useQuery } from '@apollo/client';
import { Add, ArrowDropDown, CheckBox, CheckBoxOutlineBlank, Close, CloudUpload } from '@mui/icons-material'
import { Autocomplete, Box, Button, Checkbox, Collapse, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { GET_ALL_CATEGORY } from './graphql/query';
import toast from 'react-hot-toast';
import { GET_INGREDIENTS } from '../../../graphql/query';
import { uploadMultiFile } from '../../../utils/uploadFile';
import CButton from '../../../common/CButton/CButton';
import { VENDOR_PRODUCT_MUTATION } from './graphql/mutation';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const AddItem = ({ fetchCategory, closeDialog }) => {
  const [categoryId, setCategoryId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allAllergies, setAllAllergies] = useState([]);
  const [priceWithTax, setPriceWithTax] = useState("");
  const [priceWithoutTax, setPriceWithoutTax] = useState("");
  const [imgUploadLoading, setImgUploadLoading] = useState(false)
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedCoverImgId, setSelectedCoverImgId] = useState(0)
  const [inputerr, setInputerr] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    selectedFile: ''
  })
  // const [taxRate, setTaxRate] = useState(0.15); // Default tax rate of 15%
  const [payload, setPayload] = useState({
    name: '',
    title: '',
    description: '',
    contains: '',
    // availability: true,
    // discountAvailability: false
  })

  const handlePriceWithoutTaxChange = (event) => {
    const inputPrice = parseFloat(event.target.value);
    const taxRate = 0.15; // 15% tax rate
    const taxAmount = inputPrice * taxRate;
    const priceWithTax = inputPrice + taxAmount;
    setPriceWithTax(Math.round(priceWithTax * 100) / 100);
    setPriceWithoutTax(inputPrice);
  };

  const handlePriceWithTaxChange = (event) => {
    const inputPriceWithTax = parseFloat(event.target.value);
    const taxRate = 0.15; // 15% tax rate
    const priceWithoutTax = inputPriceWithTax / (1 + taxRate);
    setPriceWithoutTax(Math.round(priceWithoutTax * 100) / 100);
    setPriceWithTax(inputPriceWithTax);
  };
  // const handleTaxRateChange = (event) => {
  //   const newTaxRate = parseFloat(event.target.value);
  //   setTaxRate(newTaxRate);
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };


  // select allergies
  const handleAutoCompleteChange = (event, value) => {
    setSelectedAllergies(value)
  }

  // added mutiple image
  const handleFileSelect = (event) => {
    const Upfiles = event.target.files;
    const maxFileSize = 500 * 1024; // 500KB in bytes
    for (const file of Upfiles) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Please select a file smaller than 500 KB.`);
        return;
      }
    }
    const files = Array.from(event.target.files).slice(0, 5);
    setSelectedFiles(files);
  };
  const handleFileDeselect = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  // product create
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
          setErrors(extensions.errors)
        }
      }
    }
  });

  //get all allergies
  useQuery(GET_INGREDIENTS, {
    onCompleted: (res) => {
      const allergiesName = res.ingredients.edges.map(item => item.node.name)
      setAllAllergies(allergiesName)
    }
  });

  // get all category
  useQuery(GET_ALL_CATEGORY, {
    onCompleted: (data) => {
      setAllCategories(data?.categories?.edges)
    },
  });


  const handleProductSave = async () => {
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
    // if (selectedFiles.length === 0) {
    //   setInputerr({ selectedFile: 'Product image empty!' });
    //   return
    // }
    let attachments = []
    if (selectedFiles) {
      setImgUploadLoading(true)
      const res = await uploadMultiFile(selectedFiles, 'products');
      attachments = res.map((item, id) => ({
        fileUrl: item.secure_url,
        fileId: item.public_id,
        isCover: selectedCoverImgId === id ? true : false
      }));
      setImgUploadLoading(false)
    }
    productMutation({
      variables: {
        input: {
          ...payload,
          contains: JSON.stringify(payload.contains),
          taxPercent: 15,
          priceWithTax: priceWithTax.toString(),
          category: categoryId,
        },
        ingredients: selectedAllergies,
        attachments
      }
    })
  }


  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Add New Items</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack>
        <TextField
          error={Boolean(inputerr.name || errors.name)}
          helperText={inputerr.name || errors.name}
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
              // InputProps={{ readOnly: true }}
              error={Boolean(inputerr.price)}
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
              onChange={handlePriceWithTaxChange}
              error={Boolean(inputerr.price || errors.priceWithTax)}
              value={priceWithTax ? priceWithTax : ''}
              label='Price (incl. Tax 15%)'
              helperText={errors.priceWithTax}
            />
          </Stack>

        </Stack>
        <Autocomplete
          freeSolo
          multiple
          options={allAllergies}
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
        <Stack direction='row' gap={2} mt={2} alignItems='center'>
          {/* <FormControlLabel
            sx={{ mb: 1, width: 'fit-content' }}
            control={<Switch checked={payload.availability}
              onChange={e => setPayload({ ...payload, availability: e.target.checked })} />}
            label="Status Available" /> */}
          {/* <FormControlLabel
            control={<Switch color="warning"
              checked={payload.discountAvailability}
              onChange={e => setPayload({ ...payload, discountAvailability: e.target.checked })} />}
            label="Discount Active" /> */}
        </Stack>

        {/* selected image */}
        <Stack gap={2} mt={2}>
          <Stack direction='row' gap={2} flexWrap='wrap' >
            {selectedFiles.map((file, index) => (
              <Box onClick={() => setSelectedCoverImgId(index)} sx={{
                position: 'relative',
                border: selectedCoverImgId === index ? '3px solid green' : '',
                borderRadius: '4px',
                width: "100px",
                height: "100px",
                // p: selectedCoverImgId === index ? .5 : '',
                cursor: 'pointer',
                "::before": {
                  position: 'absolute',
                  content: selectedCoverImgId === index ? '"Cover"' : '""',
                  width: '100%',
                  color: '#fff',
                  pl: 1,
                  height: '25px', bottom: 0,
                  bgcolor: selectedCoverImgId === index ? 'rgba(0,0,0,.7)' : '',
                  // border: '2px solid green',
                  // borderRadius:'4px',
                  zIndex: 11
                }
              }} key={index}>
                <IconButton sx={{ width: '25px', height: '25px', position: 'absolute', top: -10, right: -5, bgcolor: 'light.main' }}
                  onClick={() => handleFileDeselect(index)}>
                  <Close fontSize='small' />
                </IconButton>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Image ${index}`}
                  style={{ width: "100%", height: "100%", objectFit: 'cover', borderRadius: '4px' }}
                />
                {/* <p>{file.name}</p> */}
              </Box>
            ))}
          </Stack>
          <Box sx={{ flex: 1 }}>
            <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
              <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose multiple files Max(5) (min 500*500 px) (Max 500KB)</Typography>
              <Button component="label" role={undefined} variant="outlined" startIcon={<CloudUpload />}>
                Upload file
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} hidden />
              </Button>
            </Stack>
            {
              inputerr.selectedFile &&
              <Typography sx={{ fontSize: '14px', color: 'red' }}>{inputerr.selectedFile}</Typography>
            }
          </Box>
        </Stack>
      </Stack>

      {/* {errors.length > 0 && (
        <ul style={{ color: 'red', fontSize: '13px', padding: '10px' }}>
          {errors.map((err, id) => (
            <li key={id}>{err}</li>
          ))}
        </ul>
      )} */}
      <CButton isLoading={productMutationLoading || imgUploadLoading} onClick={handleProductSave} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Add</CButton>
    </Box>

  )
}

export default AddItem