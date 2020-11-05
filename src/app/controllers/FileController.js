import PDFKit from 'pdfkit';
import fs from 'fs';
import crypto from 'crypto';
import File from '../models/File';
import User from '../models/User';

class FileController {
  async store(request, response) {
    const { transcription, time } = request.body;

    const pdf = new PDFKit();

    // const pdfData = Object.keys(transcription).map((index) =>
    //   JSON.parse(transcription[Number(index)])
    // );

    // console.log(pdfData);

    pdf.text(transcription);

    const path = `${crypto.randomBytes(12).toString('hex')}.pdf`;
    pdf.pipe(
      fs.createWriteStream(
        `/home/daniel/Documents/challenge/backend/tmp/uploads/${path}`
      )
    );
    pdf.end();

    const name = `${time}.pdf`;
    const user_id = request.userId;

    const file = await File.create({
      user_id,
      path,
      name,
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

  async show(request, response) {
    const { time } = request.body;

    const file = await File.findOne({
      where: { user_id: request.userId, name: `${time}.pdf` },
    });

    const { name, url } = file;

    return response.json({
      name,
      url,
    });
  }
}

export default new FileController();
