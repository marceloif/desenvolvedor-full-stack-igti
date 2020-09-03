import { db } from '../models/index.js';
import accountsActive from '../helpers/functionsAccounts.js';
import { formatNumberCurrency as formatCurrency } from '../helpers/formatNumber.js';

const Account = db.account;

const findOne = async (req, res) => {
  const agencia = Number(req.params.agencia);
  const conta = Number(req.params.conta);

  try {
    const dataFind = await Account.findOne(
      {
        $and: [{ agencia: agencia }, { conta: conta }],
      },
      { _id: 0, balance: 1 }
    );

    if (!dataFind) {
      res.send('Não foi encontrada a conta/agência');
    } else {
      res.send(dataFind);
    }
  } catch (error) {
    res.status(404).send(`Erro ao buscar conta ${conta} / agencia ${agencia}`);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Account.find();
    res.send(data);
  } catch (error) {
    res.status(500).send('Registros não encontrados' + error);
  }
};

const updateDeposit = async (req, res) => {
  const agencia = Number(req.params.agencia);
  const conta = Number(req.params.conta);
  const deposito = Number(req.params.deposito);
  try {
    const dataDeposit = await Account.findOneAndUpdate(
      {
        $and: [{ agencia: agencia }, { conta: conta }],
      },
      { $inc: { balance: deposito } },
      {
        new: true,
      }
    );
    if (!dataDeposit) {
      res.send('Não foi encontrada a conta/agência');
    } else {
      res.send(dataDeposit);
    }
  } catch (error) {
    res.status(500).send('Erro a tentar localizar/atualizar conta ' + error);
  }
};

const updateDepositPatch = async (req, res) => {
  const agencia = Number(req.params.agencia);
  const conta = Number(req.params.conta);
  const deposito = Number(req.params.deposito);
  try {
    const dataDeposit = await Account.findOneAndUpdate(
      {
        $and: [{ agencia: agencia }, { conta: conta }],
      },
      { $inc: { balance: deposito } },
      {
        new: true,
      }
    );
    if (!dataDeposit) {
      res.send('Não foi encontrada a conta/agência');
    } else {
      res.send(dataDeposit);
    }
  } catch (error) {
    res.status(500).send('Erro a tentar localizar/atualizar conta ' + error);
  }
};

//Função para saque de valores
const updateWithdraw = async (req, res) => {
  const agencia = Number(req.params.agencia);
  const conta = Number(req.params.conta);
  const saque = Number(req.params.saque);
  let dataWithdraw = [];
  const tarifa = 1;

  try {
    const dataFind = await Account.findOne(
      {
        $and: [{ agencia: agencia }, { conta: conta }],
      },
      { _id: 0, balance: 1 }
    );

    if (!dataFind) {
      res.send('Não foi encontrada a conta/agência');
    } else {
      if (dataFind.balance < saque + tarifa) {
        res.send(
          `Saque não pode ser realizado. Saldo Atual R$ ${dataFind.balance}`
        );
      } else {
        const balanceAtual = dataFind.balance - saque - tarifa;
        dataWithdraw = await Account.findOneAndUpdate(
          {
            $and: [{ agencia: agencia }, { conta: conta }],
          },
          { $set: { balance: balanceAtual } },
          {
            new: true,
          }
        );
      }
      res.send(`Saldo atual: R$ ${dataWithdraw.balance}, Tarifa da operação: R$ ${tarifa}.
      `);
    }
  } catch (error) {
    res.status(500).send(`Erro ao tentar localizar/atualizar conta (${error})`);
  }
};

