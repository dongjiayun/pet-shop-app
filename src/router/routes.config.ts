interface Route {
    path: string;
    name: string;
    tabbarName?: string;
    isTabbar?: boolean;
    tabActiveIcon?: string;
    tabInactiveIcon?: string;
}

type Routes = Route[];

const base: Routes = [
    {
        path: "/pages/index/index",
        name: "home",
    },
    {
        path: "/pages/auth/signin",
        name: "signin",
    },
    {
        path: "/pages/auth/signup",
        name: "signup",
    },
    {
        path: "/pages/auth/resetPassword",
        name: "resetPassword",
    },
];

const routes: Route[] = [...base];

export { routes };
export type { Route, Routes };
