import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react()
    ],

    server: {
        port: 5173,
        strictPort: true,
        cors: true,
    }

    // TEST SERVER HOST
    // server:{
    //     host: 'http://localhost:8000',
    //     port: 5173,
    // }

    // server: {
    //     host: '127.0.0.1',
    //     port: 5173,
    //     strictPort: true,
    //     cors: true,
    //     hmr: {
    //         host: '127.0.0.1',
    //         protocol: 'ws',
    //         port: 5173,
    //     },
    // }

//     server: {
//   host: '127.0.0.1',
//   port: 5173,
//   strictPort: true,
// //   cors: true,
//   hmr: {
//     host: '127.0.0.1',
//     protocol: 'ws',
//     port: 5173,
//   },
// }

//   server: {
//     host: '127.0.0.1',
//     port: 5173,
//     strictPort: true,
//     cors: true,
//     hmr: {
//       host: '127.0.0.1',
//       protocol: 'ws',
//       port: 5173,
//     },
//   },



});
