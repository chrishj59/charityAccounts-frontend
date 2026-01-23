import type { MenuModel } from '~/src/types';
import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
  const model: MenuModel[] = [
    {
      label: 'Accounting',
      items: [
        {
          label: 'Receivable',
          items: [
            {
              label: 'Account',
              items: [{ label: 'Create', to: '/secure/ar/account/create' }],
            },
          ],
        },
      ],
    },
    {
      label: 'Set up',
      items: [
        {
          label: 'Company',
          items: [
            { label: 'Create', to: '/secure/set-up/basic/company-create' },
            {
              label: 'Fiscal Year Var',
              to: '/secure/set-up/basic/fiscal-year-variant',
            },
          ],
        },
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
