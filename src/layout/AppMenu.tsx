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
                  label: 'Edit Fund',
                  to: '/secure/funds/masterdata/edit',
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
            {
              icon: 'pi-pencil',
              label: 'Load currencies',
              to: '/secure/set-up/basic/uploadCurrency',
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
              icon: 'pi pi-pencil',
              to: '/secure/set-up/basic/company-update',
            },
            {
              label: 'Company Group',
              icon: 'pi pi-chevron-down',
              items: [
                {
                  label: 'Create',
                  to: '/secure/set-up/basic/company/company-group/comp-group-create',
                },
                {
                  label: 'Manage',
                  to: '/secure/set-up/basic/company/company-group/comp-group-manage',
                },
              ],
            },
          ],
        },
        {
          label: 'Chart of Accoounts',
          items: [
            {
              icon: 'pi pi-file-plus',
              label: 'Create',
              to: '/secure/set-up/basic/coa/coa-create',
            },
            {
              icon: 'pi pi-pencil',
              label: 'Manage',
              to: '/secure/set-up/basic/coa/coa-manage',
            },
          ],
        },
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
