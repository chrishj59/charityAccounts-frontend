'use client';

import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast, ToastMessage } from 'primereact/toast';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import {
  FiscalPeriodRuleHeaderFormValues,
  fiscalPeriodRuleHeaderSchema,
  fiscalPeriodRuleSchema,
  FiscPeriodRuleFormValues,
} from '~/src/zodSchema/fisPeriodRule';
import { zodResolver } from '@hookform/resolvers/zod';

interface FiscalYearVarProps {
  fiscRules: FiscalPeriodRuleHeader[];
  orgId: string;
  userId: string;
}

import { FiscalPeriodRule, FiscalPeriodRuleHeader } from '~/zenstack/models';
import { truncate } from 'node:fs/promises';

import { nullToUndefined } from '~/src/utils/helperClient';

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

export default function FiscPeriodRuleUI({
  fiscRules,
  orgId,
  userId,
}: FiscalYearVarProps) {
  const client = useClientQueries(schema);

  const createPeriodRule = client.fiscalPeriodRule.useCreate({
    optimisticUpdate: true,
  });

  const createPeriodRuleHeader = client.fiscalPeriodRuleHeader.useCreate({
    optimisticUpdate: true,
  });

  const updatePeriodRule = client.fiscalPeriodRule.useUpdate();

  const toast = useRef<Toast | null>(null);

  const emptyRuleHeader = {
    id: 0,
    title: '',
    calendarBased: false,
    createdAt: new Date(),
    createdById: userId,
    updatedAt: new Date(),
    updatedById: userId,
    organizationId: orgId,
    deletedAt: null,
  };

  const emptyFiscRule = {
    id: 0,

    periodName: '',
    periodNum: 0,
    day: 0,
    fiscPeriod: 0,
    yearShift: false,

    organizationId: '',
    createdAt: new Date(),
    createdById: userId,
    updatedAt: new Date(),
    updatedById: userId,
    deletedAt: null,
    headerId: 0,
  };

  const [ruleSelected, setRuleSelected] = useState<boolean>(false);

  const [selectedRuleHeaderId, setSelectedRuleHeaderId] = useState<
    number | null
  >(null);

  const loadPeriodRule = client.fiscalPeriodRuleHeader.useFindUnique(
    {
      where: { id: selectedRuleHeaderId ?? 0 },
      include: {
        rulePeriods: { orderBy: { periodName: 'asc' } },
      },
    },
    {
      enabled: selectedRuleHeaderId !== null,
    },
  );
  const [fiscRulesList, setFiscRulesList] =
    useState<FiscalPeriodRuleHeader[]>(fiscRules);
  const [fiscRuleHeader, setFiscRuleHeader] =
    useState<FiscalPeriodRuleHeaderFormValues>(emptyRuleHeader);

  const [fiscRulePeriodList, setFiscRulePeriodList] = useState<
    FiscalPeriodRule[]
  >([]);
  const [editFiscRule, setEditFiscRule] =
    useState<FiscalPeriodRuleHeader>(emptyRuleHeader);
  const [editFiscRulePeriod, setEditFiscRulePeriod] =
    useState<FiscalPeriodRule>(emptyFiscRule);
  const [editFiscRuleDialog, setEditFiscRuleDialog] = useState<boolean>(false);
  const [periodRuleAddDialog, setPeriodRuleAddDialog] =
    useState<boolean>(false);
  const [addFiscRuleDialog, setAddfiscRuleDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { mutate: createRule } = client.fiscalPeriodRule.useCreate();
  const { mutate: updateRule } = client.fiscalPeriodRule.useUpdate();

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

  const {
    control: controlEditPeriod,
    setValues: setValuesEditPeriod,
    trigger: triggerEditPeriod,
    formState: { errors: errorsEditPeriod },
    handleSubmit: handleSubmitEditPeriod,
    reset: resetEditPeriod,
  } = useForm<FiscPeriodRuleFormValues>({
    resolver: zodResolver(fiscalPeriodRuleSchema),
    defaultValues: editFiscRulePeriod,
  });

  const {
    control: controlHeader,
    trigger: triggerHeader,
    formState: { errors: errorsHeader },
    handleSubmit: handleSubmitHeader,
    reset: resetHeader,
  } = useForm<FiscalPeriodRuleHeaderFormValues>({
    resolver: zodResolver(fiscalPeriodRuleHeaderSchema),
    defaultValues: emptyRuleHeader,
  });

  const dt = useRef<DataTable<FiscalPeriodRule[]>>(null);

  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
  };
  const showAddRuleDlg = (show: boolean) => {
    setPeriodRuleAddDialog(show);
  };

  const editFiscRuleAction = (fiscPerRule: FiscalPeriodRule) => {
    setEditFiscRulePeriod(fiscPerRule);
    const editValues = {
      periodName: fiscPerRule.periodName,
      periodNum: fiscPerRule.periodNum,
      day: fiscPerRule.day,
      fiscPeriod: fiscPerRule.fiscPeriod,
      yearShift: fiscPerRule.yearShift,
    };
    setValuesEditPeriod(editValues);

    setEditFiscRuleDialog(true);

    resetEditPeriod(nullToUndefined(fiscPerRule));
  };

  const hideEditFiscRuleDialog = () => {
    setSubmitted(false);
    setEditFiscRuleDialog(false);
  };

  const hidePeriodRuleAddDialog = () => {
    setSubmitted(false);
    setPeriodRuleAddDialog(false);
  };

  const hideAddFiscRuleDialog = () => {
    setSubmitted(false);
    setAddfiscRuleDialog(false);
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

  const addRuleDialogFooter = (
    <div className='flex flex-row'>
      <Button
        type='button'
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideAddFiscRuleDialog}
      />
      <Button
        label='Okay'
        type='submit'
        icon='pi pi-check'
        className='p-button-text'
      />
    </div>
  );

  const addDialogFooter = (
    <div className='flex flex-row'>
      <Button
        type='button'
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hidePeriodRuleAddDialog}
      />
      <Button
        label='Save'
        type='submit'
        icon='pi pi-check'
        className='p-button-text'
      />
    </div>
  );

  const saveFiscPeriodUpdate = () => {
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

  const onSubmitRuleHeader = async (data: FiscalPeriodRuleHeaderFormValues) => {
    const ruleValues = {
      title: data.title,

      calendarBased: data.calendarBased,
      createdAt: new Date(),
      createdById: userId,
      organizationId: orgId,
    };

    // calendar based so only need the rule header

    try {
      const createdPeriodRuleHeader = await createPeriodRuleHeader.mutateAsync({
        data: ruleValues,
      });

      setSelectedRuleHeaderId(createdPeriodRuleHeader.id);
      setFiscRulesList((prev) => [...prev, createdPeriodRuleHeader]);
      setFiscRuleHeader(createdPeriodRuleHeader);
    } catch (err) {
      showToast(
        'error',
        'Could not create rule',
        'Failed to create period rule. Please check your entry',
        false,
      );
    } finally {
      setAddfiscRuleDialog(false);
    }
  };

  const onSubmitPeriodEditUpdate = async (data: FiscPeriodRuleFormValues) => {
    try {
      if (!selectedRuleHeaderId) {
        showToast(
          'error',
          'No Fiscal rule selected',
          'Fiscal Rule not found. Please check your entry',
          false,
        );
        return;
      }
      const updatedPeriodRule = await updatePeriodRule.mutateAsync({
        where: { id: data.id },
        data: {
          periodName: data.periodName,
          yearShift: data.yearShift ?? false,
          periodNum: data.periodNum,
          day: data.day,
          fiscPeriod: data.fiscPeriod,
          header: {
            connect: { id: selectedRuleHeaderId },
          },

          organization: {
            connect: { id: orgId },
          },
          createdBy: {
            connect: { id: userId },
          },
        },
      });

      showToast(
        'info',
        'created period rule',
        'Successfully created period rule',
        false,
      );
    } catch (error) {
      showToast(
        'error',
        'Error could find Period rule',
        'Period rule not selected',
        false,
      );

      console.error(error);
    }
  };

  const onSubmitPeriodAdd = async (data: FiscPeriodRuleFormValues) => {
    try {
      if (!selectedRuleHeaderId) {
        showToast(
          'error',
          'No Fiscal rule selected',
          'Fiscal Rule not found. Please check your entry',
          false,
        );
        return;
      }
      const createdPeriodRule = await createPeriodRule.mutateAsync({
        data: {
          periodName: data.periodName,
          yearShift: data.yearShift ?? false,
          periodNum: data.periodNum,
          day: data.day,
          fiscPeriod: data.fiscPeriod,
          header: {
            connect: { id: selectedRuleHeaderId },
          },

          organization: {
            connect: { id: orgId },
          },
          createdBy: {
            connect: { id: userId },
          },
        },
      });

      const _fiscVarList = fiscRulesList;
      _fiscVarList.push(createdPeriodRule);
      setFiscRulesList((prev) => [...prev, createdPeriodRule]);
      setFiscRulesList(_fiscVarList);
      setPeriodRuleAddDialog(false);
    } catch (error) {
      showToast(
        'error',
        'Error saving period',
        'Could not save period for rule',
        false,
      );
      console.error(error);
    }
  };
  const getRuleHeaderErrorMessage = (name: string) => {
    return (
      errorsHeader[name as keyof FiscalPeriodRuleHeaderFormValues] && (
        <small className='p-error'>
          {
            errorsHeader[name as keyof FiscalPeriodRuleHeaderFormValues]
              ?.message
          }
        </small>
      )
    );
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof FiscPeriodRuleFormValues] && (
        <small className='p-error'>
          {errors[name as keyof FiscPeriodRuleFormValues]?.message}
        </small>
      )
    );
  };

  const yearShiftTemplate = (rowData: FiscalPeriodRule) => {
    if (rowData.yearShift) {
      return <i className='pi pi-check' style={{ color: 'green' }} />;
    } else {
      return <i className='pi pi-times' style={{ color: 'red' }} />;
    }
  };
  useEffect(() => {
    if (loadPeriodRule.data) {
      const rulePeriods = loadPeriodRule.data.rulePeriods;
      setFiscRulePeriodList(rulePeriods);
    }
  }, [loadPeriodRule.data]);

  const handleFiscalRuleHeaderChange = async (e: DropdownChangeEvent) => {
    const _selectedId: number = e.value;
    setSelectedRuleHeaderId(_selectedId);
    setRuleSelected(true);

    const _selectedRuleHeader = fiscRulesList.find(
      (rule) => rule.id === _selectedId,
    );

    if (_selectedRuleHeader) {
      setFiscRuleHeader(_selectedRuleHeader);
    }
  };

  const onNumberChange = (e: InputNumberChangeEvent, name: string) => {
    if (editFiscRule) {
      const val = e.value ? e.value : 0;
      let _editFiscRule = { ...editFiscRule };
      // @ts-ignore
      _editFiscRule[`${name}`] = val;

      setEditFiscRule(_editFiscRule);
    }
  };
  const selectedFiscalPeriodHeaderStatusTemplate = (
    option: FiscalPeriodRuleHeader,
    props: any,
  ) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.title}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const fiscalRuleHeaderOptionTemplate = (option: FiscalPeriodRuleHeader) => {
    return (
      <div className='flex align-items-center'>
        {/* <div className='mr-2'>Fiscal Rule:</div> */}
        <div>{option.title}</div>
      </div>
    );
  };

  return (
    <>
      <Card
        title={
          <div className='flex justify-content-center align-items-center'>
            Fiscal Period Rule
          </div>
        }
      >
        <div className='flex flex-row'>
          <div>
            <span className='p-float-label'>
              <Dropdown
                className='w-full'
                id='FiscalPeriodRuleHeader'
                value={selectedRuleHeaderId}
                options={fiscRulesList}
                optionLabel='title'
                optionValue='id'
                placeholder='Fiscal Periods'
                onChange={handleFiscalRuleHeaderChange}
                valueTemplate={selectedFiscalPeriodHeaderStatusTemplate}
                itemTemplate={fiscalRuleHeaderOptionTemplate}
              />
              <label htmlFor='FiscalPeriodRuleHeader'>
                Select a Period Rule
              </label>
            </span>
          </div>

          <div className='ml-2'>
            <Button onClick={() => setAddfiscRuleDialog(true)}>Add rule</Button>
          </div>
          <div className='ml-2'>
            <span className='font-semibold'>Title:</span> {fiscRuleHeader.title}
          </div>
          <div className='ml-2'>
            <span className='font-semibold'>Calendar based:</span>{' '}
            <i
              className={
                fiscRuleHeader.calendarBased
                  ? 'pi pi-check ! text-green-500'
                  : 'pi pi-times ! text-red-500'
              }
            />
          </div>
        </div>
        <div className='flex flex-wrap justify-content-end'>
          <Button
            disabled={fiscRuleHeader.calendarBased}
            onClick={() => showAddRuleDlg(true)}
          >
            Add Periods
          </Button>
        </div>
        <DataTable
          value={fiscRulePeriodList}
          tableStyle={{ minWidth: '50rem' }}
          emptyMessage='No Fiscal Year periods for selected rule'
        >
          <Column field='periodName' header='Period Name' sortable />

          <Column field='periodNum' header='Month Number' sortable />
          <Column field='day' header='Day of Month' sortable />
          <Column field='fiscPeriod' header='Fiscal Period' sortable />
          <Column
            field='yearShift'
            header='Prior year'
            sortable
            body={yearShiftTemplate}
          />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '1rem' }}
          />
        </DataTable>
      </Card>

      {/* add Fiscal rule */}
      <Dialog
        visible={addFiscRuleDialog}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Add Fiscal Year Periods'
        modal
        className='p-fluid'
        onHide={hideAddFiscRuleDialog}
      >
        <form
          onSubmit={handleSubmitHeader(onSubmitRuleHeader)}
          className='p-fluid'
        >
          <Card footer={addRuleDialogFooter}>
            {/* Title field */}
            <div className='field'>
              <Controller
                name='title'
                control={controlHeader}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errorsHeader.title,
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
                    {getRuleHeaderErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Calendar Year */}
            <div className='flex flex-row'>
              <div className='mr-2'>
                <label htmlFor='calendarBased'>Calendar Based</label>
              </div>
              <div>
                <Controller
                  name='calendarBased'
                  control={controlHeader}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errorsHeader.calendarBased,
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
                      {getRuleHeaderErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>
            </div>
          </Card>
        </form>
      </Dialog>

      {/* Add Period dialog */}
      <Dialog
        visible={periodRuleAddDialog}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Add Fiscal rule Periods'
        modal
        className='p-fluid'
        onHide={hidePeriodRuleAddDialog}
      >
        <form onSubmit={handleSubmit(onSubmitPeriodAdd)} className='p-fluid'>
          <Card footer={addDialogFooter}>
            {/* Fiscal rule header */}

            <span className='p-float-label'>
              <InputText value={fiscRuleHeader.title} disabled />

              <label htmlFor='FiscalPeriodRuleHeader'>Fiscal Rule</label>
            </span>

            {/* Month Name field  */}

            <div className='field'>
              <Controller
                name='periodName'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.periodName,
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
                      <label htmlFor={field.name}>Period Name</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Month number field */}
            <div className='field'>
              <Controller
                name='periodNum'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.periodNum,
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
                        checked={field.value ?? false}
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

      {/* Edit period dialog */}
      <Dialog
        visible={editFiscRuleDialog}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Edit Fiscal Rule'
        modal
        className='p-fluid'
        onHide={hideEditFiscRuleDialog}
        pt={{
          headerTitle: {
            className: 'flex items-center justify-center ',
          },
        }}
      >
        <form
          onSubmit={handleSubmitEditPeriod(onSubmitPeriodEditUpdate)}
          className='p-fluid'
        >
          <Card footer={updateDialogFooter}>
            {/* Period Name field */}
            <div className='field'>
              <Controller
                name='periodName'
                control={controlEditPeriod}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.periodName,
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
                      <label htmlFor={field.name}>Period Name</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Month number field */}
            <div className='field'>
              <Controller
                name='periodNum'
                control={controlEditPeriod}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.periodNum,
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
                control={controlEditPeriod}
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
                control={controlEditPeriod}
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
                  control={controlEditPeriod}
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
                        checked={field.value ?? false}
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
