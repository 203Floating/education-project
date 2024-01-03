const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const session = require("express-session")
const cors = require("cors")

const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")
const schoolsRouter = require("./routes/school")
const teacherRouter = require("./routes/teacher")
const studentRouter = require("./routes/student")
const classRouter = require("./routes/class")
const courseRouter = require("./routes/course")
const assist_classRouter = require("./routes/assist_class")
const gradeRouter = require("./routes/grade")
const subjectRouter = require("./routes/subject")
const timetableRouter = require("./routes/timetable.js")

const { jwtAuth, tokenStr } = require("./utils/JwtUtils.js")

const app = express()

// 框架前置 验证token
app.use(jwtAuth)

app.use(cors())

app.use(
  session({
    secret: "hello", // 用于签名 sessionID 的密钥
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
)

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/schools", schoolsRouter)
app.use("/teacher", teacherRouter)
app.use("/student", studentRouter)
app.use("/class", classRouter)
app.use("/course", courseRouter)
app.use("/assistclass", assist_classRouter)
app.use("/grade", gradeRouter)
app.use("/subject", subjectRouter)
app.use("/timetable", timetableRouter)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send(err.message)
})

module.exports = app
