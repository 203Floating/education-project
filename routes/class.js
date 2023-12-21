const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")
// 查询班级
router.post("/", async function (request, response, next) {
  try {
    const data = await DButils.excute(classSql.searchSql(request.query), [])
    response.send(success(data))
  } catch (error) {
    next(error)
  }
})
// 删除班级
router.delete("/delete", async function (request, response, next) {
  try {
    if (!(await toSearch(request.query.c_id, 2))) {
      response.send(error("班级不存在"))
    } else if (
      (await DButils.excute(classSql.searchSql(request.query), []).length) !== 0
    ) {
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
    for (let item of request.query.t_id.split(",")) {
      if (!(await toSearch(item, 0))) {
        response.send(error("不能输入不存在的教师"))
        response.end()
      }
    }
    if (!(await toSearch(request.query.c_headmaster, 0))) {
      response.send(error("不能输入不存在的教师"))
    }
    if (!(await toSearch(request.query.g_id, 1))) {
      response.send(error("不能输入不存在的年级"))
    }
    if (await toSearch(request.query.c_id, 2)) {
      await editData(request.query, classSql.updateSql1, classSql.updateSql2)
      response.send(success("修改成功"))
    }
    if (!(await toSearch(request.query.c_id, 2))) {
      await editData(request.query, classSql.insertSql1, classSql.insertSql2)
      response.send(success("添加成功"))
    }
  } catch (error) {
    next(error)
  }
})
// 班级编辑
const editData = async (query, sql1, sql2) => {
  await DButils.excute(sql1, [query.c_name, query.c_headmaster, query.c_id])
  await DButils.excute(sql2, [query.g_id, query.t_id, query.c_id])
}
// 搜索班级,年级，教师等信息的存在
const toSearch = async (item, id) => {
  let res = ""
  if (id === 0) {
    res = await DButils.excute(classSql.searchTeacherSql, [item])
    console.log(res, `teacher`)
  }
  if (id === 1) {
    res = await DButils.excute(classSql.searchGradeSql, [item])
    console.log(res, `grade`)
  }
  if (id === 2) {
    res = await DButils.excute(classSql.searchClassSql, [item])
  }
  if (res.length === 0) {
    return false
  }
  return true
}
const classSql = {
  searchSql: function (query) {
    if (query.g_id && query.c_id) {
      return `SELECT * FROM class c JOIN class_extra ce ON c.c_id = ce.c_id WHERE ce.g_id = '${query.g_id}' AND c.c_id = '${query.c_id}'`
    } else if (query.g_id && !query.c_id) {
      return `SELECT * FROM class c JOIN class_extra ce ON c.c_id = ce.c_id WHERE ce.g_id = '${query.g_id}'`
    } else if (!query.g_id && query.c_id) {
      return `SELECT * FROM class WHERE c_id = '${query.c_id}'`
    } else {
      return `SELECT * FROM class`
    }
  },
  // 更新班级数据
  updateSql1: `UPDATE class SET c_name = ?,c_headmaster = ? WHERE c_id = ?`,
  updateSql2: `UPDATE class_extra SET g_id = ? , t_id = ? WHERE c_id = ?`,
  //添加班级
  insertSql1: `INSERT INTO class (c_name,c_headmaster,c_id) VALUES (?,?,?)`,
  insertSql2: `INSERT INTO class_extra (g_id,t_id,c_id) VALUES (?,?,?)`,
  //删除班级
  deleteSql1: `DELETE FROM class WHERE c_id = ?`,
  deleteSql2: `DELETE FROM class_extra WHERE c_id = ?`,

  searchTeacherSql: `SELECT * FROM teacher WHERE t_id = ?`,
  searchGradeSql: `SELECT * FROM grade WHERE g_id = ?`,
  searchClassSql: `SELECT * FROM class WHERE c_id = ?`,
}

module.exports = router
