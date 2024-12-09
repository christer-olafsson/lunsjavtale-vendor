import { gql } from "@apollo/client";

export const MEETING_MUTATION = gql`
  mutation FoodMeetingMutation ($input: FoodMeetingMutationInput!){
    foodMeetingMutation(input:$input){
      success
      message
    }
  }
`

export const SEND_VERIFICATION_MAIL = gql`
  mutation SendVerificationMail ($email: String!){
    sendVerificationMail(email:$email){
    success
    message
  }
  }
`