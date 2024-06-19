export type Role = StoryblokRole | CustomRole

export type StoryblokRole = {
  name: string
}

export type CustomRole = {
  id: number
  resolved_allowed_paths: string[]
  allowed_paths: number[]
  field_permissions: string[]
  readonly_field_permissions: string[]
  permissions: string[]
  role: string
  subtitle: string | null
  datasource_ids: number[]
  component_ids: number[]
  branch_ids: number[]
  allowed_languages: string[]
  asset_folder_ids: number[]
  ext_id: string | null
}
