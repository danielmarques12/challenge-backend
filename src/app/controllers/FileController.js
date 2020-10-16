import File from '../models/File';
import User from '../models/User';

class FileController {
  async store(request, response) {
    const { originalname: name, filename: path } = request.file;

    const user_id = request.userId;

    const file = await File.create({
      user_id,
      name,
      path,
    });

    return response.json(file);
  }

  async index(request, response) {
    const user = await User.findByPk(request.userId);

    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }

    // Aprimorar essa Query, pegar só as colunas necessárias =p
    const files = await File.findAll({ where: { user_id: user.id } });

    const files_reponse = files.map((file) => {
      const { url, name } = file;
      return { url, name };
    });

    return response.json(files_reponse);
  }
}

export default new FileController();
