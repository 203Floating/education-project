const mysql = require("mysql")

class DButils {
  getConnection() {
    return mysql.createConnection({
      // host: "121.40.208.160",
      host: "127.0.0.1",
      port: 3306,
      database: "小学教务系统",
      user: "root",
      // passsword: "111111",
      password: "200314",
    })
  }
  // 用于执行select语句
  excute(sql, params = []) {
    return new Promise((resolve, reject) => {
      const conn = this.getConnection()
      conn.query(sql, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(JSON.stringify(rows)))
        }
      })
      conn.end()
    })
  }
}

module.exports = new DButils()
