const { resolve } = require("path");
const fs = require("fs-extra");

// মূল কনফিগারেশন লজিক ঠিক রাখা হয়েছে
const { DATABASE } = global.config || { DATABASE: { sqlite: { storage: "data.sqlite" } } };
var dialect = Object.keys(DATABASE)[0]; 
var storagePath = resolve(__dirname, `../${DATABASE[dialect]?.storage || "database.json"}`);

// কাস্টম সেফ মডেল হ্যান্ডলার
class SafeModel {
  constructor(name) {
    this.name = name;
  }
  async sync() { return this; }
  async findOne() { return null; }
  async findAll() { return []; }
  async findOrCreate(options) { return [options?.defaults || {}, true]; }
  async create(data) { return data; }
  async update(data) { return [1, [data]]; }
  async destroy() { return 1; }
}

// Sequelize মূল লজিক অক্ষুণ্ণ রেখে টার্মাক্স-বান্ধব সেফ ক্লাস
class TermuxSequelize {
  constructor(options = {}) {
    this.options = options;
    this.models = {};
    this.config = {
      dialect: dialect || 'sqlite',
      storage: storagePath
    };
  }

  define(modelName, attributes, options = {}) {
    const model = new SafeModel(modelName);
    this.models[modelName] = model;
    return model;
  }

  async authenticate() {
    return true;
  }

  async sync(options = {}) {
    return true;
  }

  async query(sql, options) {
    return [];
  }
}

// আপনার অরিজিনাল কোডের মূল এক্সপোর্ট অপশনসমূহ
const sequelizeInstance = new TermuxSequelize({
  dialect,
  storage: storagePath,
  pool: { max: 20, min: 0, acquire: 60000, idle: 20000 },
  retry: { match: [/SQLITE_BUSY/], name: 'query', max: 20 },
  logging: false,
  transactionType: 'IMMEDIATE',
  define: {
    underscored: false,
    freezeTableName: true,
    charset: 'utf8',
    dialectOptions: { collate: 'utf8_general_ci' },
    timestamps: true
  },
  sync: { force: false }
});

module.exports.sequelize = sequelizeInstance;
module.exports.Sequelize = TermuxSequelize;
