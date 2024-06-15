import { gql } from "@apollo/client";

export const WITHDRAW_REQ = gql`
  query($vendor: String){
  withdrawRequests(vendor: $vendor){
    edges{
      node{
        id
        createdOn
        isDeleted
        withdrawAmount
        status
        note
        vendor{
          id
          name
          email
          contact
          isBlocked
          logoUrl
          soldAmount
        }
      }
    }
  }
}
`