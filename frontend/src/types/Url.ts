export interface OverallAnalyticsResult {
  totalUrls: number;
  totalClicks: number;
  uniqueUsers: number;
  osType: OsTypeObject[];
  deviceType: DeviceTypeObject[];
}

interface OsTypeObject {
  osName: string;
  uniqueClicks: number;
  uniqueUsers: number;
}

interface DeviceTypeObject {
  deviceName: string;
  uniqueClicks: number;
  uniqueUsers: number;
}

export interface AllUrls {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  userId: string;
  topic: string;
  customAlias: string;
  createdAt: Date;
}
