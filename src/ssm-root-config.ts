import { start } from "single-spa";
import {
  constructApplications,
  constructLayoutEngine,
  constructRoutes,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
import { registerApps } from "./applicationRegistrator";

const routes = constructRoutes(microfrontendLayout);

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});

registerApps(applications);
System.import("@ssm/styleguide").then(() => {
  // Activate the layout engine once the styleguide CSS is loaded
  layoutEngine.activate();
  start();
});
