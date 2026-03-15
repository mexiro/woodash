let _client = null

export function getWooClient() {
  if (process.env.MOCK_MODE === 'true') return null
  if (_client) return _client

  // Lazy require avoids ESM/CJS issues at build time
  const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
  _client = new WooCommerceRestApi({
    url: process.env.WOOCOMMERCE_URL,
    consumerKey: process.env.WOOCOMMERCE_KEY,
    consumerSecret: process.env.WOOCOMMERCE_SECRET,
    version: 'wc/v3',
  })
  return _client
}
