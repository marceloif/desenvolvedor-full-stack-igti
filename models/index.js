import mongoose from 'mongoose';
import accountModel from './accountModel.js';
import dotenv from 'dotenv';

dotenv.config();

const db = {};

db.url = `mongodb+srv://${process.env.USERDB}:${process.env.PWDDB}@bootcampigti.1dfvi.gcp.mongodb.net/banco?retryWrites=true&w=majority`;
db.mongoose = mongoose;
db.account = accountModel(mongoose);

export { db };
