'use client';
import { Fund } from '~/zenstack/models';
import decimal, { Decimal } from 'decimal.js';
// import { useFormatter } from 'next-intl';

import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowEvent,
  DataTableRowToggleEvent,
  DataTableValueArray,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from 'react';
import { FundUI, GeneralFundUI, IncomeFundUI } from '~/src/types/ui-types/fund';
import { Toast } from 'primereact/toast';
import { FundFindUniqueArgs } from '~/zenstack/input';
import { FundBalance } from '../../../../zenstack/models';
import {
  GeneralFundAggregateArgs,
  IncomeFundCountArgs,
} from '../../../../zenstack/input';
import { fundAddAction } from '~/src/actions/company/fund/masterdata';
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
        };
        _fund.generalFund = _generalFund;

        const _funds = funds;
        _funds.push(_fund);
        setFunds(_funds);
      } else if (
        _fundDB.type === 'RestrictedFund' &&
        _fundDB.restrictedType === 'IncomeFund'
      ) {
        console.log(`Income fund ${JSON.stringify(_fundDB, null, 2)}`);
        const _incomeFund: IncomeFundUI = {
          balance: _fundDB.balance ? _fundDB.balance : Number(0),
          curcyCodeBalance: _fundDB.curcyCodeBalance,
        };
        _fund.incomefund = _incomeFund;
        const _funds = funds;
        _funds.push(_fund);
        setFunds(_funds);
      }
    }
  }, []);

  const formatDate = (value: string | Date | null) => {
    if (value) {
      return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  const dateBodyTemplate = (rowData: Fund) => {
    return formatDate(rowData.reviewDate);
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
    if (rowData.fundType.match(/^(General|Income)$/)) {
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
    // const balance: Decimal = data.generalFund?.balance
    //   ? data.generalFund?.balance
    //   : new Decimal(0);
    if (fund.fundType == 'General') {
      const balance = Number(fund.generalFund?.balance).toLocaleString(
        'en-GB',
        {
          style: 'currency',
          currency: 'GBP',
        },
      );
      return (
        <div className='flex justify-center '>
          <div className='grid grid-cols-3 gap-4'>
            <div className='font-medium'>Balance:</div>
            <div className='font-medium'>{balance}</div>
            <div> </div>
          </div>
        </div>
        // <div className='p-3'>
        //   <div>Balance</div>
        //   <div>{balance.toString()}</div>
        //   {/* <DataTable value={data.orders}>
        //               <Column field="id" header="Id" sortable></Column>
        //               <Column field="customer" header="Customer" sortable></Column>
        //               <Column field="date" header="Date" sortable></Column>
        //               <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
        //               <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
        //               <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
        //           </DataTable> */}
        // </div>
      );
    } else {
      if (fund) {
        const incomeBal = fund.incomefund?.balance
          ? fund.incomefund?.balance
          : 0;
        const balccy = fund.incomefund?.curcyCodeBalance;
        const formatter = new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
        });
        const formatted = formatter.format(incomeBal);
        return (
          <div className='flex justify-center '>
            <div className='grid grid-cols-3 gap-4'>
              <div className='font-medium'>Income Balance:</div>
              <div className='font-medium'>{formatted}</div>
              <div> </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div>
      <DataTable
        value={funds}
        tableStyle={{ minWidth: '50rem' }}
        header={header}
        expandedRows={expandedRows}
        onRowExpand={onRowExpand}
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
