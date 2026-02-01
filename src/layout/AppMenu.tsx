import type { MenuModel } from '~/src/types';
import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
  const model: MenuModel[] = [
    {
      icon: 'ArrowDropDownIcon',
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
            {
              icon: 'pi pi-file-plus',
              label: 'Create',
              to: '/secure/set-up/basic/company-create',
            },
            {
              label: 'Update',
              icon: 'pi-pencil',
              to: '/secure/set-up/basic/company-update',
            },
            {
              label: 'Fiscal Year Periods',
              to: '/secure/set-up/basic/fiscal-year-period',
            },
          ],
        },
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