const updateTransfer = async (req, res) => {
  const accountSource = Number(req.params.source);
  const accountDestiny = Number(req.params.destiny);
  const value = Number(req.params.value);
  let agenciaSource = [];
  let agenciaDestiny = [];
  let dataSetSource = [];
  const tarifa = 8;
  try {
    agenciaSource = await Account.find(
      { conta: accountSource },
      { _id: 0, agencia: 1, balance: 1 }
    );
    agenciaDestiny = await Account.find(
      { conta: accountDestiny },
      { _id: 0, agencia: 1 }
    );

    const dataSetDestiny = await Account.updateOne(
      { conta: accountDestiny },
      { $inc: { balance: value } }
    );
    dataSetSource = await Account.updateOne(
      { conta: accountSource },
      { $inc: { balance: -value } }
    );

    if (agenciaSource[0].agencia !== agenciaDestiny[0].agencia) {
      dataSetSource = await Account.updateOne(
        { conta: accountSource },
        { $inc: { balance: -tarifa } }
      );
    }
    const accountSourceAtual = await Account.find({
      conta: accountSource,
    });
    res.send(accountSourceAtual);
  } catch (error) {
    res.status(500).send('Erro ao realizar a transferência: ' + error);
  }
};

const findAverageBalance = async (req, res) => {
  const agencia = Number(req.params.agencia);

  try {
    const dataAverageBalance = await Account.aggregate([
      { $match: { agencia: agencia } },
      { $group: { _id: '$agencia', balance: { $avg: '$balance' } } },
    ]);
    const average = dataAverageBalance[0].balance;
    res.send(`A média dos saldos da agência ${agencia} é: ${average}`);
  } catch (error) {
    res.status(500).send('Erro ao consultar o banco de dados: ' + error);
  }
};

const findSmaller = async (req, res) => {
  const numCustomers = Number(req.params.numCustomers);

  try {
    const dataSmallerBalance = await Account.find({})
      .sort({ balance: 1, agencia: 1, conta: 1 })
      .limit(numCustomers);

    res.send(dataSmallerBalance);
  } catch (error) {
    res.status(500).send('Erro ao consultar o banco de dados: ' + error);
  }
};

const findClientRichers = async (req, res) => {
  const numCustomers = Number(req.params.numCustomers);

  try {
    const dataClientRichers = await Account.find({})
      .sort({ balance: -1, name: 1, agencia: 1, conta: 1 })
      .limit(numCustomers);

    res.send(dataClientRichers);
  } catch (error) {
    res.status(500).send('Erro ao consultar o banco de dados: ' + error);
  }
};

const setClientPrivate = async (req, res) => {
  try {
    const agencias = await Account.distinct('agencia');

    for (const agencia of agencias) {
      const dataClientRicher = await Account.find(
        { agencia: agencia },
        { _id: 1 }
      )
        .sort({ balance: -1, name: 1 })
        .limit(1);
      const idClient = dataClientRicher[0]._id;
      const dataSetPrivate = await Account.findByIdAndUpdate(
        { _id: idClient },
        { agencia: 99 },
        {
          new: true,
        }
      );
    }
    const clientPrivate = await Account.find({ agencia: 99 }).sort({
      balance: -1,
    });
    res.send(clientPrivate);
  } catch (error) {
    res.status(500).send('Erro ao consultar o banco de dados: ' + error);
  }
};

const remove = async (req, res) => {
  const agencia = Number(req.params.agencia);
  const conta = Number(req.params.conta);

  try {
    const data = await Account.deleteOne({
      $and: [{ agencia: agencia }, { conta: conta }],
    });

    if (!data) {
      res.send(`Não foi encontrado a conta:  ${conta} para o banco ${banco} `);
    } else {
      res.send(
        `Conta excluída com sucesso! 
        Agência: ${agencia} Contas Ativas: ${await accountsActive(agencia)}`
      );
    }
  } catch (error) {
    res.status(500).send('Erro ao excluir o conta: ' + conta + ' ' + error);
  }
};

export default {
  findOne,
  findAll,
  updateDeposit,
  updateDepositPatch,
  updateWithdraw,
  updateTransfer,
  findAverageBalance,
  findSmaller,
  findClientRichers,
  setClientPrivate,
  remove,
};
