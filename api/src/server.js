require('express-async-errors')

const express = require('express')
const migrationsRun = require('./database/sqlite/migrations')
const app = express()
const PORT =  3333
const routes = require('./routes')
const AppError = require('./utils/AppError')

migrationsRun()

app.use(express.json())

app.use(routes)

app.use((error, request, response, next ) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json(
      {
        status: "error",
        message: error.message
      }
    )
  }

  return response.status(500).json(
    {
      status: "error",
      message: "Internal server error"
    }
  )
})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))