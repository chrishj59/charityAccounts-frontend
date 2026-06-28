'use client';

import { Card } from 'primereact/card';
import { FiscalPeriodRuleUI } from '~/src/types/ui-types/fiscal-period';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema';
import { useRef, useState } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { CompanyGroup } from '~/zenstack/models';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CompanyGroupFormValues,
  companyGroupSchema,
} from '~/src/zodSchema/company-group.schema';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { CompanyGroupUI } from '~/src/types/ui-types/compGrp';

interface CompanyGroupProps {
  userId: string;
  orgId: string;
  fiscRuleList: FiscalPeriodRuleUI[];
  groupCompanyList: CompanyGroupUI[];
}
export default function CompanyGroupManageUI({
  userId,
  orgId,
  fiscRuleList,
  groupCompanyList,
}: CompanyGroupProps) {
  const client = useClientQueries(schema);
  const toast = useRef<Toast | null>(null);
  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
  };
  const updateGrpComp = client.companyGroup.useUpdate();

  const emptyCompGrp: CompanyGroupUI = {
    id: 0,
    name: '',
    fiscalRuleId: 0,
  };

  const [groupCompanies, setGroupCompanies] =
    useState<CompanyGroupUI[]>(groupCompanyList);
  const [editCompGrpDlg, setEditCompGrpDlg] = useState<boolean>(false);
  const [editCompGrp, setEditCompGrp] = useState<CompanyGroupUI>(emptyCompGrp);
  const [selectedRuleHeaderId, setSelectedRuleHeaderId] = useState<
    number | null | undefined
  >(null);
  const dt = useRef<DataTable<CompanyGroupUI[]>>(null);
  const tableHeader = (
    <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
      <h4 className='m-0'>Manage Chart of accounts</h4>
    </div>
  );

  const {
    control: controlGrpComp,
    trigger: triggerGrpComp,
    formState: { errors: errorsGrpComp },
    handleSubmit: handleSubmitGrpComp,
    setValue: setValueGrpComp,

    getValues: getValuesGrpComp,

    reset: resetCompGrp,
  } = useForm<CompanyGroupFormValues>({
    resolver: zodResolver(companyGroupSchema),
    defaultValues: emptyCompGrp,
  });
  const hideEditCompGrpDialog = () => {
    setEditCompGrpDlg(false);
  };

  const addGrpCompDialogFooter = (
    <div className='flex flex-row'>
      <Button
        type='button'
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideEditCompGrpDialog}
      />
      <Button
        label='Okay'
        type='submit'
        icon='pi pi-check'
        className='p-button-text'
      />
    </div>
  );
  const editCompGrpAction = (compGrp: CompanyGroupUI) => {
    setEditCompGrp(compGrp);
    resetCompGrp(compGrp);

    setEditCompGrpDlg(true);
  };

  const actionBodyTemplate = (rowData: CompanyGroup) => {
    return (
      <>
        <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='p-button-rounded p-button-success mr-2'
          onClick={() => editCompGrpAction(rowData)}
        />
      </>
    );
  };

  const handleFiscalRuleHeaderChange = async (e: DropdownChangeEvent) => {
    const _selectedId: number = e.value;
    setSelectedRuleHeaderId(_selectedId);
    setValueGrpComp('fiscalRuleId', _selectedId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const onSubmitGrpComp = async (data: CompanyGroupFormValues) => {
    try {
      const updatedGrpComp = await updateGrpComp.mutateAsync({
        where: { id: data.id },
        data: {
          name: data.name,
          fiscalPeriodRuleId: data.fiscalRuleId,
        },
      });

      showToast('info', 'Success', 'Successfully Updated Group Company', false);
      const _grpComps = [...groupCompanies];
      const idx = _grpComps.findIndex((c) => c.id === updatedGrpComp.id);
      if (idx !== -1) {
        const _fiscalPeriod = fiscRuleList.find(
          (f) => f.id === updatedGrpComp.fiscalPeriodRuleId,
        );
        const _grpComp: CompanyGroupUI = {
          id: updatedGrpComp.id,
          name: updatedGrpComp.name,
          fiscalRuleId: updatedGrpComp.fiscalPeriodRuleId,
          ruleTitle: _fiscalPeriod?.title,
        };
        _grpComps[idx] = _grpComp;
        setGroupCompanies(_grpComps);
        setEditCompGrpDlg(false);
      }
    } catch (err) {
      console.error(`Group Comp update error ${JSON.stringify(err, null, 2)}`);
      showToast('error', 'Error', 'Could not update chart of accounts', false);
    }
  };

  const getGrpCompErrorMessage = (name: string) => {
    return (
      errorsGrpComp[name as keyof CompanyGroupFormValues] && (
        <small className='p-error'>
          {errorsGrpComp[name as keyof CompanyGroupFormValues]?.message}
        </small>
      )
    );
  };
  return (
    <>
      <Toast ref={toast} position='top-right' />
      <DataTable
        ref={dt}
        value={groupCompanies}
        dataKey='id'
        paginator
        removableSort
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Group Companies'
        header={tableHeader}
        pt={{
          header: {
            className: 'flex justify-content-center align-items-center',
          },
        }}
      >
        <Column field='name' header='name' />
        <Column field='ruleTitle' header='Period Rule' />
        <Column
          header='Edit'
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: '1rem' }}
        />
      </DataTable>

      {/* Update dialog */}
      <Dialog
        visible={editCompGrpDlg}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Edit Group Company'
        modal
        className='p-fluid'
        onHide={hideEditCompGrpDialog}
        pt={{
          headerTitle: {
            className: 'flex items-center justify-center ',
          },
        }}
      >
        {' '}
        <form
          onSubmit={handleSubmitGrpComp(onSubmitGrpComp)}
          className='p-fluid'
        >
          <Card footer={addGrpCompDialogFooter}>
            {/* Title field */}
            <div className='field'>
              <Controller
                name='name'
                control={controlGrpComp}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errorsGrpComp.name,
                      })}
                    />
                    <span className='p-float-label'>
                      <InputText
                        id={field.name}
                        value={field.value}
                        autoFocus
                        onChange={(e) => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <label htmlFor={field.name}>Period rule title</label>
                    </span>
                    {getGrpCompErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Account type row */}
            <div className='field col-12'>
              <Controller
                name='fiscalRuleId'
                control={controlGrpComp}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errorsGrpComp.fiscalRuleId,
                      })}
                    ></label>
                    <span className='p-float-label'>
                      <Dropdown
                        id={field.name}
                        onChange={handleFiscalRuleHeaderChange}
                        options={fiscRuleList}
                        value={field.value}
                        optionLabel='title'
                        optionValue='id'
                        placeholder='Fiscal Periods'
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <label htmlFor={field.name}>Account Type</label>
                    </span>
                    {getGrpCompErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
          </Card>
        </form>
      </Dialog>
    </>
  );
}
