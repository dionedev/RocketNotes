const { hash, compare } = require("bcryptjs")
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class UsersController {

  async create(request, response) {
    const { name, email, password } = request.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)" , [email])

    if(checkUserExists) {
      throw new AppError("Este email já está em uso.")
    }

    const hashedPassword = await hash(password, 8)

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])
    
    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, current_password, new_password } = request.body
    const { id } = request.params

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if(!user) {
      throw new AppError("Usuário não encontrado")
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.")
    }

    user.name = name
    user.email = email

    if(new_password && !current_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
    }

    if(new_password && current_password) {
      const checkCurrentPassword = await compare(current_password, user.password)

      if(!checkCurrentPassword) {
        throw new AppError("A senha antiga não confere.")
      }

      user.password = await hash(new_password, 8)
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = ?
      WHERE id = ?`, [user.name, user.email, user.password, new Date(), id]
    )

    return response.status(200).json()
  }
}
module.exports = UsersController