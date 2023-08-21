import { featureFlags } from "./feature-flag";
import { WithLoadFunction } from "single-spa-layout";

// Ensure to import the appropriate types from single-spa
type Application = import('single-spa').RegisterApplicationConfig & WithLoadFunction

interface FeatureFlags {
    [appName: string]: {
        [route: string]: boolean;
    };
}

class AppBuilder {
    app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    /**
     * Configures the application to be active or inactive based on the provided route and feature flags.
     * @param route - The route to be checked against the feature flags.
     * @returns This instance, for chaining methods.
     */
    withFeatureFlag(route: string): AppBuilder {
        const isActive = (featureFlags as FeatureFlags)[this.app.name]?.[route];
        if (isActive !== undefined) {
            this.app.activeWhen = location => location.pathname.startsWith(route) && isActive;
        }
        return this;
    }

    /**
     * Configures the application based on all available feature flags for the application.
     * @returns This instance, for chaining methods.
     */
    withAllFeatureFlags(): AppBuilder {
        const appFeatureFlags = (featureFlags as FeatureFlags)[this.app.name];
        if (appFeatureFlags) {
            Object.keys(appFeatureFlags).forEach(route => {
                this.withFeatureFlag(route);
            });
        }
        return this;
    }

    /**
     * Returns the built application configuration.
     * @returns The application configuration.
     */
    build(): Application {
        return this.app;
    }
}

export default AppBuilder;
