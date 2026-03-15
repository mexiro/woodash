import { NextResponse } from 'next/server'
import { WC_MOCK_ORDERS } from '../../../lib/mock-data'
import { getWooClient } from '../../../lib/woo-client'

const MOCK_MODE = process.env.MOCK_MODE === 'true'

function computeAnalytics(orders) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)

  const recent = orders.filter(o => new Date(o.date_created) >= thirtyDaysAgo)
  const countable = recent.filter(o => !['cancelled', 'refunded'].includes(o.status))

  const total_sales = countable.reduce((sum, o) => sum + parseFloat(o.total), 0)
  const total_orders = recent.length
  const average_order_value = countable.length ? total_sales / countable.length : 0

  const orders_by_status = {}
  for (const o of recent) {
    orders_by_status[o.status] = (orders_by_status[o.status] || 0) + 1
  }

  // Sales by day (last 14 days)
  const salesMap = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    salesMap[key] = 0
  }
  for (const o of countable) {
    const key = o.date_created.split('T')[0]
    if (key in salesMap) salesMap[key] += parseFloat(o.total)
  }
  const sales_by_day = Object.entries(salesMap).map(([date, total]) => ({ date, total: parseFloat(total.toFixed(2)) }))

  // Top products by quantity sold
  const productMap = {}
  for (const o of countable) {
    for (const item of o.line_items) {
      if (!productMap[item.name]) productMap[item.name] = { name: item.name, quantity_sold: 0, revenue: 0 }
      productMap[item.name].quantity_sold += item.quantity
      productMap[item.name].revenue += parseFloat(item.total)
    }
  }
  const top_products = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({ ...p, revenue: parseFloat(p.revenue.toFixed(2)) }))

  return {
    total_sales: parseFloat(total_sales.toFixed(2)),
    total_orders,
    average_order_value: parseFloat(average_order_value.toFixed(2)),
    orders_by_status,
    sales_by_day,
    top_products,
  }
}

export async function GET() {
  try {
    if (MOCK_MODE) {
      return NextResponse.json(computeAnalytics(WC_MOCK_ORDERS))
    }

    const api = getWooClient()
    const response = await api.get('orders', { per_page: 100, status: 'any' })
    return NextResponse.json(computeAnalytics(response.data))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
