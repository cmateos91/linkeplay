export type Dev = {
  id: string
  user_id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  discord_invite_url: string | null
  discord_member_count?: number | null
  social_links: Record<string, string>
  created_at: string
}

export type Game = {
  id: string
  dev_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  game_url: string
  is_published: boolean
  sort_order: number
  created_at: string
}

export type EventType = 'page_view' | 'game_start' | 'discord_click'

export type Event = {
  id: string
  dev_id: string
  game_id: string | null
  event_type: EventType
  session_id: string
  created_at: string
}
