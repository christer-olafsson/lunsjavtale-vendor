import { gql } from "@apollo/client";


export const ME = gql`
  query{
    me{
      id
      email
      firstName
      lastName
      username
      phone
      postCode
      gender
      role
      jobTitle
      dateOfBirth
      address
      about
      photoUrl
      fileId
      isActive
      vendor{
        id
        isBlocked
        name
        email
        contact
        postCode
        logoUrl
        soldAmount
        withdrawnAmount
        formationDate
      }
    }
  }
`

export const GET_ALL_CATEGORY = gql`
query{
  categories{
  edges{
    node{
      id
      name
      description
      isActive
      products(isDeleted: false, availability : true){
        edges{
          node{
            id
            name
            title
            actualPrice
            priceWithTax
            contains
            description
            availability
            discountAvailability
            isDeleted
            attachments{
              edges{
                node{
                  id
                  fileUrl
                  isCover
                }
              }
            }
            ingredients{
              edges{
                node{
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
}
`

export const PRODUCTS = gql`
  query Products ($id: ID, $category: String) {
      products(id:$id, category: $category){
        edges{
          node{
          id
          name
          priceWithTax
          actualPrice
          description
          availability
          discountAvailability
          isDeleted
          title
          contains
          ingredients{
            edges{
              node{
                id
                name
                description
                isActive
              }
            }
          }
          attachments{
            edges{
              node{
                id
                fileUrl
                fileId
                isCover
              }
            }
          }
          category{
            id
            name
          }
      }
    }
      }
  }

`

export const GET_SINGLE_CATEGORY = gql`
  query SingleCategory ($id: ID){
    category(id: $id){
      name
      products(isDeleted: false, availability: true){
        edges{
          node{
            id
            name
            title
            actualPrice
            description
            attachments{
              edges{
                node{
                  fileUrl
                  isCover
              }
            }
          }
        }
      }
    }
    }
  }
`

export const CHECk_POST_CODE = gql`
  query CheckPostCode ($postCode: Int){
    checkPostCode(postCode: $postCode)
  }
`
export const SUPPORTED_BRANDS = gql`
  query{
  supportedBrands{
    edges{
      node{
        id
        name
        siteUrl
        logoUrl
        fileId
        isActive
      }
    }
  }
}
`

export const PROMOTIONS = gql`
  query{
    promotions{
      edges{
        node{
          id
          title
          description
          photoUrl
          fileId
          productUrl
          startDate
          endDate
          isActive
        }
      }
  }
}
`

export const FAQ_LIST = gql`
  query{
    FAQList{
      edges{
        node{
          id
          question
          answer
          isActive
        }
      }
    }
}
`

export const GET_INGREDIENTS = gql`
  query{
    ingredients{
      edges{
        node{
          id
          name
          isActive
      }
    }
  }
}
`