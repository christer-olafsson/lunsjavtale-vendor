import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CategoryMutation ($input: CategoryMutationInput!){
    categoryMutation(input:$input){
      success
      message
    }
  }
`

export const CATEGORY_DELETE = gql`
  mutation CategoryDelete ($id: ID!,$withAllProduct: Boolean){
    categoryDelete(id:$id, withAllProduct: $withAllProduct){
    success
    message
  }
  }
`

export const VENDOR_PRODUCT_MUTATION = gql`
  mutation VendorProductMutation ($input: VendorProductInput, $ingredients: [String], $attachments: [ProductAttachmentInput]!){
    vendorProductMutation(input:$input,ingredients:$ingredients,attachments: $attachments){
      success
      message
    }
  }
`

export const PRODUCT_DELETE = gql`
  mutation ProductDelete ($id: ID){
    productDelete(id:$id){
      success
      message
    }
  }
`