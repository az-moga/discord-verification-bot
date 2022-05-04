declare global {
    namespace NodeJS {
      interface ProcessEnv {
        CLIENT_TOKEN: string;
        CLIENT_ID: string;
        AZ_MOGA_SERVER_ID: string;
        AZ_MOGA_ROLES_ENDPOINT: string;
        AZ_MOGA_ADMIN_ROLE_IDS: string;
    }
  }
}

export {}