/// <reference types="vite/client" />

// Allow importing JSON modules (build-time-generated data).
declare module "*.json" {
  const value: unknown;
  export default value;
}
