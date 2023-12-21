const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")

// 查询选修课
router.post("/", async function (request, response, next) {
  try {
    const data = await DButils.excute(courseSql.searchSql1(request.query), [])
    const data2 = await DButils.excute(courseSql.searchSql2, [
      request.query.cs_id,
    ])
    response.send(success({ data, data2 }))
  } catch (error) {
    next(error)
  }
})
// 删除选课任务
router.delete("/delete", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.deleteSql1, [request.query.cs_id])
    await DButils.excute(courseSql.deleteSql2, [request.query.cs_id])
    response.send(success("删除成功"))
  } catch (error) {
    next(error)
  }
})
// 添加选课任务
router.post("/add", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.addSql1(request.query), [])
    await DButils.excute(courseSql.addSql2(request.query), [])
    response.send(success("添加成功"))
  } catch (error) {
    next(error)
  }
})
// 修改选课任务状态
router.post("/update", async function (request, response, next) {
  try {
    await DButils.excute(classSql.updateStatusSql, [
      request.query.cs_status,
      request.query.cs_id,
    ])
    response.send(success("修改成功"))
  } catch (error) {
    next(error)
  }
})
//禁选课程设置
router.post("/ban", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.banStatusSql, [
      request.query.ac_status,
      request.query.ac_id,
    ])
    response.send(success("禁选课程设置成功"))
  } catch (error) {
    next(error)
  }
})
//连选课程设置
router.post("/link", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.linkClassSql1, [
      request.query.c_id1,
      request.query.c_id2,
    ])
    await DButils.excute(courseSql.linkClassSql2, [
      request.query.c_id1,
      request.query.c_id2,
    ])
    response.send(success("连选课程添加成功"))
  } catch (error) {
    next(error)
  }
})
router.delete("/link/delete", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.linkClassSql3, [
      request.query.c_id1,
      request.query.c_id2,
    ])
    await DButils.excute(courseSql.linkClassSql4, [
      request.query.c_id1,
      request.query.c_id2,
    ])
    response.send(success("连选课程删除成功"))
  } catch (error) {
    next(error)
  }
})
//禁止连选课程设置
router.post("/banlink", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.banlinkClassSql1, [
      request.query.c_id1,
      request.query.c_id2,
    ])
    await DButils.excute(courseSql.banlinkClassSql2, [
      request.query.c_id1,
      request.query.c_id2,
    ])
    response.send(success("连选课程删除成功"))
  } catch (error) {
    next(error)
  }
})
router.delete("/banlink/delete", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.banlinkClassSql3, [
      request.query.c_id1,
      request.query.c_id2,
    ])
    await DButils.excute(courseSql.banlinkClassSql4, [
      request.query.c_id1,
      request.query.c_id2,
    ])
    response.send(success("连选课程删除成功"))
  } catch (error) {
    next(error)
  }
})
// 判断该选修课程是否已经存在
const existClass = async function (cs_id) {
  const data = await DButils.excute(courseSql.searchClassSql, [cs_id])
  return data.length > 0
}
const courseSql = {
  searchSql1: function (query) {
    let sql = "select * from course_scheduling"
    let str = ""
    if (query.cs_name) {
      str = str + " cs_name like '%" + query.cs_name + "%'"
    }
    if (query.cs_id) {
      if (str !== "") {
        str = str + " and "
      }
      str = str + " cs_id = " + query.cs_id
    }
    if (str !== "") {
      sql = sql + " where " + str
    }
    return sql
  },
  searchSql2: "select * from course_scheduling_extra where cs_id = ?",
  deleteSql1: "delete from course_scheduling where cs_id = ?",
  deleteSql2: "delete from course_scheduling_extra where cs_id = ?",
  addSql1: function (query) {
    return (
      "insert into course_scheduling(cs_status,cs_id,cs_name,cs_title,cs_max,cs_min,cs_date) values('0'," +
      query.cs_id +
      ",'" +
      query.cs_name +
      "','" +
      query.cs_title +
      "'," +
      query.cs_max +
      "," +
      query.cs_min +
      ", NOW())"
    )
  },
  addSql2: function (query) {
    return (
      "insert into course_scheduling_extra(cs_id,sub_ids,t_id,g_id,c_ids) values(" +
      query.cs_id +
      ",'" +
      query.sub_ids +
      "','" +
      query.t_id +
      "'," +
      query.g_id +
      ",'" +
      query.c_ids +
      "')"
    )
  },
  linkClassSql1:
    "insert into course_scheduling_continue(c_id1,c_id2) values(?,?)",
  linkClassSql2:
    "insert into course_scheduling_continue(c_id2,c_id1) values(?,?)",
  linkClassSql3:
    "delete from course_scheduling_continue where c_id1 = ? and c_id2 = ? ",
  linkClassSql4:
    "delete from course_scheduling_continue where c_id2 = ? and c_id1 = ? ",
  banlinkClassSql1:
    "insert into course_scheduling_mutual (c_id1,c_id2) values(?,?)",
  banlinkClassSql2:
    "insert into course_scheduling_mutual (c_id2,c_id1) values(?,?)",
  banlinkClassSql3:
    "delete from course_scheduling_mutual where c_id1 = ? and c_id2 = ? ",
  banlinkClassSql4:
    "delete from course_scheduling_mutual where c_id2 = ? and c_id1 = ?",
  banStatusSql: "update assist_class set ac_status = ? where ac_id = ?",
  updateStatusSql: "update course_scheduling set cs_status = ? where cs_id = ?",
  searchClassSql: "select * from assist_class where ac_id = ?",
}
module.exports = router
