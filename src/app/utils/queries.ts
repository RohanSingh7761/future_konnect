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