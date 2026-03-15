export const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#F59E0B', bg: '#FEF3C7' },
  processing: { label: 'Processing', color: '#3B82F6', bg: '#DBEAFE' },
  'on-hold':  { label: 'On Hold',    color: '#8B5CF6', bg: '#EDE9FE' },
  completed:  { label: 'Completed',  color: '#10B981', bg: '#D1FAE5' },
  cancelled:  { label: 'Cancelled',  color: '#EF4444', bg: '#FEE2E2' },
  refunded:   { label: 'Refunded',   color: '#6B7280', bg: '#F3F4F6' },
}

export const STATUS_FLOW = {
  pending:    ['processing', 'on-hold', 'cancelled'],
  processing: ['completed', 'on-hold', 'cancelled'],
  'on-hold':  ['processing', 'cancelled'],
  completed:  ['refunded'],
  cancelled:  [],
  refunded:   [],
}
