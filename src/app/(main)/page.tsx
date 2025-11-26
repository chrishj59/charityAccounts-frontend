'use client';

import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
import { useRouter } from 'next/navigation';
import type { MouseEventHandler } from 'react';
import { Ripple } from 'primereact/ripple';
import { Badge } from 'primereact/badge';
import Link from 'next/link';
import { Dialog } from 'primereact/dialog';

export default function IntroPage() {
  const router = useRouter();
  const [payablesDialog, setPayablesDialog] = useState<boolean>(false);
  const [receivablesDialog, setReceivablesDialog] = useState<boolean>(false);
  const [grantsDialog, setGrantsDialog] = useState<boolean>(false);
  const [vatDialog, setVatDialog] = useState<boolean>(false);
  const [otherDialog, setOtherDialog] = useState<boolean>(false);
  const [accountsDialog, setAccountsDialog] = useState<boolean>(false);

  const onPayablesClick = () => {
    setPayablesDialog(!payablesDialog);
  };

  const onReceivablesClick = () => {
    setReceivablesDialog(!receivablesDialog);
  };

  const onGrantsClick = () => {
    setGrantsDialog(!grantsDialog);
  };

  const onVatClick = () => {
    setVatDialog(!vatDialog);
  };

  const onOtherClick = () => {
    setOtherDialog(!otherDialog);
  };

  const onAccountsClick = () => {
    setAccountsDialog(!accountsDialog);
  };

  const payablesDialogFooter = (
    <div className='flex flex-wrap flex-row justify-content-center'>
      <Button
        label='Close'
        icon='pi pi-times'
        outlined
        onClick={onPayablesClick}
      />
    </div>
  );

  const receivablesDialogFooter = (
    <div className='flex flex-wrap flex-row justify-content-center'>
      <Button
        label='Close'
        icon='pi pi-times'
        outlined
        onClick={onReceivablesClick}
      />
    </div>
  );

  const grantsDialogFooter = (
    <div className='flex flex-wrap flex-row justify-content-center'>
      <Button
        label='Close'
        icon='pi pi-times'
        outlined
        onClick={onGrantsClick}
      />
    </div>
  );

  const vatDialogFooter = (
    <div className='flex flex-wrap flex-row justify-content-center'>
      <Button label='Close' icon='pi pi-times' outlined onClick={onVatClick} />
    </div>
  );

  const otherDialogFooter = (
    <div className='flex flex-wrap flex-row justify-content-center'>
      <Button
        label='Close'
        icon='pi pi-times'
        outlined
        onClick={onOtherClick}
      />
    </div>
  );

  const accountsDialogFooter = (
    <div className='flex flex-wrap flex-row justify-content-center'>
      <Button
        label='Close'
        icon='pi pi-times'
        outlined
        onClick={onAccountsClick}
      />
    </div>
  );

  return (
    <div className='flex  min-h-screen  justify-content-center align-items-start '>
      {/* <div className="flex min-h-screen " style={{ minHeight: '300px' }}> */}
      <Panel>
        <div className='flex justify-content-center text-primary'>
          <div className='text-2xl text-primary-400'>
            {' '}
            Rationes Charitatis Features
          </div>
        </div>
        <div className='grid'>
          {/* Payables Card */}
          <div className='col-12 md:col-6'>
            <div className='card'>
              <Card title='Payables and expenses'>
                <div className='relative size-32 ...'>
                  <div className='absolute top-0 right-0 size-16 ...'>
                    <i
                      onClick={onPayablesClick}
                      className='pi pi-info-circle cursor-pointer '
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                </div>
                <p>Manage suppliers and staff expenses</p>
              </Card>
            </div>
          </div>

          {/* Receivables */}
          <div className='col-12 md:col-6'>
            <div className='card'>
              <Card title='Receivables'>
                <div className='relative size-32 ...'>
                  <div className='absolute top-0 right-0 size-16 ...'>
                    <i
                      onClick={onReceivablesClick}
                      className='pi pi-info-circle cursor-pointer '
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                </div>
                Manage customers and their transactions
              </Card>
            </div>
          </div>

          {/* Grants Card */}
          <div className='col-12 md:col-6'>
            <div className='card'>
              <Card title='Manage Funds'>
                <div className='relative size-32 ...'>
                  <div className='absolute top-0 right-0 size-16 ...'>
                    <i
                      onClick={onGrantsClick}
                      className='pi pi-info-circle cursor-pointer '
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                </div>
                Manage Grants and restricted funds
                {/*  */}
              </Card>
            </div>
          </div>
          {/* VAT card */}
          <div className='col-12 md:col-6'>
            <div className='card'>
              <Card title='VAT - MTD'>
                <div className='relative size-32 ...'>
                  <div className='absolute top-0 right-0 size-16 ...'>
                    <i
                      onClick={onVatClick}
                      className='pi pi-info-circle cursor-pointer '
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                </div>
                VAT returns and reporting
              </Card>
            </div>
          </div>

          {/* Other Features dialog */}
          <div className='col-12 md:col-6'>
            <div className='card'>
              <Card title='Other Features'>
                <div className='relative size-32 ...'>
                  <div className='absolute top-0 right-0 size-16 ...'>
                    <i
                      onClick={onOtherClick}
                      className='pi pi-info-circle cursor-pointer '
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                </div>
                <p>Other Features</p>
                {/*  */}
              </Card>
            </div>
          </div>

          <div className='col-12 md:col-6'>
            <div className='card'>
              <Card title='Account types'>
                <div className='relative size-32 ...'>
                  <div className='absolute top-0 right-0 size-16 ...'>
                    <i
                      onClick={onAccountsClick}
                      className='pi pi-info-circle cursor-pointer '
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                </div>
                <p className='text-primary'>Account type options</p>
                {/*  */}
              </Card>
            </div>
          </div>
        </div>

        <div className='flex justify-content-center flex-wrap gap-3'>
          {/* <Button onClick={() => router.push('/signin')}>Sign in</Button> */}
          <Button onClick={() => router.push('/signin')}>Sign in new</Button>
        </div>
      </Panel>

      <Dialog
        visible={payablesDialog}
        style={{ width: '75vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Customer accounting'
        modal
        closable={false}
        className='p-fluid'
        onHide={() => setPayablesDialog(false)}
        footer={payablesDialogFooter}
      >
        <Panel header='Main Supplier accounting features'>
          <ul className='list-disc'>
            <li>Manage supplier master records</li>
            <li>List and sort supplier master records</li>
            <li>Manage supplier invoices, credit notes, and payments</li>
            <li>
              Upload PDF of the supplier purchase order to the accounting
              document
            </li>
            <li>Report on supplier balances</li>
            <li>Paid and unpaid invoices</li>
            <li>Payment history</li>
            <li>Paying supplier</li>
            <li>Upload staff expense claims</li>
            <li>Paid Expense claims</li>
            <li>Unpaid Expense claims </li>
            <li>Expenses by staff member</li>
          </ul>
        </Panel>
      </Dialog>

      {/** receivables dialog */}
      <Dialog
        visible={receivablesDialog}
        style={{ width: '75vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Customer accounting'
        modal
        closable={false}
        className='p-fluid'
        onHide={() => setReceivablesDialog(false)}
        footer={receivablesDialogFooter}
      >
        <Panel header='Main Customer accounting features'>
          <ul className='list-disc'>
            <li>Manage customer master records</li>
            <li>
              Reporting on customer master records - includes listing and
              sorting
            </li>
            <li>Manage customer invoices, credit notes, and payments</li>
            <li>
              Upload PDF copy of customer invoice and attach to the accounting
              transaction
            </li>
            <li>Upload and attach customer purchase order </li>
            <li>Report on customer balances.</li>
            <li>Paid and Unpaid invoice reports</li>
            <li>Overdue invoice reporting </li>
            <li>Dunning (chasing) over due invoices</li>
          </ul>
        </Panel>
      </Dialog>

      {/** grants dialog */}
      <Dialog
        visible={grantsDialog}
        style={{ width: '75vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Grants and restricted fund accounting'
        modal
        closable={false}
        className='p-fluid'
        onHide={() => setGrantsDialog(false)}
        footer={grantsDialogFooter}
      >
        <Panel header='Main Restricted fund accounting features'>
          <ul className='list-disc'>
            <li>Manage fund master records</li>
            <li>Categorise funds into income, capital etc</li>
            <li>Charity SORP accounting support</li>
            <li>Income & Expenditure and balance by fund reporting</li>
            <li>Generate fund performance reports including funds flow</li>
          </ul>
        </Panel>
      </Dialog>

      {/** VAT dialog */}
      <Dialog
        visible={vatDialog}
        style={{ width: '75vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='VAT'
        modal
        className='p-fluid'
        onHide={() => setVatDialog(false)}
        footer={vatDialogFooter}
      >
        <Panel header='VAT - making tax digital'>
          <ul className='list-disc'>
            <li>VAT accounting</li>
            <li>Submit VAT reports online using HMRC MTD services</li>
            <li>VAT only transactions</li>
            <li>VAT return history</li>
            <li>Documents included in eachreturn</li>
          </ul>
        </Panel>
      </Dialog>

      {/** Other dialog */}
      <Dialog
        visible={otherDialog}
        style={{ width: '75vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Other'
        modal
        closable={false}
        className='p-fluid'
        onHide={() => setOtherDialog(false)}
        footer={otherDialogFooter}
      >
        <Panel header='Other Features'>
          <p className='font-medium'>Multi-organisation</p>
          <ul className='list-disc'>
            <li>Supports Sole trader, partnership, and limited company</li>
            <li>The basic tier supports a single organistion</li>
            <li>Premium tiers support many organisations</li>
          </ul>
          <p className='font-medium'>Security</p>
          <ul className='list-disc'>
            <li>
              Follows best security practices using modern authentication
              methods:
            </li>
            <ul className='list-decimal'>
              <li> Email and password</li>
              <li>Magic Link</li>
              <li>Other Oauth providers such as google</li>
              <li> Passkey</li>
              <li>2 Factor authentication</li>
            </ul>
            <li>Credentials are not held on this site</li>
            <li>
              Role based authorisation so users have access to the features they
              need
            </li>
          </ul>
        </Panel>
      </Dialog>

      {/** Accounts dialog */}
      <Dialog
        visible={accountsDialog}
        style={{ width: '75vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Account type options'
        modal
        className='p-fluid'
        onHide={() => setOtherDialog(false)}
        footer={accountsDialogFooter}
      >
        <Panel header='Account types'>
          <ul className='list-disc'>
            <li>Trial</li>
            <p>
              Use this account when you are looking to explore the
              features.{' '}
            </p>
            <ul className='list-disc'>
              <li>This is a free account that lasts for 1 month</li>
              <li>A single organisation</li>
              <li>upto 100 documents.</li>
            </ul>
            <hr />
            <li>Limited</li>
            <p>
              This is designed for smaller organisations or those staing
              out{' '}
            </p>
            <ul className='list-disc'>
              <li>There is a discounted charge of £10 per month</li>
              <li>100 transactions per month</li>
              <li>No scanned attachments to be added to documents</li>
              <li>A single organisation</li>
            </ul>
            <hr />
            <li>Standard account</li>

            <p>These accounts have the full features of the package</p>
            <ul className='list-disc'>
              <li>All the features of the other account types</li>
              <li>Upload attachments to accounting documents </li>
              <li>Unlimited number of organisations</li>
              <li>Unlimited number of accounting documents</li>
            </ul>
          </ul>
        </Panel>
      </Dialog>
    </div>
  );
}
