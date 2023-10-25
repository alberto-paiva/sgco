// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import AuthService from "@/services/auth.service.ts";

interface CommandProps {
  originalEvent: MouseEvent;
  item: MenuItemModel;
}

export interface MenuItemModel {
  label?: string;
  href?: string;
  target?: never;
  icon?: string;
  separator?: boolean;
  items?: MenuItemModel[];
  subItems?: MenuItemModel[];
  className?: string;
  visible: boolean;
  disabled?: boolean;
  root?: boolean;
  onMenuButtonClick?: ({ originalEvent, item }: CommandProps) => void;
}

const isVisible = !AuthService.userIsCondomino();

export const defaultItems: MenuItemModel[] = [
  {
    // label: 'Início',
    root: true,
    visible: true,
    items: [
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-th-large",
        href: `/`,
        visible: true,
      },
    ],
  },
  { separator: true, visible: true },
  {
    // label: 'Administração',
    root: true,
    visible: true,
    items: [
      {
        label: "Condôminos",
        icon: "pi pi-fw pi-users",
        href: `/condominos/list`,
        visible: true,
      },
      {
        label: "Condôminios",
        icon: "pi pi-fw pi-building",
        href: `/condominios/list`,
        visible: true,
      },
      {
        label: "Síndicos",
        icon: "pi pi-fw pi-eye",
        href: `/sindicos/list`,
        visible: true,
      },
      {
        label: "Endereços",
        icon: "pi pi-fw pi-book",
        href: `/enderecos/list`,
        visible: isVisible,
      },
      {
        label: "Apartamentos",
        icon: "pi pi-fw pi-table",
        href: `/unidades/list`,
        visible: isVisible,
      },
      // {
      //   label: "Mensagens",
      //   icon: "pi pi-fw pi-comment",
      //   href: `/mensagens/list`,
      //   visible: true,
      // },
      {
        label: "Financeiro",
        icon: "pi pi-fw pi-dollar",
        visible: true,
        subItems: [
          {
            label: "Receitas",
            icon: "pi pi-fw pi-arrow-circle-up",
            href: `/receitas/list`,
            visible: isVisible,
          },
          {
            label: "Despesas",
            icon: "pi pi-fw pi-arrow-circle-down",
            href: `/despesas/list`,
            visible: isVisible,
          },
          {
            label: "Mensalidades",
            icon: "pi pi-fw pi-credit-card",
            href: `/mensalidades/list`,
            visible: !isVisible,
          },
        ],
      },
      {
        label: "Relatórios",
        icon: "pi pi-fw pi-chart-bar",
        visible: true,
        subItems: [
          {
            label: "Condôminos",
            icon: "pi pi-fw pi-user",
            href: `/relatorios/condominos`,
            visible: isVisible,
          },
          {
            label: "Unidades",
            icon: "pi pi-fw pi-home",
            href: `/relatorios/unidades`,
            visible: isVisible,
          },
          {
            label: "Financeiro",
            icon: "pi pi-fw pi-sort-numeric-up",
            href: `/relatorios/financeiro`,
            visible: true,
          },
        ],
      },
    ],
  },
  { separator: true, visible: true },
];
