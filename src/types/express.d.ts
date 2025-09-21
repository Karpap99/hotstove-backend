declare module "express" {
  interface Request {
    user?: {
      uuid: string;
      email: string;
      nickname: string;
    };
  }
}
