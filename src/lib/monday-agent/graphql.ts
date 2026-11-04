const MONDAY_API = 'https://api.monday.com/v2'

export async function postMondayAgentUpdate(input: {
  itemId: string
  body: string
  parentId?: string
  token?: string
}): Promise<void> {
  const token = input.token ?? process.env.MONDAY_AGENT_API_TOKEN?.trim()
  if (!token) throw new Error('MONDAY_AGENT_API_TOKEN não configurado.')

  const query = input.parentId
    ? `mutation ($itemId: ID!, $body: String!, $parentId: ID) {
        create_update(item_id: $itemId, body: $body, parent_id: $parentId) { id }
      }`
    : `mutation ($itemId: ID!, $body: String!) {
        create_update(item_id: $itemId, body: $body) { id }
      }`

  const response = await fetch(MONDAY_API, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      'API-Version': 'dev',
    },
    body: JSON.stringify({
      query,
      variables: {
        itemId: input.itemId,
        body: input.body,
        parentId: input.parentId,
      },
    }),
  })
  const data = (await response.json()) as { errors?: Array<{ message?: string }> }
  if (!response.ok || data.errors?.length) {
    throw new Error(data.errors?.[0]?.message || `Monday recusou a atualização (${response.status}).`)
  }
}
