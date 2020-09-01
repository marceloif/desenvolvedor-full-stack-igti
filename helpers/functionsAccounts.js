import { db } from '../models/index.js';

const Account = db.account;

const accountsActive = async (agencia) => {
  const accounts = await Account.find({ agencia: agencia }, { conta: 1 });
  return accounts.length;
};

export default accountsActive;
