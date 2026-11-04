export function mondaySse(content: string): Response {
  const chunks = content
    ? `data: ${JSON.stringify({ type: 'text', content })}\n\ndata: [DONE]\n\n`
    : 'data: [DONE]\n\n'
  return new Response(chunks, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}

export function mondayJson(message: string): Response {
  return Response.json({ message })
}

export function mondayReply(stream: boolean, message: string): Response {
  return stream ? mondaySse(message) : mondayJson(message)
}
