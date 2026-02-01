'use client';

import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Controller, useForm } from 'react-hook-form';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';

import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import {
  fiscalYearPeriodSchema,
  FiscYearVariantFormValues,
} from '~/src/zodSchema/fisYearPeriod';
import { zodResolver } from '@hookform/resolvers/zod';

interface FiscalYearVarProps {
  fiscVar: FiscalYearPeriod[];
}
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { FiscalYearPeriod } from '~/zenstack/models';

export default function FiscalPeriodRule({ fiscVar }: FiscalYearVarProps) {
  const toast = useRef<Toast | null>(null);
  const emptyFiscYrVar: FiscalYearPeriod = {
    id: 0,
    name: '',
    monthNum: 0,
    day: 0,
    fiscPeriod: 0,
    yearShift: false,
  };

  const [fiscYrVarList, setFiscYrVarList] =
    useState<FiscalYearPeriod[]>(fiscVar);
  const [fiscYrVar, setFiscYrVar] = useState<FiscalYearPeriod>(emptyFiscYrVar);
  const [fiscYrDialog, setFiscYrDialog] = useState<boolean>(false);
  const [fiscYrAddDialog, setFiscYrAddDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FiscYearVariantFormValues>({
    resolver: zodResolver(fiscalYearPeriodSchema),
    defaultValues: emptyFiscYrVar,
  });

  const dt = useRef<DataTable<FiscalYearPeriod[]>>(null);
  console.log(`fiscVar in client ${JSON.stringify(fiscYrVarList)}`);

  const addFiscYrVar = (fiscYrVar: FiscalYearPeriod) => {
    const _fiscYrVar: FiscalYearPeriod = emptyFiscYrVar;

    setFiscYrVar(_fiscYrVar);
    setFiscYrAddDialog(true);
    reset(fiscYrVar);
  };
  const editFiscYrVar = (fiscYrVar: FiscalYearPeriod) => {
    const _fiscYrVar: FiscalYearPeriod = {
      id: fiscYrVar.id,
      name: fiscYrVar.name,
      monthNum: fiscYrVar.monthNum,
      day: fiscYrVar.day,
      fiscPeriod: fiscYrVar.fiscPeriod,
      yearShift: fiscYrVar.yearShift,
    };
    setFiscYrVar(_fiscYrVar);
    setFiscYrDialog(true);
    reset(fiscYrVar);
  };

  const hideFiscYrVarDialog = () => {
    setSubmitted(false);
    setFiscYrDialog(false);
  };

  const hideFiscYrVarAddDialog = () => {
    setSubmitted(false);
    setFiscYrAddDialog(false);
    alert(`hideFiscYrVarAddDialog called`);
  };

  const actionBodyTemplate = (rowData: FiscalYearPeriod) => {
    return (
      <>
        <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='p-button-rounded p-button-success mr-2'
          onClick={() => editFiscYrVar(rowData)}
        />
      </>
    );
  };

  const addDialogFooter = (
    <div className='flex flex-row'>
      <Button
        type='button'
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideFiscYrVarAddDialog}
      />
      <Button
        label='Save'
        type='submit'
        icon='pi pi-check'
        className='p-button-text'
        //onClick={saveBrand}
      />
    </div>
  );
  const updateDialogFooter = (
    <div className='flex flex-row'>
      <Button
        type='button'
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideFiscYrVarDialog}
      />
      <Button
        label='Save'
        type='submit'
        icon='pi pi-check'
        className='p-button-text'
        //onClick={saveBrand}
      />
    </div>
  );
  const onSubmitAdd = async (updated: FiscalYearPeriod) => {
    // const client = useClientQueries(schema);
    // const { mutateAsync: create, isPending } =
    //   client.FiscalYearPeriod.useCreate(); //client.todoList.useCreate();

    // const resp = await create({ data: updated });

    const payload = {
      data: {
        type: 'FiscalYearPeriod',
        attributes: {
          name: updated.name,
          monthNum: updated.monthNum,
          day: updated.day,
          fiscPeriod: updated.fiscPeriod,
          yearShift: updated.yearShift,
        },
      },
    };
    const res = await fetch('/api/model/FiscalYearPeriod', {
      method: 'POST',
      // headers: await headers(),
      cache: 'no-store',
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const dbVar = (await res.json()) as FiscalYearPeriod;
      console.log(`res.status ${res.status} text: ${res.statusText}`);
      console.log(`updated ${JSON.stringify(dbVar)}`);
      updated.id = dbVar.id;
      const _fiscYrVarList = fiscYrVarList;

      _fiscYrVarList.push(updated);
      setFiscYrVarList(_fiscYrVarList);
    }

    setFiscYrAddDialog(false);
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof FiscalYearPeriod] && (
        <small className='p-error'>
          {errors[name as keyof FiscalYearPeriod]?.message}
        </small>
      )
    );
  };

  return (
    <>
      <Card
        title={
          <div className='flex justify-content-center align-items-center'>
            Fiscal Year Variant
          </div>
        }
        // title='Fiscal Year Variant'
        // pt={{
        //   title: { className: 'flex align-self-center align-items-center ' },
        // }}
      >
        <div className='flex flex-wrap justify-content-end'>
          <Button onClick={() => addFiscYrVar(emptyFiscYrVar)}>
            Add Fiscal Year Variant
          </Button>
        </div>
        <DataTable
          value={fiscYrVarList}
          tableStyle={{ minWidth: '50rem' }}
          emptyMessage='No Fiscal Year periods'
        >
          <Column field='name' header='Name' />
          <Column field='monthNum' header='Month ' />
          <Column field='day' header='Day of Month' />
          <Column field='fiscPeriod' header='Fiscal Period' />
          <Column field='yearShift' header='Year Adj' />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '1rem' }}
          />
        </DataTable>
      </Card>
      <Dialog
        visible={fiscYrAddDialog}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Add Fiscal Year Periods'
        modal
        className='p-fluid'
        onHide={hideFiscYrVarAddDialog}
      >
        <form onSubmit={handleSubmit(onSubmitAdd)} className='p-fluid'>
          <Card footer={addDialogFooter}>
            {/* Name field  */}
            <div className='field'>
              <Controller
                name='name'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.name,
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
                      <label htmlFor={field.name}>Month Name</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Month number field */}
            <div className='field'>
              <Controller
                name='monthNum'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.monthNum,
                      })}
                    />
                    <span className='p-float-label'>
                      <InputNumber
                        id={field.name}
                        value={field.value}
                        onBlur={field.onBlur}
                        min={0}
                        max={12}
                        showButtons
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <label htmlFor={field.name}>Month Number</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Day of Month field */}
            <div className='field'>
              <Controller
                name='day'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.day,
                      })}
                    />
                    <span className='p-float-label'>
                      <InputNumber
                        id={field.name}
                        value={field.value}
                        min={0}
                        max={31}
                        showButtons
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <label htmlFor={field.name}>Day of Month</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Fiscal period */}
            <div className='field'>
              <Controller
                name='fiscPeriod'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.fiscPeriod,
                      })}
                    />
                    <span className='p-float-label'>
                      <InputNumber
                        id={field.name}
                        value={field.value}
                        min={0}
                        max={16}
                        showButtons
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <label htmlFor={field.name}>Fiscal Period</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* shift Year */}
            <div className='flex flex-row'>
              <div className='mr-2'>
                <label htmlFor='yearShift'>Previous Calendar year</label>
              </div>
              <div>
                <Controller
                  name='yearShift'
                  control={control}
                  // rules={{ required: 'Shipping Module is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.fiscPeriod,
                        })}
                      />
                      {/* <span className='p-float-label mr-5'> */}
                      <InputSwitch
                        id={field.name}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      {/* <label htmlFor={field.name}>Fiscal Period</label> */}
                      {/* </span> */}
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>
            </div>
          </Card>
        </form>
      </Dialog>
    </>
  );
}
