import { BIGCOMMERCE_API_URL } from './constants';
import { bigCommerceFetch } from './index';

export type RegisterCustomerParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  businessTaxId: string;
};

const loginCustomerMutation = /* GraphQL */ `
  mutation LoginCustomer($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      result
      customer {
        entityId
        email
        firstName
        lastName
      }
      customerAccessToken {
        value
        expiresAt
      }
    }
  }
`;

export async function registerCustomer(customer: RegisterCustomerParams) {
  if (!process.env.BIGCOMMERCE_ACCESS_TOKEN || !process.env.BIGCOMMERCE_STORE_HASH) {
    throw new Error('BigCommerce admin credentials are not configured.');
  }

  const response = await fetch(
    `${BIGCOMMERCE_API_URL}/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3/customers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': process.env.BIGCOMMERCE_ACCESS_TOKEN
      },
      body: JSON.stringify({
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName,
        phone: customer.phone,
        company: `${customer.company} | Tax ID: ${customer.businessTaxId}`,
        customer_group_id: 2,
        authentication: {
          force_password_reset: false,
          password: customer.password
        }
      })
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload?.title ||
      payload?.message ||
      payload?.errors?.[0]?.message ||
      'Failed to create BigCommerce customer.';
    throw new Error(message);
  }

  return payload;
}

export async function loginCustomer(email: string, password: string) {
  const response = await bigCommerceFetch<any>({
    query: loginCustomerMutation,
    variables: {
      email,
      password
    },
    cache: 'no-store'
  });

  return response.body.data.login;
}

const requestResetPasswordMutation = /* GraphQL */ `
  mutation RequestReset($email: String!) {
    customer {
      requestResetPassword(input: { email: $email }) {
        errors {
          __typename
          ... on ValidationError {
            message
          }
        }
      }
    }
  }
`;

export async function requestPasswordReset(email: string) {
  const response = await bigCommerceFetch<any>({
    query: requestResetPasswordMutation,
    variables: { email },
    cache: 'no-store'
  });

  return response.body.data.customer.requestResetPassword;
}
