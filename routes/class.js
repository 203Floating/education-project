const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")

// 查询班级
router.post("/", async function (request, response, next) {
  try {
    const res1 = await DButils.excute(
      classSql.searchSql(request.body, true),
      []
    )
    const res2 = await DButils.excute(classSql.searchSql(request.body), [])
    const data = res2.map((item) => {
      return {
        ...item,
        total: res1.length,
      }
    })
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
// 删除班级
router.delete("/delete", async function (request, response, next) {
  try {
    const res = await DButils.excute(classSql.searchStuSql(request.query), [])
    if (res.length !== 0) {
      response.send(error("班级下存在学生，不能删除"))
    } else {
      await DButils.excute(classSql.deleteSql1, [request.query.c_id])
      await DButils.excute(classSql.deleteSql2, [request.query.c_id])
      response.send(success("删除成功"))
    }
  } catch (error) {
    next(error)
  }
})
// 编辑班级
router.post("/edit", async function (request, response, next) {
  try {
    console.log(request.body)

    const res = await DButils.excute("select * from class where c_id = ? ", [
      request.body.c_id,
    ])
    if (res.length === 0) {
      await editData(request.body, classSql.insertSql1, classSql.insertSql2)
      response.send(success("添加成功"))
    } else {
      await editData(request.body, classSql.updateSql1, classSql.updateSql2)
      response.send(success("修改成功"))
    }
  } catch (error) {
    next(error)
  }
})
// 班级编辑
const editData = async (body, sql1, sql2) => {
  await DButils.excute(sql1, [
    body.c_name,
    body.c_headmaster,
    body.c_type,
    body.c_id,
  ])
  await DButils.excute(sql2, [body.g_id, body.t_id, body.c_id])
}
const classSql = {
  searchSql: function (body, total) {
    let offset = 0
    let str = ""
    let sql = `SELECT * FROM class c JOIN class_extra ce ON c.c_id = ce.c_id`

    if (body.g_id && body.c_id) {
      str = `WHERE ce.g_id = '${body.g_id}' AND c.c_id='${body.c_id}' `
    } else if (body.g_id && !body.c_id) {
      str = `WHERE ce.g_id = '${body.g_id}'`
    } else if (!body.g_id && body.c_id) {
      str = `WHERE c.c_id = '${body.c_id}'`
    } else {
      str = ""
    }

    if (str !== "") sql += ` ${str}`

    if (!total) {
      // 归类
      sql += ` ORDER BY c.c_id ASC`
      // 添加分页
      if (body.offset) {
        offset = body.offset * 10
      }
      sql += ` LIMIT 10 OFFSET ${offset}`
    }

    return sql
  },

  // 更新班级数据
  updateSql1: `UPDATE class SET c_name = ?, c_headmaster = ?, c_type = ? WHERE c_id = ?`,
  updateSql2: `UPDATE class_extra SET g_id = ?, t_id = ? WHERE c_id = ?`,

  //添加班级
  insertSql1: `INSERT INTO class (c_name,c_headmaster,c_type,c_id) VALUES (?,?,?,?)`,
  insertSql2: `INSERT INTO class_extra (g_id,t_id,c_id) VALUES (?,?,?)`,
  //删除班级
  deleteSql1: `DELETE FROM class WHERE c_id = ?`,
  deleteSql2: `DELETE FROM class_extra WHERE c_id = ?`,
  //搜索学生
  searchStuSql: function (query) {
    return `select * from student_extra where c_id='${query.c_id}'`
  },
}

module.exports = router
