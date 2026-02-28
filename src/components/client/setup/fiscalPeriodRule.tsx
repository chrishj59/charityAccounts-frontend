'use client';

import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast, ToastMessage } from 'primereact/toast';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';

import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import {
  fiscalPeriodRuleSchema,
  FiscPeriodRuleFormValues,
} from '~/src/zodSchema/fisPeriodRule';
import { zodResolver } from '@hookform/resolvers/zod';

interface FiscalYearVarProps {
  fiscRules: FiscalPeriodRule[];
}

import { FiscalPeriodRule } from '~/zenstack/models';
import { truncate } from 'node:fs/promises';
import {
  DB_ERROR,
  fiscPeriodRuleResponse,
  statusEnum,
} from '../../../types/helper';
import {
  fiscalRuleAddAction,
  fiscalRuleUpdateAction,
} from '~/src/actions/setup/fiscalRuleAction';

export default function FiscPeriodRule({ fiscRules }: FiscalYearVarProps) {
  const toast = useRef<Toast | null>(null);
  const emptyFiscRule: FiscalPeriodRule = {
    id: 0,
    name: '',
    monthNum: 0,
    day: 0,
    fiscPeriod: 0,
    yearShift: false,
    calendarBased: false,
  };

  const [fiscRulesList, setFiscRulesList] =
    useState<FiscalPeriodRule[]>(fiscRules);
  const [fiscRule, setFiscRule] = useState<FiscalPeriodRule>(emptyFiscRule);
  const [editFiscRule, setEditFiscRule] =
    useState<FiscalPeriodRule>(emptyFiscRule);
  const [editFiscRuleDialog, setEditFiscRuleDialog] = useState<boolean>(false);
  const [fiscYrAddDialog, setFiscYrAddDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const {
    control,
    trigger,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FiscPeriodRuleFormValues>({
    resolver: zodResolver(fiscalPeriodRuleSchema),
    defaultValues: emptyFiscRule,
  });

  const dt = useRef<DataTable<FiscalPeriodRule[]>>(null);
  console.log(`fiscVar in client ${JSON.stringify(fiscRulesList)}`);
  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
  };
  const addFiscYrVar = (fiscYrVar: FiscalPeriodRule) => {
    const _fiscYrVar: FiscalPeriodRule = emptyFiscRule;

    setFiscRule(_fiscYrVar);
    setFiscYrAddDialog(true);
    reset(fiscYrVar);
  };
  const editFiscRuleAction = (fiscPerRule: FiscalPeriodRule) => {
    // const _fiscPerRule: FiscalPeriodRule = {
    //   id: fiscPerRule.id,
    //   name: fiscPerRule.name,
    //   monthNum: fiscPerRule.monthNum,
    //   day: fiscPerRule.day,
    //   fiscPeriod: fiscPerRule.fiscPeriod,
    //   yearShift: fiscPerRule.yearShift,
    //   calendarBased: fiscPerRule.calendarBased,
    // };

    const _fiscPerRule = fiscPerRule;

    // setFiscRule(_fiscPerRule);
    setEditFiscRule(_fiscPerRule);
    setEditFiscRuleDialog(true);
    reset(fiscPerRule);
  };

  const hideEditFiscRuleDialog = () => {
    setSubmitted(false);
    setEditFiscRuleDialog(false);
  };

  const hideFiscYrVarAddDialog = () => {
    setSubmitted(false);
    setFiscYrAddDialog(false);
  };

  const actionBodyTemplate = (rowData: FiscalPeriodRule) => {
    return (
      <>
        <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='p-button-rounded p-button-success mr-2'
          onClick={() => editFiscRuleAction(rowData)}
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
      />
    </div>
  );

  const saveFiscPeriodUpdate = async () => {
    const _editFiscRule = editFiscRule;

    const result: fiscPeriodRuleResponse =
      await fiscalRuleUpdateAction(_editFiscRule);

    if (result.status === statusEnum.SUCCESS) {
      showToast('success', 'Update success', 'Updated period rule', false);

      const updated = result.data?.fiscalPeriodRule;
      const _fiscalRules = fiscRulesList;
      const updatedIdx = _fiscalRules.findIndex((f) => f.id === updated?.id);
      if (updatedIdx && updated) {
        _fiscalRules[updatedIdx] = updated;
        setFiscRulesList(_fiscalRules);
      }
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Update failed',
        detail: ` Update failed ${result.data?.error?.reason}`,
        life: 400,
      });
    }
    setEditFiscRuleDialog(false);
  };
  const updateDialogFooter = (
    <div className='flex flex-row'>
      <Button
        type='button'
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideEditFiscRuleDialog}
      />
      <Button
        label='Save'
        type='submit'
        icon='pi pi-check'
        className='p-button-text'
        onClick={saveFiscPeriodUpdate}
      />
    </div>
  );
  const onSubmitAdd = async (updated: FiscalPeriodRule) => {
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
    const updatedRule = await fiscalRuleAddAction(updated);

    const _fiscVarList = fiscRulesList;
    _fiscVarList.push(updated);
    setFiscRulesList(_fiscVarList);

    setFiscYrAddDialog(false);
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof FiscalPeriodRule] && (
        <small className='p-error'>
          {errors[name as keyof FiscalPeriodRule]?.message}
        </small>
      )
    );
  };

  const watchedCalendarBased = useWatch({
    control,
    name: 'calendarBased',
  });

  useEffect(() => {
    trigger(['name', 'monthNum', 'day', 'fiscPeriod', 'yearShift']);
  }, [watchedCalendarBased]);

  const yearShiftTemplate = (rowData: FiscalPeriodRule) => {
    if (rowData.yearShift) {
      return <i className='pi pi-check' style={{ color: 'green' }} />;
    } else {
      return <i className='pi pi-times' style={{ color: 'red' }} />;
    }
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || '';
    let _editPeriodRule: FiscalPeriodRule = { ...editFiscRule! };

    // @ts-ignore
    _editPeriodRule[`${name}`] = val;

    setEditFiscRule(_editPeriodRule!);
  };

  const onCalendarBasedChange = (e: InputSwitchChangeEvent) => {
    if (editFiscRule) {
      let _editFiscRule = { ...editFiscRule };
      _editFiscRule.calendarBased = e.value;
      setEditFiscRule(_editFiscRule);
    }
  };

  const onYearShiftChange = (e: InputSwitchChangeEvent) => {
    if (editFiscRule) {
      let _editFiscRule = { ...editFiscRule };
      _editFiscRule.yearShift = e.value;
      setEditFiscRule(_editFiscRule);
    }
  };

  const onNumberChange = (e: InputNumberChangeEvent, name: string) => {
    if (editFiscRule) {
      const val = e.value ? e.value : 0;
      let _editFiscRule = { ...editFiscRule };
      // @ts-ignore
      _editFiscRule[`${name}`] = val;
      // _editFiscRule.monthNum = e.value ? e.value : 0;
      setEditFiscRule(_editFiscRule);
    }
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
          <Button onClick={() => addFiscYrVar(emptyFiscRule)}>
            Add Fiscal Period Rule
          </Button>
        </div>
        <DataTable
          value={fiscRulesList}
          tableStyle={{ minWidth: '50rem' }}
          emptyMessage='No Fiscal Year periods'
        >
          <Column field='id' header='id' />
          <Column field='calendarBased' header='Cal based' />
          <Column field='name' header='Name' />
          <Column field='monthNum' header='Month ' />
          <Column field='day' header='Day of Month' />
          <Column field='fiscPeriod' header='Fiscal Period' />
          <Column
            field='yearShift'
            header='Prior year'
            body={yearShiftTemplate}
          />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '1rem' }}
          />
        </DataTable>
      </Card>

      {/* Add Fiscal rule dialog */}
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
            {/* Calendar Year */}
            <div className='flex flex-row'>
              <div className='mr-2'>
                <label htmlFor='calendarBased'>Previous Calendar year</label>
              </div>
              <div>
                <Controller
                  name='calendarBased'
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
                        disabled={watchedCalendarBased}
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
                        disabled={watchedCalendarBased}
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
                        disabled={watchedCalendarBased}
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
                        disabled={watchedCalendarBased}
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
                        disabled={watchedCalendarBased}
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

      <Dialog
        visible={editFiscRuleDialog}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Edit Fiscal Rule'
        modal
        className='p-fluid'
        footer={updateDialogFooter}
        onHide={hideEditFiscRuleDialog}
        pt={{
          headerTitle: {
            className: 'flex items-center justify-center ',
          },
        }}
      >
        {/* Calendar Year */}
        <div className='field'>
          <label htmlFor='calendarBased' className='font-bold'>
            Calendar Year
          </label>

          <InputSwitch
            id='calendarBased'
            className='ml-4'
            checked={editFiscRule.calendarBased}
            onChange={(e: InputSwitchChangeEvent) => onCalendarBasedChange(e)}
            // className={classNames({
            //   'p-invalid': fieldState.error,
            // })}
          />
        </div>

        {/* Period Name field */}
        <div className='field'>
          <label htmlFor='name' className='font-bold'>
            Period name
          </label>
          <InputText
            pt={{
              root: {
                className: 'ml-5 max-w-30',
              },
            }}
            id='name'
            value={editFiscRule && editFiscRule.name}
            onChange={(e) => onInputChange(e, 'name')}
            size={20}
            required
            // disabled={editFiscRule.calendarBased}
            autoFocus
            className={classNames({
              'p-invalid': submitted && !editFiscRule?.name,
            })}
          />
          {submitted && !editFiscRule?.name && (
            <small className='p-error'>Name is required.</small>
          )}
        </div>

        {/* Month Number */}
        <div className='field'>
          <label htmlFor='monthNum' className='font-bold'>
            Month Number
          </label>
          {/* <span className='p-float-label'> */}
          <InputNumber
            pt={{
              root: {
                className: 'ml-3 max-w-10',
              },
            }}
            id={'monthNum'}
            value={editFiscRule.monthNum}
            min={0}
            max={12}
            disabled={editFiscRule.calendarBased}
            // showButtons
            onChange={(e: InputNumberChangeEvent) =>
              onNumberChange(e, 'monthNum')
            }
            className={classNames({
              'p-invalid': submitted && !editFiscRule?.monthNum,
            })}
          />
          {/* </span> */}
        </div>

        {/* Day of Month Number */}
        <div className='field'>
          <label htmlFor='day' className='font-bold'>
            Day of Month
          </label>
          <InputNumber
            id={'day'}
            pt={{
              root: {
                className: 'ml-5 max-w-10',
              },
            }}
            value={editFiscRule.day}
            min={0}
            max={12}
            disabled={editFiscRule.calendarBased}
            // showButtons
            onChange={(e: InputNumberChangeEvent) => onNumberChange(e, 'day')}
            className={classNames({
              'p-invalid': submitted && !editFiscRule?.day,
            })}
          />
        </div>

        {/* Fiscal Period */}
        <div className='field'>
          {/* <span className='p-float-label font-bold'> */}
          <label htmlFor='fiscPeriod' className='font-bold'>
            Fiscal Period
          </label>
          <InputNumber
            id={'fiscPeriod'}
            pt={{
              root: {
                className: 'ml-5 max-w-10',
              },
            }}
            value={editFiscRule.fiscPeriod}
            min={0}
            max={12}
            disabled={editFiscRule.calendarBased}
            onChange={(e: InputNumberChangeEvent) =>
              onNumberChange(e, 'fiscPeriod')
            }
            className={classNames({
              'p-invalid': submitted && !editFiscRule?.fiscPeriod,
            })}
          />

          {/* </span> */}
        </div>

        {/* Calendar Year */}
        <div className='field'>
          <label htmlFor='yearShift' className='font-bold'>
            Prior cal year
          </label>

          <InputSwitch
            id='yearShift'
            className='ml-4'
            checked={editFiscRule.yearShift}
            disabled={editFiscRule.calendarBased}
            onChange={(e: InputSwitchChangeEvent) => onYearShiftChange(e)}
          />
        </div>
      </Dialog>
    </>
  );
}
