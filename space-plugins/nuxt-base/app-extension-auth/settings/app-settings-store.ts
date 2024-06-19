export type SettingsEntry<Settings> = {
  spaceId: number
  settings: Settings
}

export type AppSettingsStore<Settings> = {
  get: (spaceId: number) => Promise<Settings | undefined>
  put: (
    operation: SettingsEntry<Settings> | SettingsEntry<Settings>[],
  ) => Promise<Settings[]>
  remove: (spaceId: number) => Promise<Settings | undefined>
}
