import './bootstrap';
import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
let resolvedPages = {};

createInertiaApp({
    resolve: name => {

    if (resolvedPages[name]) {
        console.log(`Page [${name}] already resolved`);
        return resolvedPages[name];
    }

    // console.log("Resolving page: ", name);
    // console.log("Pages available: ", pages);

    const pageModule = pages[`./Pages/${name}.jsx`];
    resolvedPages[name] = pageModule;

    // // testing for default layout if exist or not
    // pageModule.default.layout =
    //     pageModule.default.layout || ((page) => <layout />)

    return pageModule?.default;
  },
  setup({ el, App, props }) {
    // console.log("Value el: ", el)
    // console.log("Value App: ", App)
    // console.log("Value props: ", props)
    createRoot(el).render(<App {...props} />);
  },
});
