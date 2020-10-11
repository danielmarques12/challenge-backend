import File from '../models/File';

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
}

export default new FileController();
