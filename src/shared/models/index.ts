import { Request } from 'express';

import { User } from '../../database/entities/user.entity';

export interface AppRequest extends Request {
  user?: User;
}
