export interface IRouteApp {
  name: string;
  replace?: string;
  priority?: boolean;
}

export interface IRouteConfig {
  path: string;
  apps: IRouteApp[];
}
