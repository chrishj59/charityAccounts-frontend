'use client';
import { Fund } from '~/zenstack/models';
import decimal, { Decimal } from 'decimal.js';

import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowEvent,
  DataTableRowToggleEvent,
  DataTableValueArray,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from 'react';
import {
  DesignatedFundUI,
  EndownmentExpendableUI,
  FundUI,
  GeneralFundUI,
  IncomeFundUI,
  RestrictedFundUI,
} from '~/src/types/ui-types/fund';
import { Toast } from 'primereact/toast';

import {
  getGbpFormatter,
  getNumberFormatter,
} from '~/src/lib/Intl/numberFormatter';
import { getShortDateFormatter } from '~/src/lib/Intl/dateFormatter';
import {
  IncomeFund,
  EndownmentExpendable,
  EndownmentPermanent,
} from '../../../../zenstack/models';
import { EndownmentPermanentUI } from '../../../types/ui-types/fund';

interface FundListProps {
  fundList: Fund[];
}
export default function ListFundsUI({ fundList }: FundListProps) {
  console.log(`fundList ${JSON.stringify(fundList, null, 2)}`);
  const toast = useRef<Toast>(null);
  const [funds, setFunds] = useState<FundUI[]>([]);
  const [generalFunds, setGeneralFunds] = useState<GeneralFundUI[]>([]);
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | GeneralFundUI[]
  >([]);

  // const formatter = new Intl.NumberFormat('en-GB', {
  //   style: 'currency',
  //   currency: 'GBP',
  // });

  const gbpFormatter = getGbpFormatter();
  const shortDateFormatter = getShortDateFormatter();

  useEffect(() => {
    for (let i = 0; i < fundList.length; i++) {
      const _fundDB = fundList[i];
      console.log(`fund type ${JSON.stringify(_fundDB.fundType)}`);
      const _fund: FundUI = {
        id: _fundDB.id,
        fundName: _fundDB.fundName,
        donarName: _fundDB.donarName ? _fundDB.donarName : '',
        objective: _fundDB.objective ? _fundDB.objective : '',
        fundType: _fundDB.fundType,
        reviewDate: _fundDB.reviewDate ? _fundDB.reviewDate : new Date(),
      };
      if (_fundDB.type === 'GeneralFund') {
        const _generalFund: GeneralFundUI = {
          balance: _fundDB.balance ? _fundDB.balance : Number(0),
          curcyCode: _fundDB.curcyCode,
        };
        _fund.generalFund = _generalFund;

        const _funds = funds;
        _funds.push(_fund);
        setFunds(_funds);
      } else if (
        _fundDB.type === 'RestrictedFund' &&
        _fundDB.restrictedType === 'DesignatedFund'
      ) {
        console.log(`Designated fund ${JSON.stringify(_fundDB, null, 2)}`);

        const _restrictedFund: RestrictedFundUI = {
          nextDonarReviewDate: _fundDB.nextDonarReviewDate
            ? _fundDB.nextDonarReviewDate
            : new Date(),
        };
        _fund.restrictedFund = _restrictedFund;
        const _designatedFund: DesignatedFundUI = {
          designateMeeting: _fundDB.designatedMeeting,
          designatedBal: _fundDB.designatedBal,
          curcyCode: _fundDB.curcyCode,
          currentBal: _fundDB.currentBal,
          designatedDate: _fundDB.designatedDate,
          releasedDate: _fundDB.releasedDate,
          designatedMeeting: _fundDB.designatedMeeting,
          undesignateMeeting: _fundDB.undesignateMeeting
            ? _fundDB.undesignateMeeting
            : '',
        };

        _fund.restrictedFund.designatedFund = _designatedFund;
        const _funds = funds;
        _funds.push(_fund);
        setFunds(_funds);
      } else if (
        _fundDB.type === 'RestrictedFund' &&
        _fundDB.restrictedType === 'IncomeFund'
      ) {
        const _restrictedFund: RestrictedFundUI = {
          projectEndDate: _fundDB.projectEndDate,
          nextDonarReviewDate: _fundDB.nextDonarReviewDate
            ? _fundDB.nextDonarReviewDate
            : new Date(),
          returnSurplus: _fundDB.returnSurplus ? _fundDB.returnSurplus : false,
        };

        _fund.restrictedFund = _restrictedFund;
        console.log(`Income fund ${JSON.stringify(_fundDB, null, 2)}`);
        const _incomeFund: IncomeFundUI = {
          balance: _fundDB.balance ? _fundDB.balance : Number(0),
          curcyCodeBalance: _fundDB.curcyCode,
        };
        _fund.restrictedFund.incomeFund = _incomeFund;
        const _funds = funds;
        _funds.push(_fund);
        setFunds(_funds);
      } else if (
        _fundDB.type === 'RestrictedFund' &&
        _fundDB.restrictedType === 'EndownmentExpendable'
      ) {
        const _restrictedFund: RestrictedFundUI = {
          projectEndDate: _fundDB.projectEndDate,
          nextDonarReviewDate: _fundDB.nextDonarReviewDate
            ? _fundDB.nextDonarReviewDate
            : new Date(),
          returnSurplus: _fundDB.returnSurplus ? _fundDB.returnSurplus : false,
        };

        _fund.restrictedFund = _restrictedFund;

        const _endownmentExpendable: EndownmentExpendableUI = {
          initalCapital: _fundDB.initalCapital,
          incomeEarned: _fundDB.incomeEarned,
          incomeBalance: _fundDB.incomeBalance,
          capitalBalance: _fundDB.capitalBalance,
          curcyCode: _fundDB.curcyCode,
        };
        _fund.restrictedFund.endownmentExpendable = _endownmentExpendable;
        const _funds = funds;
        _funds.push(_fund);
        setFunds(_funds);
      } else if (
        _fundDB.type === 'RestrictedFund' &&
        _fundDB.restrictedType === 'EndownmentPermanent'
      ) {
        const _restrictedFund: RestrictedFundUI = {
          projectEndDate: _fundDB.projectEndDate,
          nextDonarReviewDate: _fundDB.nextDonarReviewDate
            ? _fundDB.nextDonarReviewDate
            : new Date(),
          returnSurplus: _fundDB.returnSurplus ? _fundDB.returnSurplus : false,
        };

        _fund.restrictedFund = _restrictedFund;

        const endownmentPermanent: EndownmentPermanentUI = {
          initalCapital: _fundDB.initalCapital,
          incomeEarned: _fundDB.incomeEarned,
          incomeBalance: _fundDB.incomeBalance,
          capitalBalance: _fundDB.capitalBalance,
          curcyCode: _fundDB.curcyCode,
        };
        _fund.restrictedFund.endownmentPermanent = endownmentPermanent;
        const _funds = funds;
        _funds.push(_fund);
        setFunds(_funds);
      }
    }
  }, []);

  const dateBodyTemplate = (rowData: Fund) => {
    // const shortDateFormatter = getShortDateFormatter();
    const rowDate = rowData.reviewDate ? rowData.reviewDate : new Date();
    return shortDateFormatter.format(rowDate); //formatDate(rowData.reviewDate);
  };
  const renderHeader = () => {
    return (
      <div className='flex flex-wrap gap-2  align-items-center'>
        <h4 className='m-0'>Funds</h4>
      </div>
    );
  };
  const header = renderHeader();
  const allowExpansion = (rowData: FundUI): boolean => {
    if (
      rowData.fundType.match(
        /^(General|Income|Designated|Expendable|Permanent)$/,
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onRowToggle = (e: DataTableRowToggleEvent) => {
    setExpandedRows(e.data);
  };
  const onRowExpand = (event: DataTableRowEvent) => {
    toast.current?.show({
      severity: 'info',
      summary: 'Expanded',
      detail: event.data.name,
      life: 3000,
    });
  };

  const rowExpansionTemplate = (fund: FundUI) => {
    if (fund.fundType == 'General') {
      const balance = gbpFormatter.format(
        fund.generalFund?.balance ? fund.generalFund.balance : 0,
      );

      return (
        <div className='flex justify-center '>
          <div className='grid grid-cols-3 gap-4'>
            <div className='font-medium'>Balance:</div>
            <div className='font-medium'>{balance}</div>
            <div> </div>
          </div>
        </div>
      );
    } else if (fund.fundType == 'Designated') {
      const reviewon = shortDateFormatter.format(
        fund.restrictedFund?.nextDonarReviewDate,
      );
      const designatedOn = shortDateFormatter.format(
        fund.restrictedFund?.designatedFund?.designatedDate,
      );

      const balance = gbpFormatter.format(
        fund.restrictedFund?.designatedFund?.currentBal
          ? fund.restrictedFund?.designatedFund?.currentBal
          : 0,
      );

      return (
        <div className='flex justify-center '>
          <div className='fex flex-row'>
            <div className='grid grid-cols-6 gap-4'>
              <div className='font-medium'>Donar review on:</div>
              <div className='font-medium'>{reviewon}</div>
              <div> </div>
              <div className='font-medium'>Designated on:</div>
              <div className='font-medium'>{designatedOn}</div>
              <div> </div>
              <div className='font-medium'>Designated meeting:</div>
              <div className='font-medium'>
                {fund.restrictedFund?.designatedFund?.designateMeeting}
              </div>
            </div>
            <div className='mt-4 flex justify-center'>
              <div className='grid grid-cols-3 gap-4'>
                <div className='font-medium'>Balance:</div>
                <div className='font-medium'>{balance}</div>
                <div> </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (fund.fundType == 'Income') {
      const endsOn = shortDateFormatter.format(
        fund.restrictedFund?.projectEndDate,
      );

      const reviewOn = shortDateFormatter.format(
        fund.restrictedFund?.nextDonarReviewDate,
      );

      const balance = gbpFormatter.format(
        fund.restrictedFund?.incomeFund?.balance
          ? fund.restrictedFund?.incomeFund?.balance
          : 0,
      );

      return (
        <div className='flex justify-center'>
          <div className='fex flex-row'>
            <div className='grid-rows-[100px_1fr] gap-4'>
              <div className='grid-rows-subgrid row-span-1 gap-2'>
                <div className='grid grid-cols-6 gap-4'>
                  <div className='font-medium'>Project end date</div>
                  <div className='font-medium'>{endsOn}</div>
                  <div className='font-medium'>Donar Review date</div>
                  <div className='font-medium'>{reviewOn}</div>
                  <div className='font-medium'>Return Surplus</div>
                  <div className='font-medium'>
                    <i
                      className={`pi ${fund.restrictedFund?.returnSurplus ? 'pi-check text-green-500' : 'pi-times text-red-500'}`}
                    />
                  </div>
                </div>
              </div>
              <div className='flex justify-center mt-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='font-medium'>Balance</div>
                  <div className='font-medium'>{balance}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (fund.fundType == 'Expendable') {
      /**. Endownment Expendable  block */

      const endsOn = shortDateFormatter.format(
        fund.restrictedFund?.projectEndDate,
      );

      const reviewOn = shortDateFormatter.format(
        fund.restrictedFund?.nextDonarReviewDate,
      );

      const _initCap = fund.restrictedFund?.endownmentExpendable?.initalCapital
        ? fund.restrictedFund?.endownmentExpendable?.initalCapital
        : 0;
      const _initCapitalGbp = gbpFormatter.format(_initCap);

      const _income = fund.restrictedFund?.endownmentExpendable?.incomeEarned
        ? fund.restrictedFund?.endownmentExpendable?.incomeEarned
        : 0;
      const _incomeGbp = gbpFormatter.format(_income);

      const _incomeBal = fund.restrictedFund?.endownmentExpendable
        ?.incomeBalance
        ? fund.restrictedFund?.endownmentExpendable?.incomeBalance
        : 0;
      const _incomeBalGbp = gbpFormatter.format(_incomeBal);

      const _capitalBal = fund.restrictedFund?.endownmentExpendable
        ?.capitalBalance
        ? fund.restrictedFund?.endownmentExpendable?.capitalBalance
        : 0;
      const _capitalBalGbp = gbpFormatter.format(_capitalBal);

      return (
        <div className='flex justify-center'>
          <div className='fex flex-row'>
            <div className='grid-template-rows: repeat(2, minmax(0, 1fr)); gap-4'>
              <div className='grid-rows-subgrid row-span-1 gap-2'>
                <div className='grid grid-cols-6 gap-4'>
                  <div className='font-medium'>Project end date</div>
                  <div className='font-medium'>{endsOn}</div>
                  <div className='font-medium'>Donar Review date</div>
                  <div className='font-medium'>{reviewOn}</div>
                  <div className='font-medium'>Return Surplus</div>
                  <div className='font-medium'>
                    <i
                      className={`pi ${fund.restrictedFund?.returnSurplus ? 'pi-check text-green-500' : 'pi-times text-red-500'}`}
                    />
                  </div>
                </div>
              </div>
              <div className='flex justify-center mt-4'>
                <div className='grid-rows-subgrid row-span-1 gap-2'>
                  <div className='grid grid-cols-8 gap-4'>
                    <div className='font-medium'>Inital Capital</div>
                    <div className='font-medium'>{_initCapitalGbp}</div>
                    <div className='font-medium'>Income earned</div>
                    <div className='font-medium'>{_incomeGbp}</div>
                    <div className='font-medium'>Capital Balance</div>
                    <div className='font-medium'>{_capitalBalGbp}</div>
                    <div className='font-medium'>Income Balance</div>
                    <div className='font-medium'>{_incomeBalGbp}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (fund.fundType == 'Permanent') {
      /**. Endownment Permanent  block */
      const endsOn = shortDateFormatter.format(
        fund.restrictedFund?.projectEndDate,
      );

      const reviewOn = shortDateFormatter.format(
        fund.restrictedFund?.nextDonarReviewDate,
      );

      const _initCap = fund.restrictedFund?.endownmentPermanent?.initalCapital
        ? fund.restrictedFund?.endownmentPermanent?.initalCapital
        : 0;
      const _initCapitalGbp = gbpFormatter.format(_initCap);

      const _income = fund.restrictedFund?.endownmentPermanent?.incomeEarned
        ? fund.restrictedFund?.endownmentPermanent?.incomeEarned
        : 0;
      const _incomeGbp = gbpFormatter.format(_income);

      const _incomeBal = fund.restrictedFund?.endownmentPermanent?.incomeBalance
        ? fund.restrictedFund?.endownmentPermanent?.incomeBalance
        : 0;
      const _incomeBalGbp = gbpFormatter.format(_incomeBal);

      const _capitalBal = fund.restrictedFund?.endownmentExpendable
        ?.capitalBalance
        ? fund.restrictedFund?.endownmentExpendable?.capitalBalance
        : 0;
      const _capitalBalGbp = gbpFormatter.format(_capitalBal);

      return (
        <div className='flex justify-center'>
          <div className='fex flex-row'>
            <div className='grid-template-rows: repeat(2, minmax(0, 1fr)); gap-4'>
              <div className='grid-rows-subgrid row-span-1 gap-2'>
                <div className='grid grid-cols-6 gap-4'>
                  <div className='font-medium'>Project end date</div>
                  <div className='font-medium'>{endsOn}</div>
                  <div className='font-medium'>Donar Review date</div>
                  <div className='font-medium'>{reviewOn}</div>
                  <div className='font-medium'>Return Surplus</div>
                  <div className='font-medium'>
                    <i
                      className={`pi ${fund.restrictedFund?.returnSurplus ? 'pi-check text-green-500' : 'pi-times text-red-500'}`}
                    />
                  </div>
                </div>
              </div>
              <div className='flex justify-center mt-4'>
                <div className='grid-rows-subgrid row-span-1 gap-2'>
                  <div className='grid grid-cols-8 gap-4'>
                    <div className='font-medium'>Inital Capital</div>
                    <div className='font-medium'>{_initCapitalGbp}</div>
                    <div className='font-medium'>Income earned</div>
                    <div className='font-medium'>{_incomeGbp}</div>
                    <div className='font-medium'>Capital Balance</div>
                    <div className='font-medium'>{_capitalBalGbp}</div>
                    <div className='font-medium'>Income Balance</div>
                    <div className='font-medium'>{_incomeBalGbp}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // else {
    //   if (fund) {
    //     const incomeBal = fund.restrictedFund?.incomefund?.balance
    //       ? fund.restrictedFund.incomefund?.balance
    //       : 0;
    //     const balccy = fund.restrictedFund?.incomefund?.curcyCodeBalance;

    //     const formatted = formatter.format(incomeBal);
    //     return (
    //       <div className='flex justify-center '>
    //         <div className='grid grid-cols-3 gap-4'>
    //           <div className='font-medium'>Income Balance:</div>
    //           <div className='font-medium'>{formatted}</div>
    //           <div> </div>
    //         </div>
    //       </div>
    //     );
    //   }
    // }
  };

  return (
    <div>
      <DataTable
        value={funds}
        tableStyle={{ minWidth: '50rem' }}
        header={header}
        expandedRows={expandedRows}
        onRowExpand={onRowExpand}
        emptyMessage={'No funds found'}
        onRowToggle={(e: DataTableRowToggleEvent) => onRowToggle(e)}
        pt={{
          header: {
            className: 'flex justify-content-center align-items-center',
          },
        }}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey='id'
      >
        <Column expander={allowExpansion} style={{ width: '5rem' }} />
        <Column field='fundName' header='Fund'></Column>
        <Column field='donarName' header='Donar'></Column>
        <Column field='objective' header='Fund Objective'></Column>
        <Column
          field='reviewDate'
          header='Review On'
          body={dateBodyTemplate}
          dataType='date'
        ></Column>
        <Column field='fundType' header='Category'></Column>
      </DataTable>
    </div>
  );
}
