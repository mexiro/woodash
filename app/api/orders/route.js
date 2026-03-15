import { NextResponse } from 'next/server'
import { WC_MOCK_ORDERS } from '../../../lib/mock-data'
import { getWooClient } from '../../../lib/woo-client'

const MOCK_MODE = process.env.MOCK_MODE === 'true'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = parseInt(searchParams.get('per_page') || '10')
    const search = searchParams.get('search') || ''

    if (MOCK_MODE) {
      let orders = [...WC_MOCK_ORDERS]
      if (status) orders = orders.filter(o => o.status === status)
      if (search) {
        const q = search.toLowerCase()
        orders = orders.filter(o =>
          o.billing.first_name.toLowerCase().includes(q) ||
          o.billing.last_name.toLowerCase().includes(q) ||
          o.number.includes(q)
        )
      }
      const total = orders.length
      const total_pages = Math.ceil(total / per_page)
      const start = (page - 1) * per_page
      return NextResponse.json({ orders: orders.slice(start, start + per_page), total, total_pages })
    }

    const api = getWooClient()
    const params = { page, per_page }
    if (status) params.status = status
    if (search) params.search = search
    const response = await api.get('orders', params)
    const total = parseInt(response.headers['x-wp-total'] || '0')
    const total_pages = parseInt(response.headers['x-wp-totalpages'] || '1')
    return NextResponse.json({ orders: response.data, total, total_pages })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
