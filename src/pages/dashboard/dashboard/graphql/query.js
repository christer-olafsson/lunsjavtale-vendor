import { gql } from "@apollo/client";

export const VENDOR_DASHBOARD = gql`
  query($dateRange: String){
    vendorDashboard(dateRange: $dateRange){
      data
    }
  }
`