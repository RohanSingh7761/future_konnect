import { gql } from "@apollo/client"

export const AUDIT_TRAIL = gql`
    query AuditTrail {
        audit_trail {
            timestamp
            description
            event_type
            category
            performed_by
        }
    }
`

export const GET_TENANT_USAGE = gql`
    query GetTenantUsage {
        data_usage {
            id
            tenant_id
            data_used
        }
    }
`

export const GET_DAILY_DATA_USAGE = gql`
    query GetDailyDataUsage {
        daily_data_usage(order_by: { recorded_on: asc }) {
            recorded_on
            total_data_used
        }
    }
`

export const LOGIN_USER = gql `
query Login($_eq: String = "acme@corp.com") {
  users(where: {email: {_eq: $_eq}}) {
    id
    name
    email
    passwd
  }
}
`

export const SIGUNP_USER = gql `
mutation MyMutation($email: String!, $id: Int!, $name: String!, $passwd: String!) {
  insert_users(objects: {email: $email, name: $name, passwd: $passwd, id: $id}) {
    returning {
      email
      name
      passwd
      id
    }
  }
}
`