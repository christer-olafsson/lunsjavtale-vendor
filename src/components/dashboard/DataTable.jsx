/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const DataTable = ({ rows, columns, getRowHeight, columnVisibilityModel }) => {
  return (
    <Box maxWidth='xl' sx={{ height: '100%', width: '100%', }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'primary.main',
            color: '#fff'
          },
        }}
        rows={rows}
        columns={columns}
        autoHeight
        getRowHeight={getRowHeight}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        columnVisibilityModel={columnVisibilityModel}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSorting
        disableColumnMenu
      />
    </Box>
  )
}

export default DataTable