import { routeConfigs } from "./routeConfigs";
import { WithLoadFunction } from "single-spa-layout/dist/types/browser/constructApplications";
import { RegisterApplicationConfig } from "single-spa";

export function mapAppWithRouteConfig(
  app: RegisterApplicationConfig & WithLoadFunction
): RegisterApplicationConfig & WithLoadFunction {
  return {
    ...app,
    activeWhen: (location: Location) => {
      const routeConfig = routeConfigs.find((route) =>
        location.pathname.startsWith(route.path)
      );

      if (routeConfig) {
        const appConfig = routeConfig.apps.find((a) => a.name === app.name);

        // If the app is present in the routeConfig and it's marked as priority, make it active.
        if (appConfig && appConfig.priority) {
          return true;
        }

        // If the app is present in the routeConfig and it's not marked as priority, make it inactive.
        if (appConfig && !appConfig.priority) {
          return false;
        }
      }

      // For all other apps and routes, return true, which means the app will be active by default.
      // You can replace this with more custom logic if needed.
      return true;
    },
  };
}
