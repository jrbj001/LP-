/**
 * PoC: mesmo POST do backend (Messages.json, From/To crus).
 * Uso: node --env-file=.env.local scripts/twilio-poc-send.mjs
 */
const sid = process.env.TWILIO_ACCOUNT_SID
const token = process.env.TWILIO_AUTH_TOKEN
const from = process.env.TWILIO_WHATSAPP_FROM
if (!sid || !token || !from) {
  console.error('faltam TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN ou TWILIO_WHATSAPP_FROM')
  process.exit(1)
}

const auth = Buffer.from(`${sid}:${token}`).toString('base64')
const headers = { Authorization: `Basic ${auth}` }

function last4(value) {
  const digits = String(value || '').replace(/\D/g, '')
  return digits ? `*${digits.slice(-4)}` : 'none'
}

async function json(url, init) {
  const res = await fetch(url, init)
  const text = await res.text()
  let data = {}
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text.slice(0, 200) }
  }
  return { http: res.status, data }
}

const list = await json(
  `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json?PageSize=20`,
  { headers }
)
if (list.http !== 200) {
  console.error('list_failed', list.http, list.data.code)
  process.exit(1)
}

const inbound = (list.data.messages || []).find(msg => msg.direction === 'inbound')
const to = process.env.TWILIO_POC_TO?.trim() || inbound?.from
if (!to) {
  console.error('sem destinatário (último inbound ou TWILIO_POC_TO)')
  process.exit(1)
}

const body = 'PoC Cadence backend: se esta linha chegou, o send.ts funciona.'
const sent = await json(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
  method: 'POST',
  headers: {
    ...headers,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({ From: from, To: to, Body: body }),
})

console.log(
  JSON.stringify({
    step: 'create',
    http: sent.http,
    status: sent.data.status ?? null,
    error: sent.data.error_code ?? sent.data.code ?? null,
    from: last4(from),
    to: last4(to),
    sidPrefix: String(sent.data.sid || '').slice(0, 2),
  })
)

const messageSid = sent.data.sid
if (!messageSid) process.exit(sent.http >= 400 ? 1 : 0)

for (let i = 0; i < 6; i += 1) {
  await new Promise(resolve => setTimeout(resolve, 2500))
  const check = await json(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages/${messageSid}.json`,
    { headers }
  )
  console.log(
    JSON.stringify({
      step: 'poll',
      n: i + 1,
      status: check.data.status ?? null,
      error: check.data.error_code ?? null,
    })
  )
  if (['delivered', 'read', 'failed', 'undelivered'].includes(check.data.status)) break
}
