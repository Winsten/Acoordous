const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
    ],
  },
  {
    path: '/proprietario',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/imoveis',
        component: () => import('layouts/MainLayout.vue'),
        children: [
          { path: '', component: () => import('pages/Index.vue') },
        ],
      },
      // 
      // Imoveis
      //  x
      {
        path: '/imovel',
        component: () => import('pages/Imoveis/imoveis-index.vue')
      },
      {
        path: '/imovel/lixeira/:lixeira',
        component: () => import('pages/Imoveis/imoveis-index.vue')
      },
      {
        path: '/imovel/create',
        component: () => import('pages/Imoveis/imoveis-form.vue')
      },
      {
        path: '/imovel/:id',
        component: () => import('pages/Imoveis/imoveis-form.vue')
      },
      {
        path: '/imovel/copiar/:copy/:id',
        component: () => import('pages/Imoveis/imoveis-form.vue')
      },
      {
        path: '/imovel/:id/:edit',
        component: () => import('pages/Imoveis/imoveis-form.vue')
      },
    ],
  },
  

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
