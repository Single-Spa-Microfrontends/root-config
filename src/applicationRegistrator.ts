import { mapAppWithRouteConfig } from "./applicationMapper";
import { registerApplication, RegisterApplicationConfig } from "single-spa";
import { WithLoadFunction } from "single-spa-layout/dist/types/browser/constructApplications";

export function registerApps(
  applications: (RegisterApplicationConfig & WithLoadFunction)[]
) {
  applications.map(mapAppWithRouteConfig).forEach(registerApplication);
}
