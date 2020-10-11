import * as yup from 'yup';
import User from '../models/User';

class UserController {
  async store(request, response) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(5),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation failed' });
    }

    const userExists = await User.findOne({
      where: { email: request.body.email },
    });

    if (userExists) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(request.body);

    return response.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
