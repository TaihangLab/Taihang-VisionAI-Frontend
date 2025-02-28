export interface WarningItem {
  id: string
  deviceName: string
  imageUrl: string
  value: number
  unit: string
  level: string
  time: string
  status: 'pending' | 'processing' | 'completed'
  deviceInfo: {
    name: string
    position: string
  }
} 