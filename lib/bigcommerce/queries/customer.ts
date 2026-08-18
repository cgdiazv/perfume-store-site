export const getCustomerQuery = /* GraphQL */ `
  query getCustomer {
    customer {
      entityId
      firstName
      lastName
      email
      phone
      company
      customerGroupId
      addresses {
        edges {
          node {
            entityId
            firstName
            lastName
            address1
            address2
            city
            stateOrProvince
            postalCode
            countryCode
            phone
          }
        }
      }
      orders {
        edges {
          node {
            entityId
            status {
              value
            }
            totalIncTax {
              value
              currencyCode
            }
            orderedAt {
              utc
            }
          }
        }
      }
    }
  }
`;
