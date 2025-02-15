declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
      // Add other environment variables here as needed
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

// This export is necessary to make this a module
export {} 