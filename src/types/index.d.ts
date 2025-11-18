import { ReactNode } from 'react';

import {
  AppBreadcrumbProps,
  AppConfigProps,
  AppMenuItemProps,
  AppTopbarRef,
  Breadcrumb,
  BreadcrumbItem,
  ChatContextProps,
  ColorScheme,
  LayoutConfig,
  LayoutContextProps,
  LayoutState,
  MailContextProps,
  MenuContextProps,
  MenuModel,
  MenuProps,
  NodeRef,
  Page,
  TaskContextProps,
  UseSubmenuOverlayPositionProps,
} from './layout';

import { RationesUser, RationesOrganisation, saluationEnum } from './user';

type ChildContainerProps = {
  children: ReactNode;
};

export type {
  Page,
  AppBreadcrumbProps,
  Breadcrumb,
  BreadcrumbItem,
  ColorScheme,
  MenuProps,
  MenuModel,
  MailKeys,
  LayoutConfig,
  LayoutState,
  Breadcrumb,
  LayoutContextProps,
  MailContextProps,
  MenuContextProps,
  ChatContextProps,
  TaskContextProps,
  AppConfigProps,
  NodeRef,
  AppTopbarRef,
  AppMenuItemProps,
  UseSubmenuOverlayPositionProps,
  ChildContainerProps,
  Demo,
  LayoutType,
  SortOrderType,
  CustomEvent,
  ChartDataState,
  ChartOptionsState,
  AppMailSidebarItem,
  AppMailReplyProps,
  AppMailProps,
};

export type { RationesUser, RationesOrganisation };
export enum saluationEnum {
  'Mr',
  'Mrs',
  'Miss',
  'Dr',
  'Professor',
}
