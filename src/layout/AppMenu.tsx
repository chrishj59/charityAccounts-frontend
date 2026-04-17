import type { MenuModel } from '~/src/types';
import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
  const model: MenuModel[] = [
    {
      icon: 'ArrowDropDownIcon',
      label: 'Accounting',
      items: [
        {
          label: 'Fund',
          items: [
            {
              label: 'Master Data',
              items: [
                {
                  label: 'Create Fund',
                  to: '/secure/funds/masterdata/create',
                },
                {
                  label: 'List Funds',
                  to: '/secure/funds/masterdata/list',
                },
              ],
            },
          ],
        },
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
          label: 'Global',
          items: [
            {
              icon: 'pi-pencil',
              label: 'Fisc Period Rule',
              to: '/secure/set-up/basic/fiscalPeriodRule',
            },
          ],
        },
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
          ],
        },
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
