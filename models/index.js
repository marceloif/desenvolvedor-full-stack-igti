import mongoose from 'mongoose';
import accountModel from './accountModel.js';

const db = {};

db.url =
  'mongodb+srv://igti-2020:@DB-IGTI2020@bootcampigti.1dfvi.gcp.mongodb.net/banco?retryWrites=true&w=majority';
db.mongoose = mongoose;
db.account = accountModel(mongoose);

export { db };
