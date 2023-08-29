import { IRouteConfig } from "./types";

export const routeConfigs: IRouteConfig[] = [
  {
    path: "/welcome",
    apps: [
      {
        name: "@ssm/angular-new",
        priority: true,
      },
      {
        name: "@ssm/angular-legacy",
        priority: false,
      },
    ],
  },
];
