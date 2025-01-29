/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  AutoAwesomeMotion,
  CategoryOutlined,
  Diversity3,
  ExpandLess,
  ExpandMore,
  FiberManualRecord,
  History,
  LocalPolice,
  LunchDining,
  NotificationsNone,
  NotificationsNoneOutlined,
  PaidOutlined,
  PeopleAltOutlined,
  SettingsOutlined,
  ShoppingCart,
  ShoppingCartCheckout,
  ShoppingCartCheckoutOutlined,
  ShoppingCartOutlined,
  SpaceDashboard,
  StickyNote2,
  Timeline,
  ViewStreamOutlined,
  Workspaces,
} from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge,
  Collapse,
  Stack,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { UNREAD_NOTIFICATION_COUNT } from './notification/query';
import { ORDERS } from './orders/graphql/query';


const NavItem = ({ handleDrawerClose }) => {
  const [expandedNavlinkIndex, setExpandedNavlinkIndex] = useState(null);
  const [unreadNotification, setUnreadNotification] = useState([])
  const [placedOrders, setPlacedOrders] = useState([])



  useQuery(UNREAD_NOTIFICATION_COUNT, {
    onCompleted: (res) => {
      setUnreadNotification(res.unreadNotificationCount)
    }
  });

  useQuery(ORDERS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      const relevantStatuses = ['Placed', 'Updated', 'Payment-pending', 'Payment-completed'];
      setPlacedOrders(res.orders.edges
        .filter(item => relevantStatuses.includes(item.node.status))
        .map(item => item.node)
      );
    }
  });


  const handleExpandedNavlink = (index) => {
    setExpandedNavlinkIndex(expandedNavlinkIndex === index ? null : index);
  };


  const navItems = [
    { name: 'Dashboard', icon: <SpaceDashboard fontSize='small' />, path: '/dashboard', end: true },
    { name: 'Varsler', icon: <NotificationsNone fontSize='small' />, path: '/dashboard/notifications', notification: unreadNotification },
    { name: 'Matvare', icon: <LunchDining fontSize='small' />, path: '/dashboard/food-item' },
    { name: 'Bestillinger', icon: <ShoppingCartCheckoutOutlined fontSize='small' />, path: '/dashboard/orders', notification: placedOrders.length },
    { name: 'Salgs-Historikk', icon: <Timeline fontSize='small' />, path: '/dashboard/sales-history' },
    { name: 'Uttaks-Forespørsel', icon: <History fontSize='small' />, path: '/dashboard/withdraw-req' },
    { name: 'Innstillinger', icon: <SettingsOutlined />, path: '/dashboard/settings' },
  ];



  return (
    <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {navItems.map((item, index) => (
        <ListItem disablePadding key={index} sx={{ display: 'block' }}>
          {item.more ? (
            <>
              <ListItemButton
                sx={{ px: 1, mx: 2, borderRadius: '5px', mb: 0.5, color: 'gray' }}
                onClick={() => handleExpandedNavlink(index)}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
                {expandedNavlinkIndex === index ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={expandedNavlinkIndex === index} timeout="auto" unmountOnExit>
                <List component="div">
                  {item.more.map((subItem, id) => (
                    <NavLink
                      onClick={handleDrawerClose}
                      className="link"
                      key={id}
                      to={subItem.path}
                    >
                      {({ isActive }) => (
                        <ListItemButton
                          sx={{
                            ml: 5,
                            mr: 2,
                            mb: 0.5,
                            borderRadius: '5px',
                            bgcolor: isActive ? 'primary.main' : '',
                            color: isActive ? '#fff' : 'gray',
                            ':hover': {
                              bgcolor: isActive ? 'primary.main' : '#F5F5F5',
                            },
                          }}
                        >
                          <FiberManualRecord sx={{ fontSize: '15px', mr: 0.5 }} />
                          <Typography sx={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                            {subItem.name}
                          </Typography>
                        </ListItemButton>
                      )}
                    </NavLink>
                  ))}
                </List>
              </Collapse>
            </>
          ) : (
            <NavLink end={item.end} className="link" to={item.path}>
              {({ isActive }) => (
                <Stack
                  direction='row'
                  alignItems='center'
                  onClick={handleDrawerClose}
                  sx={{
                    py: 1,
                    px: 1,
                    mx: 2,
                    borderRadius: '5px',
                    bgcolor: isActive ? '#fff' : '',
                    color: isActive ? 'primary.main' : '#fff',
                    // ':hover': {
                    //   bgcolor: isActive ? '#fff' : 'gray',
                    // },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: isActive ? 'primary.main' : '#fff' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  <Badge sx={{ mr: 2 }} badgeContent={item.notification} color="warning" />
                </Stack>
              )}
            </NavLink>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default NavItem;
