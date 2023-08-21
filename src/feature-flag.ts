/**
 * Microfrontend Feature Flags Configuration with TypeScript.
 *
 * This module provides configurations for determining which applications should
 * be active for specific routes. It offers granularity by allowing certain apps
 * to always be active, while others can be conditionally active based on the route.
 * Furthermore, it provides an exclusion mechanism to avoid loading specific apps
 * for certain routes.
 */

interface IRouteConfig {
    [route: string]: string;
}

interface IExcludedRouteConfig {
    [route: string]: string[];
}

interface IAlwaysActiveRouteConfig {
    [appName: string]: string[];
}

interface IFeatureFlags {
    [appName: string]: {
        [route: string]: boolean;
    };
}

/**
 * Defines the primary application that should be active for a given route.
 */
export const activeAppsForRoutes: IRouteConfig = {
    '/welcome': '@ssm/angular-new',
    // ... other routes with their primary active apps
};

/**
 * A list of applications that should always be active regardless of the route.
 */
const alwaysActiveApps: string[] = ['@ssm/navbar'];

/**
 * Defines routes where the always-active applications should be loaded.
 * Supports wildcards (*) to denote all routes.
 */
const alwaysActiveRoutes: IAlwaysActiveRouteConfig = {
    '@ssm/navbar': ['*'],  // This app will be active on all routes
};

/**
 * Lists all the applications in the system.
 */
const allApps: string[] = ['@ssm/angular-legacy', '@ssm/angular-new', ...alwaysActiveApps];

/**
 * Defines which apps should be excluded from being loaded for certain routes.
 */
// TODO: rework, this is blocking app from loading on under any app; must prevent loading only on specific routes and apps
const excludedAppsForRoutes: IExcludedRouteConfig = {
    // '/welcome': ['@ssm/navbar'],  // Exclude navbar on the welcome route when legacy app is active
    // ... other routes with their excluded apps
};

/**
 * Generates a configuration object that determines the active state of
 * applications for various routes based on the above configurations.
 */
export const featureFlags: IFeatureFlags = allApps.reduce<IFeatureFlags>((flags, app) => {
    flags[app] = {};

    // If app is in alwaysActiveApps, check its routes
    if (alwaysActiveApps.includes(app)) {
        if (alwaysActiveRoutes[app]?.includes('*')) {
            // If app is active on all routes, check if it is excluded from any routes
            for (const route in activeAppsForRoutes) {
                // If app is excluded from a route, set the flag to false
                flags[app][route] = !excludedAppsForRoutes[route]?.includes(app);
            }
        } else {
            alwaysActiveRoutes[app]?.forEach(route => {
                flags[app][route] = !excludedAppsForRoutes[route]?.includes(app);
            });
        }
    }

    // For other apps, use the activeAppsForRoutes for activation flags
    for (const route in activeAppsForRoutes) {
        if (!flags[app][route]) {
            flags[app][route] = activeAppsForRoutes[route] === app;
        }
    }

    return flags;
}, {});

