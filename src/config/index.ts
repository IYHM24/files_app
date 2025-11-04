export const config = {
  app: {
    name: 'Files App',
    version: '1.0.0',
    description: 'A professional file management application',
  },
  
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
  },

  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },

  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    local: {
      uploadPath: './uploads',
    },
    s3: {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || 'us-east-1',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  },

  database: {
    url: process.env.DATABASE_URL || 'sqlite:./database.db',
  },

  auth: {
    secret: process.env.AUTH_SECRET || 'your-secret-key',
    tokenExpiry: '7d',
  },
} as const;