import mysql from 'mysql2/promise';
interface DatabaseConfig {
  host: string,
  user: string,
  password: string,
  database: string,
  port?: number
}
class Database {
  private pool: mysql.Pool;
  constructor(config: DatabaseConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port || 3306
    });
  }
  async query(sql: string, params?: any[]): Promise<any> {
    const connection = await this.pool.getConnection();
    try {
      const [rows, fields] = await connection.query(sql, params);
      return rows;
    } finally {
      connection.release();
    }
  }
  async insert(table: string, data: any): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    return await this.query(sql, values);
  }
  async update(table: string, data: any, where?: any): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    let sql = `UPDATE ${table} SET ${setClause}`;
    if (where) {
      const conditions = Object.entries(where).map(([key, value]) => `${key} = ?`).join(' AND ');
      sql += ` WHERE ${conditions}`;
      values.push(...Object.values(where));
    }
    return await this.query(sql, values);
  }
  async delete(table: string, where?: any): Promise<any> {
    let sql = `DELETE FROM ${table}`;
    if (where) {
      const conditions = Object.entries(where).map(([key, value]) => `${key} = ?`).join(' AND ');
      sql += ` WHERE ${conditions}`;
    }
    return await this.query(sql, Object.values(where || {}));
  }
}
export default Database;