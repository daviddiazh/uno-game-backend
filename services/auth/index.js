import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authSchema from '../../models/auth.js';

export class AuthService {
    constructor() {
        this.hashService = bcrypt;
        this.jwtService = jwt;
        this.db = authSchema;
    }
  
    async login(payload) {
      const responseEntity = new ResponseEntity({
        code: 401,
        title: 'Error al iniciar sesión',
        description: 'Revisa los datos por favor',
      });
  
      try {
        const { email, password: passwordReq } = payload;
  
        const user = await this.db.findOne({ email: email.toLowerCase() });
  
        if (!user) throw new Error(responseEntity);
  
        const isMatchPasswords = await this.hashService.compare(
          passwordReq,
          user?.password,
        );
  
        if (!isMatchPasswords) {
          throw new Error(responseEntity);
        }
  
        delete user.password;
  
        return {
          user,
          token: this.jwtService.sign({ _id: user?._id + '' }, process.env.JWT_KEY),
        };
      } catch (error) {
        throw new Error(responseEntity);
      }
    }

    async enrollment(payload) {
        const responseEntity = new ResponseEntity({
            code: 401,
            title: 'Error al iniciar sesión',
            description: 'Revisa los datos por favor',
        });
        try {
            const user = await this.db.findOne({
                email: payload.email.toLowerCase(),
            });
        
            if (user) throw new Error(responseEntity);
        
            const passwordEncrypted = await this.hashService.hash(payload.password, 10);
        
            await this.db.create({
                ...payload,
                email: payload.email.toLowerCase(),
                password: passwordEncrypted,
            });
        
            return {
                enrolled: true,
            };
        } catch (error) {
            throw new Error(responseEntity);
        }
    }
}

export class ResponseEntity {
    constructor({ code, title, description, }) {
      this.error = {
        code,
        title,
        description,
      };
    }
}
