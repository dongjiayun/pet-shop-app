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
        path: "/pages/index/index",
        name: "mine",
    },
];

const auth: Routes = [
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

const mine: Routes = [
    {
        path: "/pages/mine/editNickname",
        name: "editNickname",
    },
];

const pet: Routes = [
    {
        path: "/pages/pet/index",
        name: "petList",
    },
    {
        path: "/pages/pet/create",
        name: "createPet",
    },
];

const routes: Route[] = [...base, ...auth, ...mine, ...pet];

export { routes };
export type { Route, Routes };
