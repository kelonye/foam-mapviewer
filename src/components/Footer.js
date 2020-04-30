import React from 'react';
import T1Icon from '@material-ui/icons/Explore';
import T2Icon from '@material-ui/icons/Map';
import T3Icon from '@material-ui/icons/Search';
import T4Icon from '@material-ui/icons/AccountBalanceWallet';

const TABS = [
  { label: 'Near Me', Icon: T1Icon },
  { label: 'My Places', Icon: T2Icon },
  { label: 'Search', Icon: T3Icon },
  { label: 'Wallet', Icon: T4Icon },
];

export default function({ amount }) {
  return (
    <div className="footer flex flex-grow">
      {TABS.map(({ label, Icon }) => (
        <div
          className="flex flex--column flex--grow flex--justify-center flex--align-center"
          key={label}
        >
          <div>{<Icon />}</div>
          <div>{label}</div>
        </div>
      ))}
    </div>
  );
}
