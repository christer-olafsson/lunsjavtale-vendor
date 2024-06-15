import { Box, Tab, Tabs, Typography } from '@mui/material'
import UserProfile from './UserProfile'
import Account from './Account'
import { useState } from 'react';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Setting = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box maxWidth='lg'>
      <Typography sx={{ fontSize: '24px', fontWeight: 600, mb: 3 }}>Profile Update</Typography>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Profile" />
            <Tab label="Account" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <UserProfile />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Account />
        </CustomTabPanel>
      </Box>
    </Box>
  )
}

export default Setting