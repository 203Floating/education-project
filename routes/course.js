const express = require("express")
const router = express.Router()
const DButils = require("../utils/DButils")
const { success, error } = require("../utils/msg")

// 查询选课任务
router.post("/", async function (request, response, next) {
  try {
    console.log(request.body)
    const res1 = await DButils.excute(
      courseSql.searchSql(request.body, true),
      []
    )
    const res2 = await DButils.excute(courseSql.searchSql(request.body), [])
    const data = res2.map((item) => {
      return {
        ...item,
        total: res1.length,
      }
    })
    response.send(data)
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
    await DButils.excute(courseSql.addSql1(request.body), [])
    await DButils.excute(courseSql.addSql2(request.body), [])
    response.send(success("添加成功"))
  } catch (error) {
    next(error)
  }
})
// 修改选课任务状态
router.post("/updateStatus", async function (request, response, next) {
  try {
    console.log(request.body, "选课任务状态设置")
    await DButils.excute(courseSql.updateStatusSql1, [
      request.body.cs_status,
      request.body.cs_id,
    ])
    response.send(success("修改成功"))
  } catch (error) {
    next(error)
  }
})
//修改选课任务的最多选课和最少选课
router.post("/updateNum", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.updateStatusSql2, [
      request.body.cs_max,
      request.body.cs_min,
      request.body.cs_id,
    ])
    response.send(success("修改成功"))
  } catch (error) {
    next(error)
  }
})
//修改选课人物的可选课程
router.post("/updateSubs", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.updateStatusSql3, [
      request.body.sub_ids,
      request.body.cs_id,
    ])
    response.send(success("修改成功"))
  } catch (error) {
    next(error)
  }
})
//获取连选课程数据
router.get("/link", async function (request, response, next) {
  try {
    const res = await DButils.excute(courseSql.searchLinksql(request.query), [])
    response.send(res)
  } catch (error) {
    next(error)
  }
})
//连选课程添加
router.post("/link", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.linkClassSql, [
      request.body.c_ids,
      request.body.cs_id,
    ])
    response.send(success("连选课程添加成功"))
  } catch (error) {
    next(error)
  }
})
//连选课程删除
router.delete("/link/delete", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.linkClassSql2, [request.query.cs_id])
    response.send(success("连选课程删除成功"))
  } catch (error) {
    next(error)
  }
})
//获取禁止连选课程数据
router.get("/banlink", async function (request, response, next) {
  try {
    const res = await DButils.excute(
      courseSql.searchBanLinksql(request.query),
      []
    )
    response.send(res)
  } catch (error) {
    next(error)
  }
})
//禁止连选课程添加设置
router.post("/banlink", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.banlinkClassSql1, [
      request.body.c_ids,
      request.body.cs_id,
    ])
    response.send(success("连选课程删除成功"))
  } catch (error) {
    next(error)
  }
})
//禁止连选课程删除设置
router.delete("/banlink/delete", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.banlinkClassSql2, [request.query.cs_id])
    response.send(success("连选课程删除成功"))
  } catch (error) {
    next(error)
  }
})
//禁止连选课程设置
//获取禁选课程数据
router.get("/ban", async function (request, response, next) {
  try {
    const res = await DButils.excute(courseSql.searchBansql(request.query), [])
    response.send(res)
  } catch (error) {
    next(error)
  }
})
//添加禁选课程
router.post("/ban", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.banClassSql1, [
      request.body.c_ids,
      request.body.cs_id,
    ])
    response.send(success("禁选课程添加成功"))
  } catch (error) {
    next(error)
  }
})
//删除禁选课程
router.delete("/ban/delete", async function (request, response, next) {
  try {
    await DButils.excute(courseSql.banClassSql2, [request.query.cs_id])
    response.send(success("禁选课程删除成功"))
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
  searchSql: function (body, total) {
    let sql = `SELECT * FROM course_scheduling
                LEFT JOIN course_scheduling_extra ON course_scheduling.cs_id = course_scheduling_extra.cs_id`
    let str = ""
    let offset = 0

    if (body.cs_name) {
      str += ` course_scheduling.cs_name LIKE '%${body.cs_name}%'`
    }

    if (body.cs_status) {
      if (str !== "") str += ` AND`
      str += ` course_scheduling.cs_status = '${body.cs_status}'`
    }

    if (body.cs_id) {
      if (str !== "") str += ` AND`
      str += ` course_scheduling.cs_id = '${body.cs_id}'`
    }

    if (str !== "") {
      sql += ` WHERE ${str}`
    }

    if (!total) {
      sql += ` ORDER BY course_scheduling.cs_id ASC`

      // Add pagination
      if (body.offset) {
        offset = body.offset * 10
      }
      sql += ` LIMIT 10 OFFSET ${offset}`
    }

    return sql
  },

  searchLinksql: function (query) {
    if (query.cs_id) {
      return `select * from course_scheduling_continue where cs_id = ${query.cs_id}`
    } else {
      return `select * from course_scheduling_continue`
    }
  },
  searchBanLinksql: function (query) {
    if (query.cs_id) {
      return `select * from course_scheduling_mutual where cs_id = ${query.cs_id}`
    } else {
      return `select * from course_scheduling_mutual`
    }
  },
  searchBansql: function (query) {
    if (query.cs_id) {
      return `select * from course_forbid where cs_id = ${query.cs_id}`
    } else {
      return `select * from course_forbid`
    }
  },
  deleteSql1: "delete from course_scheduling where cs_id = ?",
  deleteSql2: "delete from course_scheduling_extra where cs_id = ?",
  addSql1: function (body) {
    return (
      "INSERT INTO course_scheduling (cs_status, cs_id, cs_name, cs_title, cs_max, cs_min, cs_date) VALUES ('0', '" +
      body.cs_id +
      "', '" +
      body.cs_name +
      "', '" +
      body.cs_title +
      "', 0, 0, NOW())"
    )
  },
  addSql2: function (body) {
    return (
      "INSERT INTO course_scheduling_extra (cs_id, g_id, c_ids) VALUES (" +
      body.cs_id +
      ", '" +
      body.g_id + // 添加了单引号
      "', '" +
      body.c_ids + // 添加了单引号
      "')"
    )
  },

  linkClassSql:
    "insert into course_scheduling_continue(c_ids,cs_id) values(?,?)",
  linkClassSql2: "delete from course_scheduling_continue where cs_id = ? ",
  banClassSql1: "insert into course_forbid(c_id,cs_id) values(?,?)",
  banClassSql2: "delete from course_forbid where cs_id = ? ",
  banlinkClassSql1:
    "insert into course_scheduling_mutual (c_ids,cs_id) values(?,?)",
  banlinkClassSql2: "delete from course_scheduling_mutual where cs_id = ? ",

  StatusSql: "update assist_class set ac_status = ? where ac_id = ?",
  //选课任务状态设置
  updateStatusSql1:
    "update course_scheduling set cs_status = ? where cs_id = ?",
  updateStatusSql2:
    "update  course_scheduling    set cs_max = ? ,cs_min = ? where cs_id = ?",
  updateStatusSql3:
    "update course_scheduling_extra set sub_ids = ? where cs_id = ?",
  searchClassSql: "select * from assist_class where ac_id = ?",
}
module.exports = router
