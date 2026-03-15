import { NextResponse } from 'next/server'
import { WC_MOCK_ORDERS } from '../../../../lib/mock-data'
import { getWooClient } from '../../../../lib/woo-client'

const MOCK_MODE = process.env.MOCK_MODE === 'true'

// In-memory store for mock status updates (resets on server restart)
let mockOrders = [...WC_MOCK_ORDERS]

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)

    if (MOCK_MODE) {
      const order = mockOrders.find(o => o.id === id)
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      return NextResponse.json(order)
    }

    const api = getWooClient()
    const response = await api.get(`orders/${id}`)
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()

    if (MOCK_MODE) {
      const idx = mockOrders.findIndex(o => o.id === id)
      if (idx === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      mockOrders[idx] = { ...mockOrders[idx], ...body, date_modified: new Date().toISOString() }
      return NextResponse.json(mockOrders[idx])
    }

    const api = getWooClient()
    const response = await api.put(`orders/${id}`, body)
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
