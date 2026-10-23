import type { Ticket, TicketMessage, TicketStatus } from '~/data/tickets'

export interface TicketDepartment {
  id: number
  title: string
}

interface ApiDepartment {
  id: number
  title: string
}

interface ApiTicketMessage {
  id: number
  content: string
  created_at?: string | null
  user_id?: number | null
  is_support?: boolean | null
  file_url?: string | null
  user?: { id?: number | null } | null
}

interface ApiTicket {
  id: number
  subject: string
  department?: ApiDepartment | null
  priority?: string | null
  priority_fa?: string | null
  status?: string | null
  status_fa?: string | null
  created_at?: string | null
  messages?: ApiTicketMessage[]
  supporter?: { id?: number | null } | null
  customer?: { id?: number | null } | null
}

export interface CreateTicketPayload {
  subject: string
  departmentId: number
  priority: 'low' | 'medium' | 'top'
  content: string
}

function formatDate(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function mapStatus(status?: string | null): TicketStatus {
  if (status === 'closed') return 'closed'
  if (status === 'answer') return 'answered'
  return 'waiting'
}

function mapMessage(
  message: ApiTicketMessage,
  supporterId?: number | null,
  fallbackAuthor: 'user' | 'support' = 'user',
): TicketMessage {
  const author = message.is_support
    ? 'support'
    : message.user_id && supporterId && message.user_id === supporterId
      ? 'support'
      : fallbackAuthor

  return {
    id: String(message.id),
    author,
    body: message.content,
    date: formatDate(message.created_at),
    fileUrl: message.file_url ?? undefined,
  }
}

function mapTicket(ticket: ApiTicket): Ticket {
  const supporterId = ticket.supporter?.id ?? null
  return {
    id: String(ticket.id),
    code: `#${ticket.id}`,
    subject: ticket.subject,
    department: ticket.department?.title ?? '',
    status: mapStatus(ticket.status),
    date: formatDate(ticket.created_at),
    messages: (ticket.messages ?? []).map(message => mapMessage(message, supporterId)),
  }
}

/** Ticket departments for the create form. */
export function useTicketDepartments() {
  const api = useApi()
  const departments = ref<TicketDepartment[]>([])
  const loaded = ref(false)

  async function load() {
    const res = await api.get<ApiDepartment[]>('/shop/user/ticket/departments')
    departments.value = (res.data ?? []).map(item => ({ id: item.id, title: item.title }))
    loaded.value = true
  }

  return { departments, loaded, load }
}

/** Authenticated user's ticket list + create/close. */
export function useTickets() {
  const api = useApi()
  const tickets = ref<Ticket[]>([])
  const pending = ref(false)
  const loaded = ref(false)

  async function load() {
    pending.value = true
    try {
      const res = await api.get<ApiTicket[]>('/shop/user/ticket', {
        query: { 'filters[per_page]': 100 },
      })
      tickets.value = (res.data ?? []).map(mapTicket)
    }
    finally {
      loaded.value = true
      pending.value = false
    }
  }

  async function create(payload: CreateTicketPayload) {
    const res = await api.post<ApiTicket>('/shop/user/ticket', {
      subject: payload.subject,
      department_id: payload.departmentId,
      priority: payload.priority,
      content: payload.content,
    })
    if (res.data) tickets.value = [mapTicket(res.data), ...tickets.value]
    return res
  }

  async function close(id: string) {
    await api.post(`/shop/user/ticket/${encodeURIComponent(id)}/close`)
    tickets.value = tickets.value.map(ticket =>
      ticket.id === id ? { ...ticket, status: 'closed' } : ticket,
    )
  }

  return { tickets, pending, loaded, load, create, close }
}

/** One ticket + its messages via the dedicated single-ticket endpoint. */
export function useTicketDetail(id: Ref<string>) {
  const api = useApi()
  const ticket = ref<Ticket | undefined>(undefined)
  const pending = ref(false)
  const loaded = ref(false)

  async function load() {
    pending.value = true
    try {
      const res = await api.get<ApiTicket>(`/shop/user/ticket/${encodeURIComponent(id.value)}`)
      ticket.value = res.data ? mapTicket(res.data) : undefined
    }
    catch {
      ticket.value = undefined
    }
    finally {
      loaded.value = true
      pending.value = false
    }
  }

  async function reply(content: string, file?: File | null) {
    const form = new FormData()
    form.append('content', content)
    if (file) form.append('file', file)

    await api.post(`/shop/user/ticket/${encodeURIComponent(id.value)}/reply`, form)
    await load()
  }

  async function close() {
    await api.post(`/shop/user/ticket/${encodeURIComponent(id.value)}/close`)
    if (ticket.value) ticket.value = { ...ticket.value, status: 'closed' }
  }

  const notFound = computed(() => loaded.value && !ticket.value && !pending.value)

  return { ticket, pending, loaded, notFound, load, reply, close }
}
