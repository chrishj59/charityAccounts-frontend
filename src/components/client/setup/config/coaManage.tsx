'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast, ToastMessage } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CoaType } from '~/src/types/ui-types/coa';
import { CoaFormValues, coaSchema } from '~/src/zodSchema/coa-schema';
import { ChartOfAccounts, FiscalPeriodRuleHeader } from '~/zenstack/models';
import { schema } from '~/zenstack/schema';

interface CoaProps {
  orgId: string;
  userId: string;
  coa: CoaType[];
  fiscPeriods: FiscalPeriodRuleHeader[];
}

export default function CoaManageUI({
  userId,
  orgId,
  coa,
  fiscPeriods,
}: CoaProps) {
  const router = useRouter();
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
  const updateCoa = client.chartOfAccounts.useUpdate();
  const emptyCoa: CoaType = {
    id: 0,
    name: '',
    fiscalPeriodRuleId: null,
    organizationId: '',
    ruleTitle: '',
    createdById: '',
  };

  const [coaList, setCoaList] = useState<CoaType[]>(coa);
  const [editCoaDlg, setEditCoaDlg] = useState<boolean>(false);
  const [editCoa, setEditCoa] = useState<CoaType>(emptyCoa);
  const [selectedRuleHeaderId, setSelectedRuleHeaderId] = useState<
    number | null | undefined
  >(null);

  const dt = useRef<DataTable<CoaType[]>>(null);
  const header = (
    <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
      <h4 className='m-0'>Manage Chart of accounts</h4>
      {/* <span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText
					type="search"
					placeholder="Search..."
					onInput={(e) => {
						const target = e.target as HTMLInputElement;

						setGlobalFilter(target.value);
					}}
				/>
			</span> */}
    </div>
  );
  const hideEditCoaDialog = () => {
    setEditCoaDlg(false);
  };
  const editCoaAction = (coa: CoaType) => {
    setEditCoa(coa);
    resetHeader(coa);

    setEditCoaDlg(true);
  };
  const actionBodyTemplate = (rowData: CoaType) => {
    return (
      <>
        <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='p-button-rounded p-button-success mr-2'
          onClick={() => editCoaAction(rowData)}
        />
      </>
    );
  };

  const handleFiscalRuleHeaderChange = async (e: DropdownChangeEvent) => {
    const _selectedId: number = e.value;
    setSelectedRuleHeaderId(_selectedId);
    setValueCoa('fiscalPeriodRuleId', _selectedId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const addCoaDialogFooter = (
    <div className='flex flex-row'>
      <Button
        type='button'
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideEditCoaDialog}
      />
      <Button
        label='Okay'
        type='submit'
        icon='pi pi-check'
        className='p-button-text'
      />
    </div>
  );

  const getCoaErrorMessage = (name: string) => {
    return (
      errorsCoa[name as keyof CoaFormValues] && (
        <small className='p-error'>
          {errorsCoa[name as keyof CoaFormValues]?.message}
        </small>
      )
    );
  };

  const {
    control: controlCoa,
    trigger: triggerCoa,
    formState: { errors: errorsCoa },
    handleSubmit: handleSubmitCoa,
    setValue: setValueCoa,

    getValues: getValuesCoa,

    reset: resetHeader,
  } = useForm<CoaFormValues>({
    resolver: zodResolver(coaSchema),
    defaultValues: emptyCoa,
  });

  const onSubmitCoa = async (data: CoaFormValues) => {
    console.log(
      `getValues in  onSubmitCoa ${JSON.stringify(getValuesCoa(), null, 2)}`,
    );

    try {
      const updatedCoa: ChartOfAccounts = await updateCoa.mutateAsync({
        where: { id: data.id },
        data: {
          name: data.name,
          fiscalPeriodRuleId: data.fiscalPeriodRuleId ?? 0,
          updatedById: userId,
        },
      });
      console.log(`uodatedCoa ${JSON.stringify(updatedCoa, null, 2)}`);
      showToast(
        'info',
        'Success',
        'Successfully Updated chart of accounts',
        false,
      );
      const _coaList = [...coaList];
      const _coaIdx = _coaList.findIndex((c) => c.id === updatedCoa.id);
      if (_coaIdx !== -1) {
        const _fiscalPeriod = fiscPeriods.find(
          (f) => f.id === updatedCoa.fiscalPeriodRuleId,
        );
        const _coa: CoaType = {
          id: updatedCoa.id,
          name: updatedCoa.name,
          fiscalPeriodRuleId: updatedCoa.fiscalPeriodRuleId,
          ruleTitle: _fiscalPeriod?.title ?? '',
          organizationId: updatedCoa.organizationId,
          createdById: updatedCoa.createdById,
        };
        _coaList[_coaIdx] = _coa;
        setCoaList(_coaList);
        setEditCoaDlg(false);
      }
    } catch (err) {
      showToast(
        'error',
        'Error',
        'Could not find update chart of accounts',
        false,
      );
    }
  };

  return (
    <>
      <DataTable
        ref={dt}
        value={coaList}
        dataKey='id'
        paginator
        removableSort
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Brands'
        header={header}
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
      <Dialog
        visible={editCoaDlg}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Edit Chart of Accounts'
        modal
        className='p-fluid'
        onHide={hideEditCoaDialog}
        pt={{
          headerTitle: {
            className: 'flex items-center justify-center ',
          },
        }}
      >
        {' '}
        <form onSubmit={handleSubmitCoa(onSubmitCoa)} className='p-fluid'>
          <Card footer={addCoaDialogFooter}>
            {/* Title field */}
            <div className='field'>
              <Controller
                name='name'
                control={controlCoa}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errorsCoa.name,
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
                    {getCoaErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Account type row */}
            <div className='field col-12'>
              <Controller
                name='fiscalPeriodRuleId'
                control={controlCoa}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errorsCoa.fiscalPeriodRuleId,
                      })}
                    ></label>
                    <span className='p-float-label'>
                      <Dropdown
                        id={field.name}
                        onChange={handleFiscalRuleHeaderChange}
                        options={fiscPeriods}
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
                    {getCoaErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
          </Card>
        </form>
      </Dialog>
      ;
    </>
  );
}
