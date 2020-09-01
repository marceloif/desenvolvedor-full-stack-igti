import express from 'express';

import accountController from '../controllers/accountsController.js';

const app = express();

app.get('/account/:agencia/:conta', accountController.findOne);

app.get('/account', accountController.findAll);

app.put('/account/:agencia/:conta/:deposito', accountController.updateDeposit);

app.put(
  '/account/saque/:agencia/:conta/:saque',
  accountController.updateWithdraw
);

app.get('/account/:agencia', accountController.findAverageBalance);

app.get(
  '/account/smaller/cliente/:numCustomers',
  accountController.findSmaller
);

app.get(
  '/account/client/richers/:numCustomers',
  accountController.findClientRichers
);

app.post('/account/clientPrivate', accountController.setClientPrivate);
app.put(
  '/account/transfer/:source/:destiny/:value',
  accountController.updateTransfer
);

app.delete('/account/:agencia/:conta', accountController.remove);

export { app as accountRouter };
