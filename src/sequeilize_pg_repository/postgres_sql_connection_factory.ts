import * as Debug from 'debug';
import {isNil, merge} from 'ramda';
import * as Sequelize from 'sequelize';

const debug: Function = Debug('huf:postgres');
const connections: {[hash: string]: Sequelize.Sequelize} = Object(Symbol('connections'));

export interface IPostgreSqlConnectionConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

function isConnection(connection: Sequelize.Sequelize | undefined): connection is Sequelize.Sequelize {
  return !isNil(connection);
}

/**
 * Creates a hash value for a given instance of IPostgreSqlConnectionFactoryConfig
 * @param {IPostgreSqlConnectionFactoryConfig} config
 * @return {Number} the hash
 */
export function getConfigHash(config: IPostgreSqlConnectionConfig): number {
  if (isNil(config)) {
    return -1;
  }
  const prime: number = 31;
  let result: number = 1;
  result = (prime * result) + (isNil(config.host) ? 0 : djb2Code(config.host));
  result = (prime * result) + (isNil(config.port) ? 0 : config.port);
  result = (prime * result) + (isNil(config.user) ? 0 : djb2Code(config.user));
  result = (prime * result) + (isNil(config.password) ? 0 : djb2Code(config.password));
  result = (prime * result) + (isNil(config.database) ? 0 : djb2Code(config.database));
  return result;
}

/**
 * Create a hash of a given String
 *
 * This algorithm (k=33) was first reported by dan bernstein many years ago in comp.lang.c.
 * another version of this algorithm (now favored by bernstein) uses xor: hash(i) = hash(i - 1) * 33 ^ str[i];
 * the magic of number 33 (why it works better than many other constants, prime or not)
 * has never been * adequately explained.
 *
 * @method djb2Code
 * @param {String} strg the string used to create a hash value
 * @return {Number} hash value of the given String
 * @private
 * @static
 */
const djb2Code: Function = (str: string): number => {
  let hash: number = 5381;
  for (let i: number = 0; i < str.length; i++) {
    const char: number = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    const magicNumber: number = 5;
    hash = ((hash << magicNumber) + hash) + char;  /* hash * 33 + c */ // tslint:disable-line no-bitwise
  }
  return hash;
};

function isIPostgreSqlConnectionFactoryConfig(config: IPostgreSqlConnectionConfig | undefined): config is IPostgreSqlConnectionConfig {
  return config !== undefined;
}

export class PostgreSqlConnectionFactory {

  private configuration?: IPostgreSqlConnectionConfig;

  public get config(): IPostgreSqlConnectionConfig {
    if (!isIPostgreSqlConnectionFactoryConfig(this.configuration)) {
      throw new Error('INVALID_STATE_ERROR: configuration not set');
    }
    return this.configuration;
  }

  public set config(config: IPostgreSqlConnectionConfig)  {
    this.configuration = config;
  }

  /**
   * Returns a sequelize connection for the current configuration.
   *
   * @method getConnection
   * @param {PostgreSqlConnectionFactoryConfig}
   * @return {Sequelize.Sequelize} The connection for the current configuration.
   */
  public getConnection(config?: IPostgreSqlConnectionConfig): Sequelize.Sequelize  {
    if (isNil(this.config) && isNil(config)) {
      throw new Error('Eihter call getConnection with param config or set config of PostgreSqlConnectionFactory or both');
    }

    const postgreSqlConnectionConfig: IPostgreSqlConnectionConfig =  merge(this.config, config);
    const hash: number = getConfigHash(postgreSqlConnectionConfig);
    if (isConnection(connections[hash])) {
      return connections[hash];
    }
    const connection: Sequelize.Sequelize = new Sequelize(
      postgreSqlConnectionConfig.database,
      postgreSqlConnectionConfig.user,
      postgreSqlConnectionConfig.password, {
        host: postgreSqlConnectionConfig.host,
        port: postgreSqlConnectionConfig.port,
        dialect: 'postgres',
        logging: debug,
        operatorsAliases: false,
      });
    debug(`postgre connection to database '${postgreSqlConnectionConfig.database}' established.`);
    connections[hash] = connection;
    return connection;
  }

}
