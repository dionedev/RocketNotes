const knex = require("../database/knex")

class TagsController {
  async listAllUserTags(request, response) {
    const { user_id } = request.params

    const tags = await knex("tags").where({ user_id })

    return response.status(200).json(tags)

  }
}

module.exports = TagsController